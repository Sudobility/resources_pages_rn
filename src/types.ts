/**
 * Prop contracts for the presentational RN resources components.
 * Mirror of resources_pages' web types. Copy and i18n via `labels`, derived
 * values via `formatters`; no component here fetches or opens a URL itself.
 */
import type { ReactNode } from 'react';
import type { Resource } from '@sudobility/resources_client';

export type { Resource };

export interface ResourcesScreenLabels {
  /** Heading above the list. Pass '' to suppress it. */
  title: string;
  /** Shown (muted, centered) when there are no resources. */
  empty: string;
  /** Title of the error block. */
  errorTitle: string;
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
}

export interface ResourcesScreenProps {
  resources: Resource[];
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
