const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('../settings/load.cjs');
const { formatChartDate, formatChartTooltipDate } = load('features/dashboard/utils/chart-date.ts');

test('calendar chart labels keep October 10 in Uruguay rather than shifting to October 9', () => {
  assert.equal(formatChartDate('2026-10-10'), '10 octubre');
  assert.equal(formatChartTooltipDate('2026-10-10'), 'Sábado, 10 de octubre');
});

test('calendar labels preserve month and daylight-saving boundaries', () => {
  assert.equal(formatChartDate('2026-11-01'), '1 noviembre');
  assert.equal(formatChartDate('2026-03-08'), '8 marzo');
});
