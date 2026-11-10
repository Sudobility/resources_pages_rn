import { describe, it, expect, vi } from 'vitest';
import { ResourcesScreen } from '../ResourcesScreen';
import type { ResourcesScreenProps, Resource } from '../types';
import { render, firePress } from './test-utils';

const labels: ResourcesScreenProps['labels'] = {
  title: 'Resources',
  empty: 'No resources yet',
  errorTitle: 'Error',
};

const formatters: ResourcesScreenProps['formatters'] = {
  shortenDomain: url => url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
};

const resources: Resource[] = [
  {
    id: 'a',
    app: 'music',
    locale: 'en',
    title: 'Learn Theory',
    text: 'Music theory basics',
    iconUrl: 'https://example.com/favicon.png',
    url: 'https://www.musictheory.net/lessons',
    sortOrder: 0,
    enabled: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

function base(
  overrides: Partial<ResourcesScreenProps> = {}
): ResourcesScreenProps {
  return {
    resources: [],
    isLoading: false,
    error: null,
    labels,
    formatters,
    onResourcePress: vi.fn(),
    ...overrides,
  };
}

describe('ResourcesScreen', () => {
  it('shows the loading spinner', async () => {
    const { container } = await render(
      <ResourcesScreen {...base({ isLoading: true })} />
    );
    expect(
      container.querySelector('[data-testid="ActivityIndicator"]')
    ).not.toBeNull();
  });

  it('shows the empty state', async () => {
    const { queryByText } = await render(<ResourcesScreen {...base()} />);
    expect(queryByText('No resources yet')).not.toBeNull();
  });

  it('shows an error', async () => {
    const { queryByText } = await render(
      <ResourcesScreen {...base({ error: 'boom' })} />
    );
    expect(queryByText('Error')).not.toBeNull();
    expect(queryByText('boom')).not.toBeNull();
  });

  it('renders a tile with title and shortened domain', async () => {
    const { queryByText } = await render(
      <ResourcesScreen {...base({ resources })} />
    );
    expect(queryByText('Learn Theory')).not.toBeNull();
    expect(queryByText('musictheory.net')).not.toBeNull();
  });

  it('calls onResourcePress when a tile is tapped', async () => {
    const onResourcePress = vi.fn();
    const { container } = await render(
      <ResourcesScreen {...base({ resources, onResourcePress })} />
    );
    const tile = container.querySelector(
      '[data-testid="TouchableOpacity"]'
    ) as HTMLElement;
    expect(tile).not.toBeNull();
    firePress(tile);
    expect(onResourcePress).toHaveBeenCalledWith(resources[0]);
  });
});
