import { describe, it, expect } from 'vitest';
import { buildAuthUrl, parseFragment, newState, saveToken, getToken, clearToken } from '../../src/google/oauth';

class MapStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

describe('buildAuthUrl', () => {
  it('chứa response_type=token, scope calendar.readonly, state, redirect_uri', () => {
    const url = buildAuthUrl('client-123', 'https://app.example/redirect', 'state-abc');
    const u = new URL(url);
    expect(u.origin + u.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth');
    expect(u.searchParams.get('response_type')).toBe('token');
    expect(u.searchParams.get('scope')).toBe('https://www.googleapis.com/auth/calendar.readonly');
    expect(u.searchParams.get('state')).toBe('state-abc');
    expect(u.searchParams.get('redirect_uri')).toBe('https://app.example/redirect');
    expect(u.searchParams.get('client_id')).toBe('client-123');
  });

  it('không có client_secret ở bất kỳ đâu', () => {
    const url = buildAuthUrl('client-123', 'https://app.example/redirect', 'state-abc');
    expect(url).not.toContain('client_secret');
  });

  it('nhận prompt tùy chọn', () => {
    const url = buildAuthUrl('c', 'https://a', 's', 'select_account');
    expect(new URL(url).searchParams.get('prompt')).toBe('select_account');
  });
});

describe('newState', () => {
  it('sinh state ngẫu nhiên base64url, lưu vào storage', () => {
    const storage = new MapStorage();
    const s1 = newState(storage);
    const s2 = newState(storage);
    expect(s1).not.toBe(s2);
    expect(s1).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(storage.getItem('google_oauth_state')).toBe(s2);
  });
});

describe('parseFragment', () => {
  it('đúng state → trả accessToken và expiresIn', () => {
    const hash = '#access_token=tok123&token_type=Bearer&expires_in=3600&state=abc';
    const result = parseFragment(hash, 'abc');
    expect(result).toEqual({ accessToken: 'tok123', expiresIn: 3600 });
  });

  it('sai state → null', () => {
    const hash = '#access_token=tok123&expires_in=3600&state=abc';
    expect(parseFragment(hash, 'other')).toBeNull();
  });

  it('có error → trả { error }', () => {
    const hash = '#error=access_denied&state=abc';
    expect(parseFragment(hash, 'abc')).toEqual({ error: 'access_denied' });
  });

  it('hash rỗng → null', () => {
    expect(parseFragment('', 'abc')).toBeNull();
    expect(parseFragment('#', 'abc')).toBeNull();
  });

  it('chấp nhận hash không có dấu #', () => {
    const raw = 'access_token=tok&expires_in=100&state=abc';
    expect(parseFragment(raw, 'abc')).toEqual({ accessToken: 'tok', expiresIn: 100 });
  });
});

describe('token store', () => {
  it('saveToken rồi getToken trả accessToken khi còn hạn', () => {
    const storage = new MapStorage();
    const now = 1_000_000;
    saveToken('tok-xyz', 3600, now, storage);
    expect(getToken(now + 1000, storage)).toBe('tok-xyz');
  });

  it('getToken trả null khi hết hạn (trừ biên an toàn 60s)', () => {
    const storage = new MapStorage();
    const now = 1_000_000;
    saveToken('tok-xyz', 3600, now, storage);
    // expiresAt = now + 3600_000 - 60_000
    expect(getToken(now + 3600_000 - 60_000, storage)).toBeNull();
    expect(getToken(now + 3600_000 - 60_001, storage)).toBe('tok-xyz');
  });

  it('getToken trả null khi không có token', () => {
    const storage = new MapStorage();
    expect(getToken(Date.now(), storage)).toBeNull();
  });

  it('clearToken xóa token đã lưu', () => {
    const storage = new MapStorage();
    saveToken('tok', 3600, 0, storage);
    clearToken(storage);
    expect(getToken(0, storage)).toBeNull();
  });
});
