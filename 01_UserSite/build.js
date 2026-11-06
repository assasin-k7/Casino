const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["games.js"],
    bundle: true,
    outfile: "public/js/originals.js",
    format: "iife",
    platform: "browser",
    target: ["es2022"],
    jsx: "automatic",
    minify: true,
    legalComments: "none",
    define: {
      "process.env.NEXT_PUBLIC_API_URL": '"/api"',
      "process.env.NEXT_PUBLIC_WS_URL": '"/realtime"',
      "process.env.NODE_ENV": '"production"',
    },
  })
  .then(() => console.log("originals.js"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
