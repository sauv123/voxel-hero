// ─── SAUVEER PERSONA KNOWLEDGE BASE ─────────────────────────────────────────
const SAUVEER_KNOWLEDGE = [
  {
    keywords: ['who', 'sauveer', 'about', 'yourself', 'background', 'intro'],
    answer: "Hi! I'm Sauveer Sinha. I'm a Product & UX Designer specializing in making AI systems understandable, intuitive, and trustworthy for human beings. I studied engineering at MIT Manipal and pursued my Master's in Milan."
  },
  {
    keywords: ['ai', 'trust', 'philosophy', 'design'],
    answer: "My core design philosophy is: 'I help people understand & trust AI through thoughtful design.' AI should feel collaborative and transparent, not opaque or intimidating."
  },
  {
    keywords: ['career', 'experience', 'work', 'foundit', 'milan', 'mumbai'],
    answer: "I started my career at foundit in Bengaluru, moved to Mumbai to design large-scale digital products, and then completed my Master's degree in Milan. I also won 3rd place at the NCA design awards!"
  },
  {
    keywords: ['skills', 'tools', 'stack', 'code', 'webgl', 'three'],
    answer: "I work at the intersection of design and engineering. My toolkit includes Figma, Three.js, React, WebGL shader animation, GSAP, and voice/AI interface prototyping."
  },
  {
    keywords: ['contact', 'hire', 'reach', 'email', 'whatsapp', 'linkedin'],
    answer: "You can reach out to me via email at sauveersinha@gmail.com, or connect with me on LinkedIn or Instagram (@sauveer.design). Let's build something extraordinary together!"
  }
];

class VoiceEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.voices = [];
    this.speaking = false;
    this.listeners = new Set();
    this.fishAudioApiKey = localStorage.getItem('FISH_AUDIO_API_KEY') || '';
    this.fishAudioVoiceId = localStorage.getItem('FISH_AUDIO_VOICE_ID') || '';

    if (this.synth) {
      const loadVoices = () => {
        this.voices = this.synth.getVoices();
      };
      loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = loadVoices;
      }
    }
  }

  getBestVoice() {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    
    const preferred = [
      'Google US English',
      'Google UK English Female',
      'Google UK English Male',
      'Samantha',
      'Daniel',
      'Karen',
      'Alex',
      'en-US',
      'en-GB'
    ];

    for (const name of preferred) {
      const match = this.voices.find(v => v.name.includes(name) || v.lang.includes(name));
      if (match) return match;
    }

    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(data) {
    this.listeners.forEach(cb => cb(data));
  }

  getPersonaResponse(userQuery) {
    const q = userQuery.toLowerCase();
    for (const item of SAUVEER_KNOWLEDGE) {
      if (item.keywords.some(k => q.includes(k))) {
        return item.answer;
      }
    }
    return "That's a great question! I'm Sauveer's AI clone. I help people understand & trust AI through thoughtful design. You can ask me about Sauveer's background, design philosophy, skills, or career trajectory!";
  }

  async speak(text) {
    if (!text) return;

    // Check if Fish Audio custom voice credentials exist
    if (this.fishAudioApiKey && this.fishAudioVoiceId) {
      try {
        await this.speakFishAudio(text);
        return;
      } catch (err) {
        console.warn("Fish Audio TTS failed, falling back to Web Speech Synthesis:", err);
      }
    }

    // Fallback to Web Speech Synthesis
    if (!this.synth) return;

    if (this.speaking) {
      this.stop();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getBestVoice();
    
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      this.speaking = true;
      this.notify({ speaking: true, text });
    };

    utterance.onend = () => {
      this.speaking = false;
      this.notify({ speaking: false, text: '' });
    };

    utterance.onerror = () => {
      this.speaking = false;
      this.notify({ speaking: false, text: '' });
    };

    this.synth.speak(utterance);
  }

  // Fish Audio Voice Cloning Integration Slot
  async speakFishAudio(text) {
    this.notify({ speaking: true, text });
    this.speaking = true;

    const response = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.fishAudioApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        reference_id: this.fishAudioVoiceId,
        format: 'mp3'
      })
    });

    if (!response.ok) throw new Error(`Fish Audio API error: ${response.status}`);

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      this.speaking = false;
      this.notify({ speaking: false, text: '' });
    };

    audio.play();
  }

  setFishAudioCredentials(apiKey, voiceId) {
    this.fishAudioApiKey = apiKey;
    this.fishAudioVoiceId = voiceId;
    localStorage.setItem('FISH_AUDIO_API_KEY', apiKey);
    localStorage.setItem('FISH_AUDIO_VOICE_ID', voiceId);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.speaking = false;
      this.notify({ speaking: false, text: '' });
    }
  }
}

export const voiceEngine = new VoiceEngine();
