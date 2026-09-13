import { describe, it, expect } from 'vitest';
import { reducer } from '../../src/ui/store';
import { defaultState, defaultDesign } from '../../src/core/model';
import type { DeviceSpec } from '../../src/core/model';

const device: DeviceSpec = {
  id: 'iphone-1179x2556',
  label: 'iPhone 1179x2556',
  width: 1179,
  height: 2556,
  safeTop: 0.06,
  safeBottom: 0.1,
};

const device2: DeviceSpec = {
  id: 'iphone-1290x2796',
  label: 'iPhone 1290x2796',
  width: 1290,
  height: 2796,
  safeTop: 0.06,
  safeBottom: 0.1,
};

describe('reducer', () => {
  it('setDevice đổi device, giữ nguyên phần còn lại, không mutate state cũ', () => {
    const state = defaultState(device);
    const next = reducer(state, { type: 'setDevice', device: device2 });

    expect(next.device).toEqual(device2);
    expect(next.design).toEqual(state.design);
    expect(state.device).toEqual(device); // state cũ không bị mutate
    expect(next).not.toBe(state);
  });

  it('setDesign gộp partial vào design hiện tại, không mutate state cũ', () => {
    const state = defaultState(device);
    const next = reducer(state, { type: 'setDesign', partial: { accentColor: '#ff0000', scale: 1.2 } });

    expect(next.design.accentColor).toBe('#ff0000');
    expect(next.design.scale).toBe(1.2);
    expect(next.design.textColor).toBe(state.design.textColor);
    expect(state.design).toEqual(defaultDesign()); // state cũ không bị mutate
    expect(next.design).not.toBe(state.design);
  });

  it('load thay toàn bộ state', () => {
    const state = defaultState(device);
    const loaded = defaultState(device2);
    const next = reducer(state, { type: 'load', state: loaded });

    expect(next).toEqual(loaded);
  });
});
