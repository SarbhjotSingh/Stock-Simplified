import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidUpiId,
  isValidCardNumber,
  validateAudioChapter,
  reorderTourSteps,
  verifyAdminCredentials,
  getStepVoiceScript,
  SEEDED_ADMIN_EMAIL,
  SEEDED_ADMIN_PASSWORD,
} from './adminTourMath';
import { TourStepItem } from '../types/admin';

test('isValidUpiId validates Indian UPI handles correctly', () => {
  assert.equal(isValidUpiId('trader@okaxis'), true);
  assert.equal(isValidUpiId('alex.mercer@paytm'), true);
  assert.equal(isValidUpiId('9876543210@ybl'), true);
  assert.equal(isValidUpiId('invalid-upi'), false);
  assert.equal(isValidUpiId('@okhdfc'), false);
  assert.equal(isValidUpiId(''), false);
});

test('isValidCardNumber checks 16 digits format', () => {
  assert.equal(isValidCardNumber('4532 0123 4567 8910'), true);
  assert.equal(isValidCardNumber('4532012345678910'), true);
  assert.equal(isValidCardNumber('12345'), false);
});

test('validateAudioChapter ensures required podcast metadata', () => {
  const valid = validateAudioChapter({
    title: 'Forex Mastery',
    duration: '4:00 min',
    transcript: 'This is a sufficiently long transcript explaining the Forex market and PIPs.',
  });
  assert.equal(valid.valid, true);

  const missingTitle = validateAudioChapter({
    title: '',
    duration: '4:00 min',
    transcript: 'Some long text that meets criteria...',
  });
  assert.equal(missingTitle.valid, false);
});

test('reorderTourSteps updates sequential IDs accurately', () => {
  const initialSteps: TourStepItem[] = [
    { id: 1, title: 'Step 1', voiceScript: 'one', reveals: 'bare', targetLabel: 'bare' },
    { id: 2, title: 'Step 2', voiceScript: 'two', reveals: 'indicators', targetLabel: 'ind' },
    { id: 3, title: 'Step 3', voiceScript: 'three', reveals: 'drawing', targetLabel: 'draw' },
  ];

  const reordered = reorderTourSteps(initialSteps, 0, 2);
  assert.equal(reordered[0].title, 'Step 2');
  assert.equal(reordered[0].id, 1);
  assert.equal(reordered[1].title, 'Step 3');
  assert.equal(reordered[1].id, 2);
  assert.equal(reordered[2].title, 'Step 1');
  assert.equal(reordered[2].id, 3);
});

test('verifyAdminCredentials authenticates seeded admin credentials', () => {
  assert.equal(verifyAdminCredentials(SEEDED_ADMIN_EMAIL, SEEDED_ADMIN_PASSWORD), true);
  assert.equal(verifyAdminCredentials('Admin@StockSimplified.com', 'AdminPass123!'), true);
  assert.equal(verifyAdminCredentials('admin@stocksimplified.com', 'wrongpassword'), false);
  assert.equal(verifyAdminCredentials('user@stocksimplified.com', 'AdminPass123!'), false);
  assert.equal(verifyAdminCredentials('', ''), false);
});

test('getStepVoiceScript resolves multilingual voice scripts correctly', () => {
  const step: TourStepItem = {
    id: 1,
    title: 'Candlestick Chart',
    voiceScript: 'Default English script',
    voiceScripts: {
      en: 'English audio script',
      hi: 'हिंदी ऑडियो स्क्रिप्ट',
      pa: 'ਪੰਜਾਬੀ ਆਡੀਓ ਸਕ੍ਰਿਪਟ',
    },
    reveals: 'bare',
    targetLabel: 'Price Action',
  };

  assert.equal(getStepVoiceScript(step, 'en'), 'English audio script');
  assert.equal(getStepVoiceScript(step, 'hi'), 'हिंदी ऑडियो स्क्रिप्ट');
  assert.equal(getStepVoiceScript(step, 'pa'), 'ਪੰਜਾਬੀ ਆਡੀਓ ਸਕ੍ਰਿਪਟ');

  // Fallback to default voiceScript if missing
  const fallbackStep: TourStepItem = {
    id: 2,
    title: 'Fallback Step',
    voiceScript: 'Default fallback',
    reveals: 'indicators',
    targetLabel: 'Indicators',
  };
  assert.equal(getStepVoiceScript(fallbackStep, 'hi'), 'Default fallback');
});
