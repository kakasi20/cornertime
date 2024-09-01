import { randomElement } from './random';

export interface Speech {
    speak(phrase: string, context: object): void;
    speakRandomPhrase(phrases: string[], context: object): void;
}

export class BrowserSpeech implements Speech {
    voices: SpeechSynthesisVoice[] = [];

    constructor() {
        this.loadVoices();
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }

    loadVoices() {
        this.voices = speechSynthesis.getVoices();
    }

    getFeminineVoice(): SpeechSynthesisVoice | null {
        const feminineVoices = this.voices.filter(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman')
        );
        return feminineVoices.length > 0 ? feminineVoices[0] : null;
    }

    speak(phrase: string, context: object) {
        const utter = new SpeechSynthesisUtterance(phrase);
        const feminineVoice = this.getFeminineVoice();
        if (feminineVoice) {
            utter.voice = feminineVoice;
        }
        speechSynthesis.speak(utter);
    }

    speakRandomPhrase(phrases: string[], context: object) {
        const phrase = randomElement(phrases);
        this.speak(phrase, context);
    }
}

export class MockSpeech {
    transcript: string[] = [];

    reset() {
        this.transcript = [];
    }

    speak(phrase: string, context: object) {
        this.transcript.push(phrase);
    }

    speakRandomPhrase(phrases: string[], context: object) {
        if (phrases.length === 0) {
            return;
        }
        const phrase = randomElement(phrases);
        this.speak(phrase, context);
    }
}

export default function getSpeech(env: string = process.env.NODE_ENV!): Speech {
    if (env === 'test') {
        return new MockSpeech();
    } else {
        return new BrowserSpeech();
    }
}
