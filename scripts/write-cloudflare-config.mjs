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

// NOTE: We intentionally let Wrangler bundle the worker (default esbuild path).
// Previously we set `no_bundle: true` to upload nitro's pre-bundled chunks as-is,
// but Cloudflare's module uploader flattened/renamed the underscore-prefixed
// chunk dirs (`_libs/`, `_ssr/`) under `assets/` and dropped extensions, which
// broke imports like `../_libs/h3-v2.mjs` at runtime
// (Error: No such module "assets/h3-v2").
// Letting Wrangler re-bundle resolves all static imports into a single worker.
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
      observability: {
        logs: {
          enabled: true,
          invocation_logs: true,
        },
      },
    },
    null,
    2,
  )}\n`,
);

console.log(`Wrote ${serverDir}/wrangler.json for ${main}`);
