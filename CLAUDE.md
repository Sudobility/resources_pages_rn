# resources_pages_rn (`@sudobility/resources_pages_rn`)

React Native UI components for the resources catalog — the RN mirror of
`@sudobility/resources_pages`. Raw RN primitives + NativeWind `className`, themed
through `@sudobility/design`. Built with `tsc` → `dist` + `fix-esm-imports.mjs`;
Metro reads `src` via the `react-native` export condition. Vitest (jsdom, RN
aliased to a DOM mock) for tests.

## Hard rule: UI only

- **Presentational** (`ResourcesScreen`, `ResourceTile`, `LoadingSpinner`): all
  data/state/copy/formatters via props; no fetching, no `Linking`.
- **Connected** (`ResourcesScreenConnected`): calls `resources_client`'s
  `useResources` and does the `Linking.openURL` on tap.

Keep it a mirror of the web package — same props shape, same four independent
loading/empty/error/content blocks, same `labels` (`title`, `empty`,
`errorTitle`, optional `openAriaLabel`). File for file: `ResourcesScreen` ↔
`ResourcesPage`, `ResourcesScreenConnected` ↔ `ResourcesPageConnected`,
`ResourceTile`, `LoadingSpinner`, `types`, `controls`. Change the web file and
its twin together.

Where it differs from the web, on purpose:

- **Names**: `Screen` for `Page`, `onResourcePress`/`onPress` for
  `onResourceClick`/`onClick`.
- **Who opens the link.** A web tile is an `<a href>` and opens itself, so the
  web's click handler is an optional side-effect. Here the presentational tile
  only reports the tap (`onPress`, required) and the connected screen opens the
  URL — that is the "no `Linking`" rule above. Through
  `ResourcesScreenConnected` the behaviour is the web's: the URL opens, and
  `onResourcePress` is an optional side-effect that runs first.
- **Layout**: one column of tiles; the web's 1/2/3-column grid is not
  reproduced.

## Colour comes from the design system (enforced)

Only semantic tokens (`bg-card`, `border-border`, `text-foreground`,
`text-muted-foreground`, `text-destructive`, …) and `designTokens.typography`
sizes/weights — never a palette colour or `theme-*` class.
`@sudobility/design` is a **peer** (host themes one copy).
`__tests__/design-system.test.ts` holds the package to that. A `className` must
be a complete literal (Tailwind scans text) — compose with `[...].join(' ')`,
never interpolate class fragments.

## Screen rendering — safe area & scroll insets

The presentational `ResourcesScreen` is a plain column; the **host** wraps it in
a ScrollView and honours the device safe area with `useSafeAreaInsets()` /
`SafeAreaView` — never a hard-coded padding. Decide per axis by whether it
scrolls: a non-scrolling axis pads by the inset; a scrolling axis renders
full-bleed with scroll insets. Under a tab navigator `insets.bottom` already
includes the tab bar — don't add it twice.

## How an app consumes it

Metro reads `src/` (`"react-native": "src/index.ts"` plus the `react-native`
condition in `exports`), never `dist/`: NativeWind styles `className` only in JSX
the app's Babel compiles, and precompiled `dist/` would render as unstyled text.
Keep `src/` in the published package. The app lists
`./node_modules/@sudobility/resources_pages_rn/{src,dist}/**/*.{js,jsx,ts,tsx}`
in its `tailwind.config.js` `content`.

## Build & test

- `bun run verify` before every push. Never run `bun test` (Bun's own runner).
- Specs render against `src/__tests__/mocks/react-native.ts`, which maps
  accessibility props to ARIA (`accessibilityRole` → `role`, `accessibilityLabel`
  → `aria-label`) so a spec can assert on them.
- CI delegates to `johnqh/workflows` with `publish-target: github`.
