/**
 * Prop contracts for the presentational RN resources components.
 * The catalog is sectioned: a heading per section over a list of tiles.
 * Copy via `labels`, derived values via `formatters`; no fetching or URL
 * opening here. Mirror of resources_pages' web types.
 */
import type { ReactNode } from 'react';
import type {
  Resource,
  ResourceSectionWithResources,
} from '@sudobility/resources_client';

export type { Resource, ResourceSectionWithResources };

export interface ResourcesScreenLabels {
  /** Heading above the whole screen. Pass '' to suppress it. */
  title: string;
  /** Shown (muted, centered) when there are no sections. */
  empty: string;
  /** Title of the error block. */
  errorTitle: string;
  /** Accessible label for a tile's open action, given the resource title. */
  openAriaLabel?: (title: string) => string;
}

export interface ResourcesScreenFormatters {
  /** Short domain label under each tile, e.g. "musictheory.net". */
  shortenDomain: (url: string) => string;
}

export interface ResourceTileProps {
  resource: Resource;
  shortenDomain: (url: string) => string;
  /** Called when the tile is tapped; the connected screen opens the URL. */
  onPress: (resource: Resource) => void;
  openAriaLabel?: (title: string) => string;
}

export interface ResourcesScreenProps {
  sections: ResourceSectionWithResources[];
  isLoading: boolean;
  error: string | null;
  labels: ResourcesScreenLabels;
  formatters: ResourcesScreenFormatters;
  /** Called when a tile is tapped. */
  onResourcePress: (resource: Resource) => void;
  /** Overrides the default empty state. */
  emptyStateComponent?: ReactNode;
  className?: string;
}
