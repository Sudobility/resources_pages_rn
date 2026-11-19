# @sudobility/resources_pages_rn

React Native UI for the Sudobility **resources catalog** — a vertical list of
tiles, each showing an icon, title, description and shortened domain; tapping a
tile opens the resource with `Linking`. The web mirror is
`@sudobility/resources_pages`.

Styling is NativeWind `className` using only semantic `@sudobility/design`
tokens (a peer dep). The host provides NativeWind/Tailwind and owns the theme,
scroll and safe area. Metro loads this package from `src/` (the `react-native`
export condition) so the host's Babel compiles its `className`s; the host must
also scan it, or the classes are never generated and the screen renders
unstyled. In the app's `tailwind.config.js` `content`:

```js
'./node_modules/@sudobility/resources_pages_rn/{src,dist}/**/*.{js,jsx,ts,tsx}',
```

## Install

```bash
bun add @sudobility/resources_pages_rn
```

## Usage

Connected (reads `resources_client`'s `useResources`; call `initializeResources`
at startup). Wrap it in your own ScrollView + safe area:

```tsx
import { ScrollView } from 'react-native';
import { ResourcesScreenConnected } from '@sudobility/resources_pages_rn';

<ScrollView contentContainerClassName='p-4'>
  <ResourcesScreenConnected
    locale={currentLocale}
    labels={{ title: 'Resources', empty: 'Nothing here yet', errorTitle: 'Error' }}
  />
</ScrollView>;
```

Presentational (host supplies data + callbacks):

```tsx
import { ResourcesScreen } from '@sudobility/resources_pages_rn';
import { shortenDomain } from '@sudobility/resources_client';

<ResourcesScreen
  sections={sections}
  isLoading={false}
  error={null}
  labels={{ title: 'Resources', empty: 'Nothing here yet', errorTitle: 'Error' }}
  formatters={{ shortenDomain }}
  onResourcePress={r => Linking.openURL(r.url)}
/>;
```

## Exports

The web package's exports, with `Screen` for `Page` and `Press` for `Click`:

| Here | Web (`@sudobility/resources_pages`) |
|------|-------------------------------------|
| `ResourcesScreen` | `ResourcesPage` — presentational list of sections. |
| `ResourceTile` | `ResourceTile` — a single tile (a link). |
| `ResourcesScreenConnected` | `ResourcesPageConnected` — fetches via `useResources`. |
| `ResourcesScreenProps`, `ResourcesScreenLabels`, `ResourcesScreenFormatters`, `ResourcesScreenConnectedProps` | `ResourcesPageProps`, `ResourcesPageLabels`, `ResourcesPageFormatters`, `ResourcesPageConnectedProps` |
| `ResourceTileProps`, `Resource`, `ResourceSectionWithResources` | same names |

`labels` is the web's: `title` (`''` suppresses the heading), `empty`,
`errorTitle`, and optional `openAriaLabel(title)` for a tile's accessibility
label (default `Open <title>`).

One contract differs. A web tile is an `<a href>` and opens itself, so
`onResourceClick` is an optional side-effect there. React Native has no anchor:
the presentational `ResourcesScreen` / `ResourceTile` only report the tap
(`onResourcePress` / `onPress`, required), and `ResourcesScreenConnected` opens
the URL with `Linking` — its own `onResourcePress` is the optional side-effect,
exactly like the web's `onResourceClick`.

## Scripts

- `bun run verify` — typecheck + lint + unit tests + build.
- `bun run test:unit` — Vitest (jsdom, react-native aliased to a DOM mock). No
  `test` script; never run `bun test`.

Metro consumes `src/index.ts`; `dist` is for non-Metro tooling.
