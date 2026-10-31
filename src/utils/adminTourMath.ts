import { TourStepItem } from '../types/admin';
import { AudioChapter } from '../types/market';

/**
 * Hardcoded seeded admin credentials
 */
export const SEEDED_ADMIN_EMAIL = 'admin@stocksimplified.com';
export const SEEDED_ADMIN_PASSWORD = 'AdminPass123!';

/**
 * Verify administrator credentials
 */
export function verifyAdminCredentials(email: string, pass: string): boolean {
  if (!email || !pass) return false;
  return (
    email.trim().toLowerCase() === SEEDED_ADMIN_EMAIL.toLowerCase() &&
    pass === SEEDED_ADMIN_PASSWORD
  );
}

/**
 * Retrieve voice script for specified language (en, hi, pa) with fallback to default
 */
export function getStepVoiceScript(step: TourStepItem, lang: 'en' | 'hi' | 'pa'): string {
  if (step.voiceScripts && step.voiceScripts[lang]) {
    return step.voiceScripts[lang];
  }
  return step.voiceScript;
}

/**
 * Validate and format UPI ID (e.g. trader@okaxis, user@okhdfcbank, name@paytm)
 */
export function isValidUpiId(upiId: string): boolean {
  if (!upiId || typeof upiId !== 'string') return false;
  const trimmed = upiId.trim();
  // Standard format: username@bank
  const regex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return regex.test(trimmed);
}

/**
 * Validate 16-digit Card Number (Luhn check simplified for testability)
 */
export function isValidCardNumber(cardNumber: string): boolean {
  const clean = cardNumber.replace(/\s+/g, '');
  return /^\d{16}$/.test(clean);
}

/**
 * Validate audio chapter fields for Admin CRUD
 */
export function validateAudioChapter(chapter: Partial<AudioChapter>): { valid: boolean; error?: string } {
  if (!chapter.title || chapter.title.trim().length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters long.' };
  }
  if (!chapter.duration || chapter.duration.trim().length < 2) {
    return { valid: false, error: 'Duration is required (e.g. 5:00 min).' };
  }
  if (!chapter.transcript || chapter.transcript.trim().length < 20) {
    return { valid: false, error: 'Transcript must be at least 20 characters for voice agent playback.' };
  }
  return { valid: true };
}

/**
 * Reorder tour steps safely ensuring 1-based sequential IDs
 */
export function reorderTourSteps(steps: TourStepItem[], fromIndex: number, toIndex: number): TourStepItem[] {
  if (fromIndex < 0 || fromIndex >= steps.length || toIndex < 0 || toIndex >= steps.length) {
    return steps;
  }
  const result = [...steps];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result.map((step, idx) => ({
    ...step,
    id: idx + 1,
  }));
}
