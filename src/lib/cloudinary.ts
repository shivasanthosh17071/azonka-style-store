/**
 * Cloudinary serves a JPG poster frame for any video asset by swapping the file
 * extension — no separate thumbnail upload needed. Falls back to the original
 * URL (browsers can still use a <video> as its own poster source) if it isn't
 * a recognizable Cloudinary video URL.
 */
export function videoPosterUrl(url: string): string {
  return url.replace(/\.(mp4|mov|webm|m4v)(\?.*)?$/i, ".jpg$2");
}
