/**
 * Web Speech API Helper for Stock Simplified
 * Provides Text-to-Speech narration with language-specific voice selection,
 * speech state callbacks, and speech synthesis controls.
 */

type SpeechCallback = (speaking: boolean, textChunk?: string) => void;
export type VoiceLanguage = 'en' | 'hi' | 'pa';

class SpeechAgentService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isMuted: boolean = false;
  private listeners: SpeechCallback[] = [];
  private currentLang: VoiceLanguage = 'en';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {};
      }
    }
  }

  public setLanguage(lang: VoiceLanguage) {
    this.currentLang = lang;
  }

  public getLanguage(): VoiceLanguage {
    return this.currentLang;
  }

  private getBestVoiceForLang(lang: VoiceLanguage): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === 'hi') {
      const hiVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));
      if (hiVoice) return hiVoice;
    } else if (lang === 'pa') {
      const paVoice = voices.find((v) => v.lang.startsWith('pa') || v.name.toLowerCase().includes('punjabi'));
      if (paVoice) return paVoice;
      // Fallback for Punjabi: Hindi voice or Indian English
      const indianVoice = voices.find((v) => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
      if (indianVoice) return indianVoice;
    }

    // Default English preferred voices
    const enVoice = voices.find(
      (v) =>
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')) &&
        v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'));

    return enVoice || voices[0] || null;
  }

  public subscribe(cb: SpeechCallback) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify(speaking: boolean, textChunk?: string) {
    this.listeners.forEach((cb) => cb(speaking, textChunk));
  }

  public speak(text: string, onEnd?: () => void, langOverride?: VoiceLanguage) {
    const lang = langOverride || this.currentLang;

    if (!this.synth || this.isMuted) {
      // If speech synthesis is not supported or muted, simulate delay and complete
      this.notify(true, text);
      setTimeout(() => {
        this.notify(false);
        if (onEnd) onEnd();
      }, 1500);
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getBestVoiceForLang(lang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'pa' ? 'pa-IN' : 'en-US';
    utterance.rate = lang === 'hi' || lang === 'pa' ? 0.95 : 1.0;
    utterance.pitch = 1.02;

    utterance.onstart = () => {
      this.notify(true, text);
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      this.notify(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis event notice:', e);
      this.currentUtterance = null;
      this.notify(false);
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis speak invocation error:', err);
      this.notify(false);
      if (onEnd) onEnd();
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // quiet catch
      }
      this.currentUtterance = null;
      this.notify(false);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getIsMuted() {
    return this.isMuted;
  }
}

export const speechAgent = new SpeechAgentService();
