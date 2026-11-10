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
loading/empty/error/content blocks.

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

## Build & test

- `bun run verify` before every push. Never run `bun test` (Bun's own runner).
- CI delegates to `johnqh/workflows` with `publish-target: github`.
