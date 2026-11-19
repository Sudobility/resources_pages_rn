import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Linking } from 'react-native';
import { ResourcesScreenConnected } from '../ResourcesScreenConnected';
import type {
  ResourcesScreenLabels,
  ResourceSectionWithResources,
} from '../types';
import { render, firePress } from './test-utils';

const mockUseResources = vi.fn();

vi.mock('@sudobility/resources_client', () => ({
  useResources: (...args: unknown[]) => mockUseResources(...args),
  // The client's formatter, reduced to what the spec needs to tell it apart
  // from an override.
  shortenDomain: (url: string) => `client:${new URL(url).hostname}`,
}));

const labels: ResourcesScreenLabels = {
  title: 'Resources',
  empty: 'No resources yet',
  errorTitle: 'Error',
};

const sections: ResourceSectionWithResources[] = [
  {
    id: 's1',
    title: 'Sheet music',
    sortOrder: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    resources: [
      {
        id: 'a',
        title: 'Learn Theory',
        text: 'Music theory basics',
        iconUrl: 'https://example.com/favicon.png',
        url: 'https://www.musictheory.net/lessons',
        sortOrder: 0,
        enabled: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  },
];

function givenResources(overrides = {}) {
  mockUseResources.mockReturnValue({
    sections,
    isLoading: false,
    error: null,
    ...overrides,
  });
}

describe('ResourcesScreenConnected', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads the catalog for the given locale and renders it', async () => {
    givenResources();
    const { queryByText } = await render(
      <ResourcesScreenConnected locale='fr' labels={labels} />
    );

    expect(mockUseResources).toHaveBeenCalledWith('fr');
    expect(queryByText('Resources')).not.toBeNull();
    expect(queryByText('Sheet music')).not.toBeNull();
    expect(queryByText('Learn Theory')).not.toBeNull();
  });

  it("formats the domain with the client's shortenDomain by default", async () => {
    givenResources();
    const { queryByText } = await render(
      <ResourcesScreenConnected locale='en' labels={labels} />
    );
    expect(queryByText('client:www.musictheory.net')).not.toBeNull();
  });

  it('lets the host override the domain formatter', async () => {
    givenResources();
    const { queryByText } = await render(
      <ResourcesScreenConnected
        locale='en'
        labels={labels}
        formatters={{ shortenDomain: () => 'custom.example' }}
      />
    );
    expect(queryByText('custom.example')).not.toBeNull();
    expect(queryByText('client:www.musictheory.net')).toBeNull();
  });

  it('shows the loading and empty states the hook reports', async () => {
    givenResources({ sections: [], isLoading: true });
    const loading = await render(
      <ResourcesScreenConnected locale='en' labels={labels} />
    );
    expect(
      loading.container.querySelector('[data-testid="ActivityIndicator"]')
    ).not.toBeNull();
    loading.unmount();

    givenResources({ sections: [] });
    const empty = await render(
      <ResourcesScreenConnected locale='en' labels={labels} />
    );
    expect(empty.queryByText('No resources yet')).not.toBeNull();
  });

  it("shows the hook's error message under the error title", async () => {
    givenResources({ sections: [], error: new Error('Network down') });
    const { container } = await render(
      <ResourcesScreenConnected locale='en' labels={labels} />
    );
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      'ErrorNetwork down'
    );
  });

  it('opens the resource when its tile is tapped', async () => {
    givenResources();
    const { container } = await render(
      <ResourcesScreenConnected locale='en' labels={labels} />
    );

    firePress(container.querySelector('[role="link"]') as HTMLElement);

    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://www.musictheory.net/lessons'
    );
  });

  it('calls onResourcePress as a side-effect; the open still happens', async () => {
    givenResources();
    const order: string[] = [];
    const onResourcePress = vi.fn(() => order.push('side-effect'));
    vi.mocked(Linking.openURL).mockImplementationOnce(() => {
      order.push('open');
      return Promise.resolve();
    });
    const { container } = await render(
      <ResourcesScreenConnected
        locale='en'
        labels={labels}
        onResourcePress={onResourcePress}
      />
    );

    firePress(container.querySelector('[role="link"]') as HTMLElement);

    expect(onResourcePress).toHaveBeenCalledWith(sections[0].resources[0]);
    expect(order).toEqual(['side-effect', 'open']);
  });

  it('passes labels.openAriaLabel through to the tiles', async () => {
    givenResources();
    const { container } = await render(
      <ResourcesScreenConnected
        locale='en'
        labels={{ ...labels, openAriaLabel: title => `Abrir ${title}` }}
      />
    );
    expect(
      container.querySelector('[role="link"]')?.getAttribute('aria-label')
    ).toBe('Abrir Learn Theory');
  });
});
