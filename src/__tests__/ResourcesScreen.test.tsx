import { describe, it, expect, vi } from 'vitest';
import { ResourcesScreen } from '../ResourcesScreen';
import type {
  ResourcesScreenProps,
  ResourceSectionWithResources,
} from '../types';
import { render, firePress } from './test-utils';

const labels: ResourcesScreenProps['labels'] = {
  title: 'Resources',
  empty: 'No resources yet',
  errorTitle: 'Error',
};

const formatters: ResourcesScreenProps['formatters'] = {
  shortenDomain: url => url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
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

function base(
  overrides: Partial<ResourcesScreenProps> = {}
): ResourcesScreenProps {
  return {
    sections: [],
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
    // Announced as the web spinner is: labelled "Loading" and busy.
    const status = container.querySelector('[aria-busy="true"]');
    expect(status?.getAttribute('aria-label')).toBe('Loading');
  });

  it('shows the empty state when there are no sections', async () => {
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

  it('renders a section heading and its tiles with domain + link', async () => {
    const { queryByText, container } = await render(
      <ResourcesScreen {...base({ sections })} />
    );
    expect(queryByText('Sheet music')).not.toBeNull();
    expect(queryByText('Learn Theory')).not.toBeNull();
    expect(queryByText('Music theory basics')).not.toBeNull();
    expect(queryByText('musictheory.net')).not.toBeNull();
    // The web tile is an anchor named "Open <title>"; this one is a link too.
    const link = container.querySelector('[role="link"]') as HTMLElement;
    expect(link).not.toBeNull();
    expect(link.getAttribute('aria-label')).toBe('Open Learn Theory');
  });

  it('labels a tile with labels.openAriaLabel when given', async () => {
    const openAriaLabel = vi.fn((title: string) => `Ouvrir ${title}`);
    const { container } = await render(
      <ResourcesScreen
        {...base({ sections, labels: { ...labels, openAriaLabel } })}
      />
    );
    expect(
      container.querySelector('[role="link"]')?.getAttribute('aria-label')
    ).toBe('Ouvrir Learn Theory');
    expect(openAriaLabel).toHaveBeenCalledWith('Learn Theory');
  });

  it('shows the whole icon, and a blank slot when there is none', async () => {
    const withIcon = await render(<ResourcesScreen {...base({ sections })} />);
    const icon = withIcon.container.querySelector(
      '[data-testid="Image"]'
    ) as HTMLElement;
    expect(icon.getAttribute('src')).toBe('https://example.com/favicon.png');
    // `object-contain` on the web: never cropped to the square.
    expect(icon.getAttribute('data-resize-mode')).toBe('contain');
    withIcon.unmount();

    const noIcon = await render(
      <ResourcesScreen
        {...base({
          sections: [
            {
              ...sections[0],
              resources: [{ ...sections[0].resources[0], iconUrl: '' }],
            },
          ],
        })}
      />
    );
    expect(noIcon.container.querySelector('[data-testid="Image"]')).toBeNull();
    expect(noIcon.queryByText('Learn Theory')).not.toBeNull();
  });

  it('leaves out the description of a resource that has none', async () => {
    const { queryByText, container } = await render(
      <ResourcesScreen
        {...base({
          sections: [
            {
              ...sections[0],
              resources: [{ ...sections[0].resources[0], text: '' }],
            },
          ],
        })}
      />
    );
    expect(queryByText('Music theory basics')).toBeNull();
    // Title and domain only.
    expect(
      container.querySelectorAll('[role="link"] [data-testid="Text"]')
    ).toHaveLength(2);
  });

  it('suppresses the page title and a section title passed as empty', async () => {
    const { queryByText, container } = await render(
      <ResourcesScreen
        {...base({
          labels: { ...labels, title: '' },
          sections: [{ ...sections[0], title: '' }],
        })}
      />
    );
    expect(queryByText('Resources')).toBeNull();
    expect(queryByText('Sheet music')).toBeNull();
    // The tiles are still there.
    expect(container.querySelectorAll('[role="link"]')).toHaveLength(1);
  });

  it('shows the page title', async () => {
    const { queryByText } = await render(<ResourcesScreen {...base()} />);
    expect(queryByText('Resources')).not.toBeNull();
  });

  it('renders emptyStateComponent in place of the default empty state', async () => {
    const { queryByText } = await render(
      <ResourcesScreen
        {...base({ emptyStateComponent: <span>Come back later</span> })}
      />
    );
    expect(queryByText('Come back later')).not.toBeNull();
    expect(queryByText('No resources yet')).toBeNull();
  });

  it('renders loading, error and content as independent blocks', async () => {
    // Loading hides both the empty state and the sections...
    const loading = await render(
      <ResourcesScreen {...base({ isLoading: true, sections })} />
    );
    expect(loading.queryByText('No resources yet')).toBeNull();
    expect(loading.queryByText('Learn Theory')).toBeNull();
    loading.unmount();

    // ...while an error sits above whatever else there is to show.
    const errored = await render(
      <ResourcesScreen {...base({ error: 'boom', sections })} />
    );
    expect(errored.container.querySelector('[role="alert"]')?.textContent).toBe(
      'Errorboom'
    );
    expect(errored.queryByText('Learn Theory')).not.toBeNull();
    errored.unmount();

    const erroredEmpty = await render(
      <ResourcesScreen {...base({ error: 'boom' })} />
    );
    expect(erroredEmpty.queryByText('No resources yet')).not.toBeNull();
  });

  it('calls onResourcePress when a tile is tapped', async () => {
    const onResourcePress = vi.fn();
    const { container } = await render(
      <ResourcesScreen {...base({ sections, onResourcePress })} />
    );
    const tile = container.querySelector(
      '[data-testid="TouchableOpacity"]'
    ) as HTMLElement;
    expect(tile).not.toBeNull();
    firePress(tile);
    expect(onResourcePress).toHaveBeenCalledWith(sections[0].resources[0]);
  });
});
