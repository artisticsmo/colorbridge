import { fileURLToPath } from 'node:url';
import { start } from './lib/server.mjs';
import { run, validate } from './core.mjs';
import { product } from './project.mjs';
export * from './core.mjs';
export const spec = { ...{
  "slug": "colorbridge",
  "repo": "colorbridge",
  "owner": "artisticsmo",
  "title": "Colorbridge",
  "purpose": "Repair declared color-token contrast pairs while preserving locks",
  "workflow": "A Kite UI agent can pay for a contrast report and reversible token patch, then independently review every affected usage pair.",
  "colors": [
    "#faf8f3",
    "#34303b",
    "#6b3f8d"
  ],
  "required": [
    "tokens",
    "pairs"
  ],
  "sample": {
    "tokens": {
      "brand": "#6B3F8D",
      "text": "#777777",
      "surface": "#FFFFFF"
    },
    "pairs": [
      {
        "foreground": "text",
        "background": "surface",
        "textClass": "normal"
      }
    ],
    "locked": [
      "brand"
    ]
  },
  "changed": "Current sRGB luminance breakpoint, explicit text classes, unsupported pairs marked unchecked, shared-token revalidation and no regression of previously passing pairs.",
  "limits": "Opaque sRGB only. Bounded search may leave conflicts unresolved; the report does not certify a whole website or infer typography.",
  "version": "0.3.0",
  "inputSchema": {
    "type": "object",
    "required": [
      "tokens",
      "pairs"
    ],
    "properties": {
      "tokens": {
        "type": "object"
      },
      "pairs": {
        "type": "array"
      },
      "locked": {
        "type": "array"
      }
    }
  }
}, run, validate, product };
if (process.argv[1] === fileURLToPath(import.meta.url)) start(spec);

