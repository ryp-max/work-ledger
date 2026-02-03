// Mechanical keyboard click sound generator
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playKeyboardClick = async () => {
  try {
    const ctx = getAudioContext();
    
    // Resume audio context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    
    const now = ctx.currentTime;
    
    // Layer 1: Sharp mechanical click (high frequency click)
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    const clickFilter = ctx.createBiquadFilter();
    
    click.type = 'sine';
    click.frequency.setValueAtTime(2200, now);
    click.frequency.exponentialRampToValueAtTime(1400, now + 0.006);
    
    clickFilter.type = 'bandpass';
    clickFilter.frequency.setValueAtTime(2000, now);
    clickFilter.Q.setValueAtTime(8, now);
    
    clickGain.gain.setValueAtTime(0.06, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0024, now + 0.01);
    
    click.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    
    click.start(now);
    click.stop(now + 0.01);
    
    // Layer 2: Low mechanical thock (bottoming out sound)
    const thock = ctx.createOscillator();
    const thockGain = ctx.createGain();
    const thockFilter = ctx.createBiquadFilter();
    
    thock.type = 'sine';
    thock.frequency.setValueAtTime(180, now + 0.003);
    thock.frequency.exponentialRampToValueAtTime(90, now + 0.02);
    
    thockFilter.type = 'lowpass';
    thockFilter.frequency.setValueAtTime(250, now);
    
    thockGain.gain.setValueAtTime(0, now);
    thockGain.gain.setValueAtTime(0.048, now + 0.003);
    thockGain.gain.exponentialRampToValueAtTime(0.0024, now + 0.025);
    
    thock.connect(thockFilter);
    thockFilter.connect(thockGain);
    thockGain.connect(ctx.destination);
    
    thock.start(now);
    thock.stop(now + 0.025);
    
    // Layer 3: Subtle release sound
    const release = ctx.createOscillator();
    const releaseGain = ctx.createGain();
    
    release.type = 'sine';
    release.frequency.setValueAtTime(800, now + 0.008);
    release.frequency.exponentialRampToValueAtTime(400, now + 0.015);
    
    releaseGain.gain.setValueAtTime(0.012, now + 0.008);
    releaseGain.gain.exponentialRampToValueAtTime(0.0024, now + 0.015);
    
    release.connect(releaseGain);
    releaseGain.connect(ctx.destination);
    
    release.start(now);
    release.stop(now + 0.015);
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Keyboard sound error:', error);
  }
};
