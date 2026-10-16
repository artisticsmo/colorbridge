# Colorbridge

Contrast repair suggestions for explicit sRGB design tokens and declared foreground/background pairs. It uses the WCAG relative-luminance formula, respects locked tokens, and rechecks every affected pair.

This is a synthetic public evaluation project for testing developer indexing. It does not claim whole-site accessibility, inspect screenshots, edit production CSS, claim Electric Capital acceptance, or contain client design systems. The account owner must review changes before any external submission.

## Run

```sh
npm test
npm start
```

Open `http://localhost:3000`. Black/white is reported as 21:1, and thresholds are compared without rounding a failing 4.499:1 pair upward.
