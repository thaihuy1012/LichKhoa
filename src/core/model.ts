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
  layout: 'month' | 'agenda' | 'todo';
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
  const device = rawDevice as unknown as DeviceSpec;

  const rawDesign = isPlainObject(raw['design']) ? raw['design'] : {};
  const rawGoogle = isPlainObject(raw['google']) ? raw['google'] : {};

  const base = defaultState(device);

  // v1.3: gộp design (bản sao, không đụng rawDesign/raw), rồi tách noteText cũ ra thành Note pinned.
  const mergedDesign: Record<string, unknown> = { ...defaultDesign(), ...rawDesign };
  const legacyNoteText = typeof mergedDesign['noteText'] === 'string' ? (mergedDesign['noteText'] as string) : '';
  delete mergedDesign['noteText'];

  const rawNotes = raw['notes'];
  const notes: Note[] = Array.isArray(rawNotes)
    ? (rawNotes as Note[])
    : legacyNoteText !== ''
      ? [{ id: `note-${Date.now()}`, title: '', body: legacyNoteText, pinned: true, updated: Date.now() }]
      : [];

  return {
    ...base,
    ...raw,
    notes,
    design: mergedDesign as unknown as DesignConfig,
    google: { ...base.google, ...rawGoogle } as AppState['google'],
  } as AppState;
}
