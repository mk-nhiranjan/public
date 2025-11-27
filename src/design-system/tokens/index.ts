/**
 * Central export for all design tokens
 */

export * from './colors';
export * from './typography';
export * from './spacing';

// Re-export main token objects for convenience
import { lightColors, darkColors, getCurrentColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const tokens = {
  colors: {
    light: lightColors,
    dark: darkColors,
    current: getCurrentColors
  },
  typography,
  spacing
};

// Type-safe token access helper
export const useToken = <T extends keyof typeof tokens>(
  category: T
): typeof tokens[T] => {
  return tokens[category];
};
