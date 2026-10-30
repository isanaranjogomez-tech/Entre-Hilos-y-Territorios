import type { SourceRef } from './types';

/**
 * CHAPTER IV — ENGLISH · Interview
 *
 * Source: "Discovering_the_Wayuu_Culture_1080p.mp4" and its English subtitle
 * file. Transcript lines and chapter timecodes below are taken from that
 * subtitle file, unchanged.
 *
 * Format note (from the official brief): the interview is a role-play
 * ("entrevista breve, en inglés, a partir de un juego de roles"). The
 * participants are students; the site must not present them as Wayuu people.
 *
 * Duration: ~3:50. The brief asks for 2–3 minutes. The video is presented
 * unedited; the team should confirm the duration with the teacher.
 *
 * The video is a 2D animation with subtitles burned into the image, so the
 * separate caption track stays off by default (viewers can enable it with the
 * player's CC button; it also feeds the transcript). The brief requires the
 * participants' faces and voices to appear — confirm with the teacher.
 */

export const english = {
  title: 'Discovering the Wayuu Culture',
  format: 'Role-play interview · Language Arts',
  roleplayNote:
    'This interview is a role-play prepared by ninth-grade students, as required by the Language Arts brief, and presented as a 2D animation. The guests are students interpreting Wayuu speakers; they are not members of the Wayuu community.',
  video: {
    /**
     * Final edited version (copy_86A317DB-E672-40A2-96F4-E14BAE879695.mov, 2026-10-30),
     * remuxed to MP4 without re-encoding (H.264 1920×1080 + AAC, as edited). At 301 MB it
     * exceeds GitHub's 100 MB per-file limit, so it is hosted as a release asset of this repo.
     */
    src: 'https://github.com/isanaranjogomez-tech/Entre-Hilos-y-Territorios/releases/download/video-ingles-final-2026-10-30/voices-of-la-guajira-final-2026-10-30.mp4',
    /** Subtitles from the original .srt, retimed to the final edit (2 s removed at ≈ 3:02). */
    captions: 'video/voices-of-la-guajira-final-2026-10-30.en.vtt',
    /** Still from the final video at 0:07 (all five characters, no titles or subtitles), 1920×1080 WebP. */
    poster: 'images/ingles/voices-of-la-guajira-0007.webp' as string | null,
    /** The same still at 1280×720, for the index plate on the home page. */
    still: 'images/ingles/voices-of-la-guajira-0007-1280.webp',
    durationLabel: '3:48',
    /** Subtitles are burned into the video image. */
    burnedInSubtitles: true,
  },
  /** Names as they appear in the video (lower third) and its subtitles. */
  credits: [
    { role: 'Interviewers (as shown in the video)', names: 'Daniel, Julieta and Luciana' },
    { role: 'Wayuu guests (as shown in the video)', names: 'Isabella and Santiago' },
    { role: 'Team', names: 'Daniel Sierra · Julieta Borda · Luciana Mulett · Santiago Cortes · Isabella Naranjo' },
  ],
  durationNote:
    'For academic review: the interview runs about 3 minutes 48 seconds; the Language Arts brief asks for 2–3 minutes. It is presented complete, as edited.',
  /** Question-based chapters, timecodes from the subtitle file. */
  chapters: [
    { t: 7.34, label: 'Welcome' },
    { t: 41.71, label: 'What makes Wayuu culture special?' },
    { t: 77.78, label: 'How do Wayuu people communicate and solve conflicts?' },
    { t: 109.34, label: 'What are the most important Wayuu traditions?' },
    { t: 138.03, label: 'What language do Wayuu people speak?' },
    { t: 170.65, label: 'How do Wayuu people preserve their culture today?' },
    { t: 199.18, label: 'Closing' },
  ],
  /** Language Arts resources proposed by the school. */
  proposedResources: [
    {
      label: '“Cultural experience with an indigenous Wayuu family in Guajira”.',
      url: 'https://mytriptocolombia.com/cultural-experience-with-an-indigenous-wayuu-family-in-guajira/',
      provenance: 'Red Textual · Language Arts',
    },
    {
      label:
        '“Bridging the gap between oral tradition and technology: Sebastián Epiyeu’s workshop for young Wayuunaiki creators in Colombia”.',
      url: 'https://globalvoices.org/2025/05/31/bridging-the-gap-between-oral-tradition-and-technology-sebastian-epiyeus-workshop-for-young-wayuunaiki-creators-in-colombia/',
      provenance: 'Red Textual · Language Arts',
    },
    {
      label: '“Stay in a ranchería and immerse yourself in Wayuu culture”.',
      url: 'https://colombia.travel/en/riohacha/wayuu-settlements',
      provenance: 'Red Textual · Language Arts',
    },
    {
      label: '“Spatial planning for resilient economic diversification: La Guajira, Colombia”.',
      url: 'https://www.greenpolicyplatform.org/case-studies/spatial-planning-resilient-economic-diversification-la-guajira-colombia',
      provenance: 'Red Textual · Language Arts',
    },
  ] as SourceRef[],
  /** Future: separately produced animated intro / interstitial videos. */
  animatedIntro: null as { src: string; poster?: string } | null,
};
