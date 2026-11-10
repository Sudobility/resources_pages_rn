/**
 * @fileoverview Shared internal loading spinner. Centered ActivityIndicator.
 * Not exported from the package barrel.
 */
import { View, ActivityIndicator } from 'react-native';

export function LoadingSpinner() {
  return (
    <View
      className='items-center justify-center py-12'
      accessibilityLabel='Loading'
    >
      <ActivityIndicator />
    </View>
  );
}
