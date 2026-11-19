/**
 * @fileoverview Shared internal loading spinner. Centered ActivityIndicator.
 * Not exported from the package barrel.
 */
import { View, ActivityIndicator } from 'react-native';

/**
 * Renders a centered loading indicator, announced the way the web spinner is
 * (`role='status'`, `aria-label='Loading'`, `aria-busy`): one accessible
 * element, labelled "Loading" and marked busy.
 */
export function LoadingSpinner() {
  return (
    <View
      className='items-center justify-center py-12'
      accessible
      accessibilityRole='progressbar'
      accessibilityLabel='Loading'
      accessibilityState={{ busy: true }}
    >
      <ActivityIndicator />
    </View>
  );
}
