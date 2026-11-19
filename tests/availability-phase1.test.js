import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolvePropertyConfig,
  validateAvailabilityRequest,
  dateRangeOverlaps,
  buildAvailabilityResponse,
  normalizeBlockedRanges,
} from '../api/_lib/availability.js';

import { fetchPropertyAvailability } from '../api/_lib/smoobuClient.js';

test('resolvePropertyConfig maps each official slug to the correct server-side environment variable', () => {
  const hill = resolvePropertyConfig('hill-view');
  const chalet = resolvePropertyConfig('chalet-le-joyau');

  assert.equal(hill.slug, 'hill-view');
  assert.equal(hill.apartmentIdEnv, 'SMOOBU_HILL_VIEW_APARTMENT_ID');
  assert.equal(chalet.slug, 'chalet-le-joyau');
  assert.equal(chalet.apartmentIdEnv, 'SMOOBU_CHALET_LE_JOJAU_APARTMENT_ID');
});

test('validateAvailabilityRequest rejects invalid dates and invalid property slugs', () => {
  assert.throws(() => validateAvailabilityRequest('hill-view', 'not-a-date', '2026-10-02'), /valid ISO date/);
  assert.throws(() => validateAvailabilityRequest('invalid-slug', '2026-10-01', '2026-10-02'), /propertySlug/);
  assert.throws(() => validateAvailabilityRequest('hill-view', '2026-10-02', '2026-10-01'), /before/);
});

test('resolvePropertyConfig preserves the canonical chalet-le-joyau slug while accepting the legacy spelling as an alias', () => {
  const canonical = resolvePropertyConfig('chalet-le-joyau');
  const legacy = resolvePropertyConfig('chalet-le-jojau');

  assert.equal(canonical.slug, 'chalet-le-joyau');
  assert.equal(canonical.apartmentIdEnv, 'SMOOBU_CHALET_LE_JOJAU_APARTMENT_ID');
  assert.equal(legacy.slug, 'chalet-le-joyau');
  assert.equal(legacy.apartmentIdEnv, 'SMOOBU_CHALET_LE_JOJAU_APARTMENT_ID');
});

test('dateRangeOverlaps correctly handles boundary dates', () => {
  assert.equal(dateRangeOverlaps('2026-10-01', '2026-10-03', '2026-10-03', '2026-10-05'), false);
  assert.equal(dateRangeOverlaps('2026-10-01', '2026-10-03', '2026-10-02', '2026-10-04'), true);
  assert.equal(dateRangeOverlaps('2026-10-01', '2026-10-03', '2026-10-01', '2026-10-03'), true);
});

test('normalizeBlockedRanges converts Smoobu availability data into day ranges', () => {
  const blockedRanges = normalizeBlockedRanges([
    { from: '2026-10-01', to: '2026-10-03' },
    { from: '2026-10-05', to: '2026-10-05' },
  ]);

  assert.deepEqual(blockedRanges, [
    { from: '2026-10-01', to: '2026-10-03' },
    { from: '2026-10-05', to: '2026-10-05' },
  ]);
});

test('buildAvailabilityResponse returns a consistent API payload', () => {
  const response = buildAvailabilityResponse('hill-view', true, [
    { from: '2026-10-02', to: '2026-10-03' },
  ], 'Available for your selected dates.');

  assert.deepEqual(response, {
    propertySlug: 'hill-view',
    isAvailable: true,
    blockedRanges: [{ from: '2026-10-02', to: '2026-10-03' }],
    message: 'Available for your selected dates.',
  });
});

test('fetchPropertyAvailability returns the mapped hotel availability and handles mocked API errors safely', async () => {
  const originalFetch = global.fetch;
  const originalApiKey = process.env.SMOOBU_API_KEY;
  const originalApiSecret = process.env.SMOOBU_API_SECRET;
  const originalApartmentId = process.env.SMOOBU_HILL_VIEW_APARTMENT_ID;

  process.env.SMOOBU_API_KEY = 'test-api-key';
  process.env.SMOOBU_API_SECRET = 'dGVzdC1zZWNyZXQ=';
  process.env.SMOOBU_HILL_VIEW_APARTMENT_ID = 'hv-test-123';

  global.fetch = async () => ({
    ok: true,
    status: 200,
    text: async () => JSON.stringify({
      result: {
        available: false,
        blockedRanges: [
          { from: '2026-10-02', to: '2026-10-03' },
        ],
      },
    }),
  });

  try {
    const result = await fetchPropertyAvailability('hill-view', '2026-10-01', '2026-10-05');
    assert.equal(result.isAvailable, false);
    assert.deepEqual(result.blockedRanges, [{ from: '2026-10-02', to: '2026-10-03' }]);
  } finally {
    global.fetch = originalFetch;
    if (originalApiKey === undefined) delete process.env.SMOOBU_API_KEY;
    else process.env.SMOOBU_API_KEY = originalApiKey;

    if (originalApiSecret === undefined) delete process.env.SMOOBU_API_SECRET;
    else process.env.SMOOBU_API_SECRET = originalApiSecret;

    if (originalApartmentId === undefined) delete process.env.SMOOBU_HILL_VIEW_APARTMENT_ID;
    else process.env.SMOOBU_HILL_VIEW_APARTMENT_ID = originalApartmentId;
  }
});
