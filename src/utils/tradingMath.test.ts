import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePipDifference,
  calculateRequiredMargin,
  calculatePnL,
  calculateFibonacciLevels,
  calculateSMA,
  calculateRSI,
  getMarketSessions,
} from './tradingMath';

test('calculatePipDifference computes exact pips for standard 4-digit Forex', () => {
  // EUR/USD: 1.0850 - 1.0800 = 50 pips (pipSize = 0.0001)
  const pips = calculatePipDifference(1.0800, 1.0850, 0.0001);
  assert.equal(pips, 50);
});

test('calculatePipDifference computes exact pips for JPY pairs (2-digit)', () => {
  // USD/JPY: 155.50 - 155.00 = 50 pips (pipSize = 0.01)
  const pips = calculatePipDifference(155.00, 155.50, 0.01);
  assert.equal(pips, 50);
});

test('calculateRequiredMargin respects leverage and standard lot size', () => {
  // 1 standard lot of EUR/USD @ 1.1000 with 1:100 leverage
  // Nominal: 1 * 100,000 * 1.1000 = $110,000
  // Margin required = $110,000 / 100 = $1,100
  const margin = calculateRequiredMargin(1.1000, 1.0, 100, true);
  assert.equal(margin, 1100);
});

test('calculatePnL handles BUY and SELL positions accurately', () => {
  // BUY 1.0 lot EUR/USD @ 1.0800, current price 1.0850 (+50 pips = +$500)
  const buyPnL = calculatePnL('BUY', 1.0800, 1.0850, 1.0, true);
  assert.equal(buyPnL, 500);

  // SELL 1.0 lot EUR/USD @ 1.0850, current price 1.0800 (+50 pips = +$500)
  const sellPnL = calculatePnL('SELL', 1.0850, 1.0800, 1.0, true);
  assert.equal(sellPnL, 500);

  // BUY losing trade: 1.0 lot @ 1.0850 down to 1.0800 (-$500)
  const losingPnL = calculatePnL('BUY', 1.0850, 1.0800, 1.0, true);
  assert.equal(losingPnL, -500);
});

test('calculateFibonacciLevels computes golden ratio 61.8% and key retracements', () => {
  const levels = calculateFibonacciLevels(100, 200);
  assert.equal(levels.length, 7);

  // 0% level (swing high)
  assert.equal(levels[0].price, 200);

  // 50% level
  assert.equal(levels[3].price, 150);

  // 61.8% Golden ratio level: 200 - (100 * 0.618) = 138.2
  assert.equal(levels[4].price, 138.2);

  // 100% level (swing low)
  assert.equal(levels[6].price, 100);
});

test('calculateSMA computes moving average correctly', () => {
  const prices = [10, 20, 30, 40, 50];
  const sma3 = calculateSMA(prices, 3);
  assert.equal(sma3[0], null);
  assert.equal(sma3[1], null);
  assert.equal(sma3[2], 20); // (10+20+30)/3
  assert.equal(sma3[3], 30); // (20+30+40)/3
  assert.equal(sma3[4], 40); // (30+40+50)/3
});

test('calculateRSI returns bounds between 0 and 100', () => {
  // Rising sequence should yield high RSI
  const risingPrices = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
  const rsi = calculateRSI(risingPrices, 14);
  const lastRsi = rsi[rsi.length - 1];
  assert.ok(lastRsi !== null && lastRsi > 70, 'Consistent gains should produce overbought RSI > 70');
});

test('getMarketSessions detects peak London & New York overlap', () => {
  // At 14:00 UTC, both London (08:00 - 17:00) and New York (13:00 - 22:00) are open
  const overlap = getMarketSessions(14);
  assert.equal(overlap.isPeakOverlap, true);
  assert.ok(overlap.activeCount >= 2);

  // At 03:00 UTC, London & NY are closed (Tokyo and Sydney open)
  const asianSession = getMarketSessions(3);
  assert.equal(asianSession.isPeakOverlap, false);
});
