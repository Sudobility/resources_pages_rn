# @sudobility/resources_pages_rn

React Native UI for the Sudobility **resources catalog** — a vertical list of
tiles, each showing an icon, title, description and shortened domain; tapping a
tile opens the resource with `Linking`. The web mirror is
`@sudobility/resources_pages`.

Styling is NativeWind `className` using only semantic `@sudobility/design`
tokens (a peer dep). The host provides NativeWind/Tailwind and must scan this
package so its classes are generated, and owns the theme, scroll and safe area.

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
  resources={resources}
  isLoading={false}
  error={null}
  labels={{ title: 'Resources', empty: 'Nothing here yet', errorTitle: 'Error' }}
  formatters={{ shortenDomain }}
  onResourcePress={r => Linking.openURL(r.url)}
/>;
```

## Scripts

- `bun run verify` — typecheck + lint + unit tests + build.
- `bun run test:unit` — Vitest (jsdom, react-native aliased to a DOM mock). No
  `test` script; never run `bun test`.

Metro consumes `src/index.ts`; `dist` is for non-Metro tooling.
