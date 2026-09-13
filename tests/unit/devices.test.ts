import { describe, it, expect } from 'vitest';
import { DEVICES, detectDevice, customDevice } from '../../src/render/devices';

describe('devices: iPhone 13 Pro Max (D-007)', () => {
  it('detectDevice(428, 926, 3) khớp preset iphone-1284x2778', () => {
    const dev = detectDevice(428, 926, 3);
    expect(dev.id).toBe('iphone-1284x2778');
    expect(dev.width).toBe(1284);
    expect(dev.height).toBe(2778);
  });

  it('preset iPhone 12/13 Pro Max có mặt trong DEVICES với đúng kích thước', () => {
    const dev = DEVICES.find((d) => d.id === 'iphone-1284x2778');
    expect(dev).toBeDefined();
    expect(dev!.width).toBe(1284);
    expect(dev!.height).toBe(2778);
  });

  it('các preset cũ vẫn khớp đúng như trước', () => {
    expect(detectDevice(390, 844, 3).width).toBe(1170);
    expect(detectDevice(393, 852, 3).width).toBe(1179);
    expect(detectDevice(402, 874, 3)).toMatchObject({ width: 1206, height: 2622 });
    expect(detectDevice(430, 932, 3)).toMatchObject({ width: 1290, height: 2796 });
    expect(detectDevice(440, 956, 3)).toMatchObject({ width: 1320, height: 2868 });
  });

  it('customDevice không đổi', () => {
    const dev = customDevice(1000, 2000);
    expect(dev.id).toBe('custom');
    expect(dev.width).toBe(1000);
    expect(dev.height).toBe(2000);
  });
});
