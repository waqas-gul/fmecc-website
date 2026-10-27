/** A responsive image produced by `npm run images`, or a brand asset served as-is. */
export interface ImageAsset {
  src: `/images/${string}.webp` | `/images/brand/${string}`;
  width: number;
  height: number;
  alt: string;
  /** Not real media yet; rendered as a labelled panel and must be replaced before launch. */
  placeholder?: true;
}

export interface VideoAsset {
  mp4: `/videos/${string}.mp4`;
  webm?: `/videos/${string}.webm`;
  poster: ImageAsset;
  placeholder?: true;
}
