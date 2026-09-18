import { describe, it, expect } from 'vitest';
import { formatPrice, formatDuration, formatDate, formatEventDate } from '../src/i18n/format';

// French groups thousands with a narrow no-break space, and its width has changed between
// Node versions. Compare with ordinary spaces so the tests pin the wording, not the character.
const plain = (s: string | undefined) => s?.replace(/\s/gu, ' ');

describe('formatPrice', () => {
  it('writes rupees the way her clients read them', () => {
    expect(formatPrice(3000, 'MUR', 'en')).toBe('Rs 3,000');
    expect(formatPrice(44000, 'MUR', 'en')).toBe('Rs 44,000');
  });

  it('falls back to rupees when the currency is missing', () => {
    expect(formatPrice(1500, null, 'en')).toBe('Rs 1,500');
  });

  it('uses the normal currency format for anything else', () => {
    expect(formatPrice(1500, 'EUR', 'en')).toBe('€1,500');
  });

  it('groups thousands in French', () => {
    expect(plain(formatPrice(44000, 'MUR', 'fr'))).toBe('Rs 44 000');
  });

  it('shows free as a price, and no price at all when there is none', () => {
    expect(formatPrice(0, 'MUR', 'en')).toBe('Rs 0');
    expect(formatPrice(null, 'MUR', 'en')).toBeUndefined();
    expect(formatPrice(undefined, 'MUR', 'en')).toBeUndefined();
  });
});

describe('formatDuration', () => {
  it('reads a range and a single length', () => {
    expect(formatDuration(60, 90, 'en')).toBe('60 to 90 minutes');
    expect(formatDuration(90, 90, 'en')).toBe('90 minutes');
  });

  it('accepts one end of the range on its own', () => {
    expect(formatDuration(null, 90, 'en')).toBe('90 minutes');
    expect(formatDuration(90, null, 'en')).toBe('90 minutes');
  });

  it('switches to hours for whole hours from two upwards', () => {
    expect(formatDuration(120, 120, 'en')).toBe('2 hours');
    expect(formatDuration(120, 180, 'en')).toBe('2 to 3 hours');
  });

  it('stays in minutes when the length is not a whole number of hours', () => {
    expect(formatDuration(150, 150, 'en')).toBe('150 minutes');
    expect(formatDuration(60, 60, 'en')).toBe('60 minutes');
  });

  it('says nothing when no length is set', () => {
    expect(formatDuration(null, null, 'en')).toBeUndefined();
  });
});

describe('formatDate', () => {
  it('writes the long date', () => {
    expect(formatDate('2026-10-04T14:00:00Z', 'en')).toBe('4 October 2026');
  });

  it('reads the date in Mauritius, not in the visitor time zone', () => {
    // 21:00 UTC is already the next morning in Mauritius.
    expect(formatDate('2026-10-04T21:00:00Z', 'en')).toBe('5 October 2026');
  });

  it('takes other date styles', () => {
    expect(formatDate('2026-10-04T14:00:00Z', 'en', { month: 'short', day: 'numeric' })).toBe('4 Oct');
  });
});

describe('formatEventDate', () => {
  it('gives the day and a tidy clock time', () => {
    expect(formatEventDate('2026-10-04T14:00:00Z', null, 'en')).toBe('Sunday 4 October, 6pm');
    expect(formatEventDate('2026-10-04T14:30:00Z', null, 'en')).toBe('Sunday 4 October, 6:30pm');
  });

  it('ignores the end time when the event finishes the same day', () => {
    expect(formatEventDate('2026-10-04T14:00:00Z', '2026-10-04T16:00:00Z', 'en')).toBe('Sunday 4 October, 6pm');
  });

  it('shows both days of a retreat and drops the clock', () => {
    const range = formatEventDate('2026-10-02T06:00:00Z', '2026-10-04T12:00:00Z', 'en');
    expect(range).toContain('Friday 2');
    expect(range).toContain('Sunday 4 October');
    expect(range).not.toContain('am');
  });

  it('uses the 24 hour clock in French', () => {
    expect(plain(formatEventDate('2026-10-04T14:00:00Z', null, 'fr'))).toBe('dimanche 4 octobre, 18:00');
  });
});
