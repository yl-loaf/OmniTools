/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SoundTheme = 'modern' | 'retro' | 'chime' | 'mechanical';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('omnitools_sound') !== 'false';
}

export function getSoundVolume(): number {
  if (typeof window === 'undefined') return 0.5;
  const val = parseFloat(localStorage.getItem('omnitools_sound_volume') || '0.5');
  return isNaN(val) ? 0.5 : Math.max(0, Math.min(1, val));
}

export function getSoundTheme(): SoundTheme {
  if (typeof window === 'undefined') return 'modern';
  const theme = localStorage.getItem('omnitools_sound_theme') as SoundTheme;
  return theme && ['modern', 'retro', 'chime', 'mechanical'].includes(theme) ? theme : 'modern';
}

export function playClickSound(customTheme?: SoundTheme, customVol?: number): void {
  const enabled = isSoundEnabled();
  if (!enabled && customVol === undefined) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const theme = customTheme || getSoundTheme();
  const volume = customVol !== undefined ? customVol : getSoundVolume();
  if (volume <= 0) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  gain.connect(ctx.destination);
  osc.connect(gain);

  switch (theme) {
    case 'retro': {
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.03);
      gain.gain.setValueAtTime(volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
      break;
    }
    case 'chime': {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
      break;
    }
    case 'mechanical': {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);
      gain.gain.setValueAtTime(volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }
    case 'modern':
    default: {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
      break;
    }
  }
}

export function playSuccessSound(customTheme?: SoundTheme, customVol?: number): void {
  const enabled = isSoundEnabled();
  if (!enabled && customVol === undefined) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const theme = customTheme || getSoundTheme();
  const volume = customVol !== undefined ? customVol : getSoundVolume();
  if (volume <= 0) return;

  const now = ctx.currentTime;

  if (theme === 'retro') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554.37, now + 0.08);
    osc.frequency.setValueAtTime(659.25, now + 0.16);
    osc.frequency.setValueAtTime(880, now + 0.24);
    gain.gain.setValueAtTime(volume * 0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
    osc.start(now);
    osc.stop(now + 0.36);
    return;
  }

  // Harmonic chord chime
  const frequencies = theme === 'chime' ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25];
  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    const noteStart = now + idx * 0.07;
    osc.frequency.setValueAtTime(freq, noteStart);
    gain.gain.setValueAtTime(volume * 0.15, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.25);
    osc.start(noteStart);
    osc.stop(noteStart + 0.25);
  });
}

export function playToggleSound(enabledState: boolean): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const volume = getSoundVolume();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  const startFreq = enabledState ? 350 : 600;
  const endFreq = enabledState ? 700 : 250;

  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

  gain.gain.setValueAtTime(volume * 0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  osc.start(now);
  osc.stop(now + 0.09);
}
