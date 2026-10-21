import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const root = path.resolve(process.env.GIO_OUTPUT || "public/marketing");
for (const file of fs
  .readdirSync(path.join(root, "capturas"))
  .filter((f) => f.endsWith(".png"))) {
  const p = path.join(root, "capturas", file);
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-i",
      p,
      "-quality",
      "82",
      p.replace(/\.png$/, ".webp"),
    ],
    { stdio: "inherit" },
  );
}
execFileSync(
  "ffmpeg",
  [
    "-y",
    "-loglevel",
    "error",
    "-i",
    path.join(root, "video/gio-demo.webm"),
    "-ss",
    "0.8",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "25",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    path.join(root, "video/gio-demo.mp4"),
  ],
  { stdio: "inherit" },
);
console.log("Video MP4 y capturas WebP actualizados.");
