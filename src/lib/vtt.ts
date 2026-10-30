export interface Cue {
  start: number;
  end: number;
  text: string;
}

const toSec = (ts: string) => {
  const [h, m, s] = ts.split(':');
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
};

/** Minimal WebVTT parser (cue timings + text), enough for the transcript. */
export function parseVtt(src: string): Cue[] {
  const cues: Cue[] = [];
  for (const block of src.replace(/\r/g, '').split(/\n\n+/)) {
    const lines = block.split('\n');
    const i = lines.findIndex((l) => l.includes('-->'));
    if (i < 0) continue;
    const [a, b] = lines[i].split('-->').map((s) => s.trim().split(' ')[0]);
    cues.push({ start: toSec(a), end: toSec(b), text: lines.slice(i + 1).join(' ').trim() });
  }
  return cues;
}

export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
