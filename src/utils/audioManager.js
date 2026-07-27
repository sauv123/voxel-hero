class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.initialized = false;
    
    // Attempt to unlock audio context on first user gesture
    const unlock = () => {
      if (!this.initialized) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
      document.removeEventListener('touchstart', unlock);
    };
    
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
    document.addEventListener('touchstart', unlock);
  }

  init() {
    if (this.initialized) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  }

  // Whisper-quiet tactile tick for hovering (~5% volume)
  playHoverSound() {
    if (this.isMuted || !this.ctx || this.ctx.state === 'suspended') return;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.04);
    
    gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.045);
  }

  // Whisper-quiet dual-tone click (~8% volume)
  playClickSound() {
    if (this.isMuted || !this.ctx || this.ctx.state === 'suspended') return;

    const t = this.ctx.currentTime;

    // High frequency snappy click
    const oscHigh = this.ctx.createOscillator();
    const gainHigh = this.ctx.createGain();
    oscHigh.type = 'triangle';
    oscHigh.frequency.setValueAtTime(1200, t);
    oscHigh.frequency.exponentialRampToValueAtTime(350, t + 0.035);
    gainHigh.gain.setValueAtTime(0.06, t);
    gainHigh.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
    oscHigh.connect(gainHigh);
    gainHigh.connect(this.ctx.destination);
    oscHigh.start(t);
    oscHigh.stop(t + 0.04);

    // Warm low-frequency thud
    const oscLow = this.ctx.createOscillator();
    const gainLow = this.ctx.createGain();
    oscLow.type = 'sine';
    oscLow.frequency.setValueAtTime(150, t);
    oscLow.frequency.exponentialRampToValueAtTime(40, t + 0.06);
    gainLow.gain.setValueAtTime(0.08, t);
    gainLow.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    oscLow.connect(gainLow);
    gainLow.connect(this.ctx.destination);
    oscLow.start(t);
    oscLow.stop(t + 0.065);
  }
}

export const audioManager = new AudioManager();
