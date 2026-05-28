import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const serverDir = "dist/server";
const clientDir = "../client";
const candidates = ["index.mjs", "server.js"];
const main = candidates.find((file) => existsSync(`${serverDir}/${file}`));

if (!main) {
  throw new Error(
    `Could not find a Cloudflare Worker entry in ${serverDir}. Expected one of: ${candidates.join(", ")}`,
  );
}

mkdirSync(serverDir, { recursive: true });

writeFileSync(
  `${serverDir}/wrangler.json`,
  `${JSON.stringify(
    {
      compatibility_date: "2026-05-28",
      main,
      assets: {
        binding: "ASSETS",
        directory: clientDir,
      },
      name: "tanstack-start-ts",
      compatibility_flags: ["nodejs_compat"],
      no_bundle: true,
      rules: [
        {
          type: "ESModule",
          globs: ["**/*.mjs", "**/*.js"],
        },
      ],
    },
    null,
    2,
  )}\n`,
);

console.log(`Wrote ${serverDir}/wrangler.json for ${main}`);