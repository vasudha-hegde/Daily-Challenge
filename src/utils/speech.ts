/**
 * British English Web Speech helper for Year 2 children.
 * Reads questions and stories aloud upon tapping the speaker button.
 */

class SpeechHelper {
  private isSpeakingState: boolean = false;

  public speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any current speech

      // Clean up text of markdown or emojis for clean TTS
      const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu, '').trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-GB';
      utterance.rate = 0.9; // Slightly slower, clear pace for KS1 Year 2 child
      utterance.pitch = 1.1; // Friendly warm tone

      // Try to find a British English voice
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(
        (v) => v.lang === 'en-GB' || v.lang === 'en_GB' || v.name.includes('UK') || v.name.includes('British')
      );
      if (britishVoice) {
        utterance.voice = britishVoice;
      }

      this.isSpeakingState = true;

      utterance.onend = () => {
        this.isSpeakingState = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeakingState = false;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeakingState = false;
      if (onEnd) onEnd();
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeakingState = false;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const speech = new SpeechHelper();
