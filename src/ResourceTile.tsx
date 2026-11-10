/**
 * @fileoverview A single resource tile: a tappable card showing the icon,
 * title, description and shortened domain. Presentational — tapping calls
 * `onPress`; the connected screen does the actual URL open. Colour comes only
 * from the design system (semantic NativeWind tokens).
 */
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { designTokens } from '@sudobility/design';
import type { ResourceTileProps } from './types';

const { size, weight } = designTokens.typography;

export function ResourceTile({
  resource,
  shortenDomain,
  onPress,
}: ResourceTileProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(resource)}
      accessibilityRole='link'
      accessibilityLabel={`Open ${resource.title}`}
      className='flex-row gap-4 rounded-xl border border-border bg-card p-4'
    >
      {resource.iconUrl ? (
        <Image
          source={{ uri: resource.iconUrl }}
          accessibilityIgnoresInvertColors
          className='h-10 w-10 rounded-md'
        />
      ) : (
        <View className='h-10 w-10 rounded-md bg-muted' />
      )}
      <View className='flex-1'>
        <Text
          numberOfLines={1}
          className={[size.base, weight.semibold, 'text-foreground'].join(' ')}
        >
          {resource.title}
        </Text>
        {resource.text !== '' && (
          <Text
            numberOfLines={2}
            className={[size.sm, 'mt-0.5 text-muted-foreground'].join(' ')}
          >
            {resource.text}
          </Text>
        )}
        <Text
          numberOfLines={1}
          className={[size.xs, 'mt-1 text-muted-foreground'].join(' ')}
        >
          {shortenDomain(resource.url)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
