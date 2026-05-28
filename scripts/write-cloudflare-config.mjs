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
      name: "jimspare",
      compatibility_flags: ["nodejs_compat"],
      no_bundle: true,
      find_additional_modules: true,
      observability: {
        logs: {
          enabled: true,
          invocation_logs: true,
        },
      },
      rules: [
        {
          type: "ESModule",
          globs: ["**/*.mjs", "**/*.js", "**/h3-v2", "**/h3"],
        },
      ],

    },
    null,
    2,
  )}\n`,
);

console.log(`Wrote ${serverDir}/wrangler.json for ${main}`);