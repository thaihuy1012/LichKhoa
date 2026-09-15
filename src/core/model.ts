import { DEVICES } from '../render/devices';

export type ISODate = string; // 'YYYY-MM-DD' theo giờ địa phương
export type Repeat = 'none' | 'daily' | 'weekdays' /* v1.3: T2-T6 */ | 'weekly' | 'monthly' | 'yearly';

export interface LocalEvent {
  id: string;
  title: string;
  date: ISODate;
  time?: string; // 'HH:mm'
  durationMin?: number;
  repeat: Repeat;
  until?: ISODate;
  color?: string;
  alarmMin?: number; // v1.3: phút nhắc trước, 0/thiếu = không nhắc -> VALARM trong .ics
  createdAt?: number; // v1.6 (B-003): mốc tạo (ms), dùng để chọn cái tạo sau khi trùng local/Google
}

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  order: number;
  due?: ISODate; // v1.3
}

export interface Note {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  updated: number;
} // v1.3 - toi da 1 note pinned

export interface Occurrence {
  id: string;
  sourceId: string;
  source: 'local' | 'google';
  title: string;
  date: ISODate;
  time?: string;
  allDay: boolean;
  color?: string;
  endTime?: string; // v1.5 D-024: 'HH:mm' giờ kết thúc, chỉ khi có time, kết thúc cùng ngày và sau time
  createdAt?: number; // v1.6 (B-003): mốc tạo (ms), dùng để chọn cái tạo sau khi trùng local/Google
}

export interface DeviceSpec {
  id: string;
  label: string;
  width: number;
  height: number;
  safeTop: number; // tỉ lệ 0..1 của height
  safeBottom: number; // tỉ lệ 0..1 của height
}

export interface DesignConfig {
  layout: 'month' | 'agenda' | 'todo' | 'week'; // v1.5
  showNote: boolean;
  bg: { kind: 'photo' | 'solid' | 'gradient'; color: string; color2?: string };
  blur: 0 | 1 | 2 | 3;
  dim: number;
  textColor: string;
  accentColor: string;
  font: 'sans' | 'serif' | 'mono';
  position: 'top' | 'middle' | 'bottom';
  scale: number;
  boxAlpha: number;
  agendaDays: number;
  weekStart: 0 | 1;
  hour12: boolean;
  lang: 'vi' | 'en';
  showLunar: boolean;
  monthList: boolean; // v1.4 (D-018): bố cục Tháng có danh sách sự kiện/to-do bên dưới lưới
}

export interface AppState {
  version: 1;
  events: LocalEvent[];
  todos: Todo[];
  notes: Note[]; // v1.3
  design: DesignConfig;
  device: DeviceSpec;
  google: {
    clientId: string;
    calendarIds: string[];
    cache: { events: Occurrence[]; fetchedAt: number } | null;
  };
  shortcutName: string;
}

export interface RenderData {
  today: ISODate;
  occurrences: Occurrence[];
  todos: Todo[];
  note: string;
  noteTitle?: string; // v1.3
}

export function defaultDesign(): DesignConfig {
  return {
    layout: 'month',
    showNote: false,
    bg: { kind: 'solid', color: '#000000' },
    blur: 0,
    dim: 0,
    textColor: '#ffffff',
    accentColor: '#ffffff',
    font: 'sans',
    position: 'middle',
    scale: 1,
    boxAlpha: 1,
    agendaDays: 7,
    weekStart: 1,
    hour12: false,
    lang: 'vi',
    showLunar: true,
    monthList: true,
  };
}

export function defaultState(device: DeviceSpec): AppState {
  return {
    version: 1,
    events: [],
    todos: [],
    notes: [],
    design: defaultDesign(),
    device,
    google: { clientId: '', calendarIds: [], cache: null },
    shortcutName: 'DatHinhNen',
  };
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Nạp state cũ/không rõ nguồn gốc an toàn: trả null nếu không hợp lệ, ngược lại bù các trường thiếu bằng mặc định. Không mutate `raw`. */
export function normalizeState(raw: unknown): AppState | null {
  if (!isPlainObject(raw)) return null;
  if (raw['version'] !== 1) return null;

  const rawDevice = raw['device'];
  if (
    !isPlainObject(rawDevice) ||
    typeof rawDevice['width'] !== 'number' ||
    typeof rawDevice['height'] !== 'number'
  ) {
    return null;
  }
  // T-2.14: bù các trường thiếu (safeTop/safeBottom/id/label) từ preset trùng kích thước nếu có,
  // ngược lại mặc định 0.30/0.14, id 'custom' (tránh NaN khi render, S4 tồn đọng T-1.7).
  const width = rawDevice['width'] as number;
  const height = rawDevice['height'] as number;
  const preset = DEVICES.find((d) => d.width === width && d.height === height);
  const device: DeviceSpec = {
    id: typeof rawDevice['id'] === 'string' ? (rawDevice['id'] as string) : (preset?.id ?? 'custom'),
    label: typeof rawDevice['label'] === 'string' ? (rawDevice['label'] as string) : (preset?.label ?? `Tùy chỉnh ${width}×${height}`),
    width,
    height,
    safeTop: typeof rawDevice['safeTop'] === 'number' ? (rawDevice['safeTop'] as number) : (preset?.safeTop ?? 0.3),
    safeBottom: typeof rawDevice['safeBottom'] === 'number' ? (rawDevice['safeBottom'] as number) : (preset?.safeBottom ?? 0.14),
  };

  const rawDesign = isPlainObject(raw['design']) ? raw['design'] : {};
  const rawGoogle = isPlainObject(raw['google']) ? raw['google'] : {};

  const base = defaultState(device);

  // v1.3: gộp design (bản sao, không đụng rawDesign/raw), rồi tách noteText cũ ra thành Note pinned.
  const mergedDesign: Record<string, unknown> = { ...defaultDesign(), ...rawDesign };
  const legacyNoteText = typeof mergedDesign['noteText'] === 'string' ? (mergedDesign['noteText'] as string) : '';
  delete mergedDesign['noteText'];

  const rawNotes = raw['notes'];
  const notesFromLegacy: Note[] = legacyNoteText !== ''
    ? [{ id: `note-${Date.now()}`, title: '', body: legacyNoteText, pinned: true, updated: Date.now() }]
    : [];
  const notes: Note[] = Array.isArray(rawNotes)
    ? clampPinned((rawNotes as unknown[]).filter(isPlainObject) as unknown as Note[])
    : notesFromLegacy;

  const events: unknown[] = Array.isArray(raw['events']) ? (raw['events'] as unknown[]).filter(isPlainObject) : [];
  const todos: unknown[] = Array.isArray(raw['todos']) ? (raw['todos'] as unknown[]).filter(isPlainObject) : [];

  return {
    ...base,
    ...raw,
    device,
    events: events as AppState['events'],
    todos: todos as AppState['todos'],
    notes,
    design: mergedDesign as unknown as DesignConfig,
    google: { ...base.google, ...rawGoogle } as AppState['google'],
  } as AppState;
}

/** Giữ tối đa 1 ghi chú `pinned`: nếu có > 1, chỉ giữ ghim cái `updated` lớn nhất, các cái còn lại bỏ ghim. Không mutate mảng gốc. */
function clampPinned(notes: Note[]): Note[] {
  const pinned = notes.filter((n) => n.pinned === true);
  if (pinned.length <= 1) return notes;
  const keepId = pinned.reduce((best, n) => ((n.updated ?? 0) > (best.updated ?? 0) ? n : best)).id;
  return notes.map((n) => (n.pinned && n.id !== keepId ? { ...n, pinned: false } : n));
}
