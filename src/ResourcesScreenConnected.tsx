/**
 * @fileoverview Connected resources screen: reads the sectioned catalog from
 * resources_client's `useResources` (the host must have called
 * `initializeResources`) and opens tapped resources with RN `Linking`.
 */
import { Linking } from 'react-native';
import { useResources, shortenDomain } from '@sudobility/resources_client';
import { ResourcesScreen } from './ResourcesScreen';
import type {
  Resource,
  ResourcesScreenFormatters,
  ResourcesScreenLabels,
} from './types';

export interface ResourcesScreenConnectedProps {
  /** Locale to load, usually the app's current UI language. Falls back to en upstream. */
  locale: string;
  labels: ResourcesScreenLabels;
  /** Override the domain formatter; defaults to the client's shortenDomain. */
  formatters?: Partial<ResourcesScreenFormatters>;
  /** Side-effect before opening (analytics); the open still happens. */
  onResourcePress?: (resource: Resource) => void;
  className?: string;
}

export function ResourcesScreenConnected({
  locale,
  labels,
  formatters,
  onResourcePress,
  className,
}: ResourcesScreenConnectedProps) {
  const { sections, isLoading, error } = useResources(locale);
  return (
    <ResourcesScreen
      sections={sections}
      isLoading={isLoading}
      error={error?.message ?? null}
      labels={labels}
      formatters={{ shortenDomain, ...formatters }}
      onResourcePress={resource => {
        onResourcePress?.(resource);
        void Linking.openURL(resource.url);
      }}
      className={className}
    />
  );
}
