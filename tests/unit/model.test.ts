import { describe, it, expect } from 'vitest';
import { normalizeState, defaultDesign, defaultState } from '../../src/core/model';
import type { DeviceSpec } from '../../src/core/model';

const device: DeviceSpec = {
  id: 'test',
  label: 'Test',
  width: 1179,
  height: 2556,
  safeTop: 0.3,
  safeBottom: 0.14,
};

describe('normalizeState', () => {
  it('bù mặc định khi thiếu design.boxAlpha/google/shortcutName, giữ giá trị có sẵn', () => {
    const raw = {
      version: 1,
      events: [],
      todos: [],
      design: { ...defaultDesign(), boxAlpha: undefined, accentColor: '#123456' },
      device,
    };
    // xóa boxAlpha để mô phỏng trường thiếu
    delete (raw.design as Record<string, unknown>)['boxAlpha'];
    const result = normalizeState(raw);
    expect(result).not.toBeNull();
    expect(result!.design.boxAlpha).toBe(defaultDesign().boxAlpha);
    expect(result!.design.accentColor).toBe('#123456');
    expect(result!.google).toEqual({ clientId: '', calendarIds: [], cache: null });
    expect(result!.shortcutName).toBe('DatHinhNen');
  });

  it('version khác 1 → null', () => {
    const raw = { ...defaultState(device), version: 2 };
    expect(normalizeState(raw)).toBeNull();
  });

  it('không phải object → null', () => {
    expect(normalizeState(null)).toBeNull();
    expect(normalizeState(undefined)).toBeNull();
    expect(normalizeState('abc')).toBeNull();
    expect(normalizeState(42)).toBeNull();
    expect(normalizeState([])).toBeNull();
  });

  it('device thiếu width/height dạng số → null', () => {
    expect(normalizeState({ version: 1, device: { id: 'x' } })).toBeNull();
    expect(normalizeState({ version: 1, device: { width: '100', height: 200 } })).toBeNull();
    expect(normalizeState({ version: 1 })).toBeNull();
  });

  it('không mutate raw', () => {
    const raw = {
      version: 1 as const,
      events: [],
      todos: [],
      design: { accentColor: '#111111' },
      device,
      google: { clientId: 'abc' },
    };
    const snapshot = JSON.parse(JSON.stringify(raw));
    normalizeState(raw);
    expect(raw).toEqual(snapshot);
  });

  it('v1.3: design.noteText khác rỗng -> chuyển thành 1 Note pinned, xóa noteText khỏi design', () => {
    const raw = {
      version: 1 as const,
      events: [],
      todos: [],
      design: { ...defaultDesign(), noteText: 'Ghi chú cũ' },
      device,
    };
    const result = normalizeState(raw);
    expect(result).not.toBeNull();
    expect(result!.notes.length).toBe(1);
    expect(result!.notes[0].body).toBe('Ghi chú cũ');
    expect(result!.notes[0].pinned).toBe(true);
    expect((result!.design as unknown as Record<string, unknown>)['noteText']).toBeUndefined();
  });

  it('v1.3: notes thiếu -> bù mặc định []', () => {
    const raw = { version: 1 as const, events: [], todos: [], design: defaultDesign(), device };
    const result = normalizeState(raw);
    expect(result!.notes).toEqual([]);
  });

  it('giữ nguyên giá trị có sẵn khi hợp lệ đầy đủ', () => {
    const full = defaultState(device);
    full.design.accentColor = '#abcdef';
    full.google.clientId = 'my-client';
    const result = normalizeState(full);
    expect(result).not.toBeNull();
    expect(result!.design.accentColor).toBe('#abcdef');
    expect(result!.google.clientId).toBe('my-client');
  });
});
