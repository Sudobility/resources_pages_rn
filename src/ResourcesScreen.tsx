/**
 * @fileoverview The resources screen: a vertical list of resource tiles.
 * Presentational — data, state, copy and formatters via props; the host wraps
 * it in a ScrollView + safe area. Loading / empty / error / content render as
 * four independent blocks, matching the web ResourcesPage.
 */
import { View, Text } from 'react-native';
import { designTokens } from '@sudobility/design';
import { LoadingSpinner } from './LoadingSpinner';
import { ResourceTile } from './ResourceTile';
import type { ResourcesScreenProps } from './types';

const { size, weight } = designTokens.typography;

export function ResourcesScreen({
  resources,
  isLoading,
  error,
  labels,
  formatters,
  onResourcePress,
  emptyStateComponent,
  className,
}: ResourcesScreenProps) {
  return (
    <View className={className}>
      {labels.title !== '' && (
        <Text
          className={[size['2xl'], weight.bold, 'mb-6 text-foreground'].join(
            ' '
          )}
        >
          {labels.title}
        </Text>
      )}

      {error && (
        <View
          className='mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4'
          accessibilityRole='alert'
        >
          <Text
            className={[size.sm, weight.medium, 'text-foreground'].join(' ')}
          >
            {labels.errorTitle}
          </Text>
          <Text className={[size.sm, 'text-destructive'].join(' ')}>
            {error}
          </Text>
        </View>
      )}

      {isLoading && <LoadingSpinner />}

      {!isLoading &&
        resources.length === 0 &&
        (emptyStateComponent ?? (
          <Text
            className={[size.sm, 'py-8 text-center text-muted-foreground'].join(
              ' '
            )}
          >
            {labels.empty}
          </Text>
        ))}

      {!isLoading && resources.length > 0 && (
        <View className='gap-3'>
          {resources.map(resource => (
            <ResourceTile
              key={resource.id}
              resource={resource}
              shortenDomain={formatters.shortenDomain}
              onPress={onResourcePress}
            />
          ))}
        </View>
      )}
    </View>
  );
}
