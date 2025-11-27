/**
 * Color tokens from Figma design system
 * These values are derived from the CSS variables in globals.css
 */

export interface ColorTokens {
  // Base colors
  background: string;
  foreground: string;
  
  // Card
  card: string;
  cardForeground: string;
  
  // Popover
  popover: string;
  popoverForeground: string;
  
  // Primary brand colors
  primary: string;
  primaryForeground: string;
  
  // Secondary colors
  secondary: string;
  secondaryForeground: string;
  
  // Muted colors
  muted: string;
  mutedForeground: string;
  
  // Accent colors
  accent: string;
  accentForeground: string;
  
  // Destructive/Error colors
  destructive: string;
  destructiveForeground: string;
  
  // UI element colors
  border: string;
  input: string;
  inputBackground: string;
  switchBackground: string;
  ring: string;
  
  // Chart colors
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  
  // Sidebar colors
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

// Light theme colors
export const lightColors: ColorTokens = {
  background: '#ffffff',
  foreground: 'oklch(0.145 0 0)',
  card: '#ffffff',
  cardForeground: 'oklch(0.145 0 0)',
  popover: 'oklch(1 0 0)',
  popoverForeground: 'oklch(0.145 0 0)',
  primary: '#385854',
  primaryForeground: 'oklch(1 0 0)',
  secondary: 'oklch(0.95 0.0058 264.53)',
  secondaryForeground: '#385854',
  muted: '#ececf0',
  mutedForeground: '#717182',
  accent: '#e9ebef',
  accentForeground: '#385854',
  destructive: '#d4183d',
  destructiveForeground: '#ffffff',
  border: 'rgba(0, 0, 0, 0.1)',
  input: 'transparent',
  inputBackground: '#f3f3f5',
  switchBackground: '#cbced4',
  ring: 'oklch(0.708 0 0)',
  chart1: 'oklch(0.646 0.222 41.116)',
  chart2: 'oklch(0.6 0.118 184.704)',
  chart3: 'oklch(0.398 0.07 227.392)',
  chart4: 'oklch(0.828 0.189 84.429)',
  chart5: 'oklch(0.769 0.188 70.08)',
  sidebar: 'oklch(0.985 0 0)',
  sidebarForeground: 'oklch(0.145 0 0)',
  sidebarPrimary: '#385854',
  sidebarPrimaryForeground: 'oklch(0.985 0 0)',
  sidebarAccent: 'oklch(0.97 0 0)',
  sidebarAccentForeground: 'oklch(0.205 0 0)',
  sidebarBorder: 'oklch(0.922 0 0)',
  sidebarRing: 'oklch(0.708 0 0)'
};

// Dark theme colors
export const darkColors: ColorTokens = {
  background: 'oklch(0.145 0 0)',
  foreground: 'oklch(0.985 0 0)',
  card: 'oklch(0.145 0 0)',
  cardForeground: 'oklch(0.985 0 0)',
  popover: 'oklch(0.145 0 0)',
  popoverForeground: 'oklch(0.985 0 0)',
  primary: 'oklch(0.985 0 0)',
  primaryForeground: 'oklch(0.145 0 0)',
  secondary: 'oklch(0.205 0 0)',
  secondaryForeground: 'oklch(0.985 0 0)',
  muted: 'oklch(0.205 0 0)',
  mutedForeground: 'oklch(0.708 0 0)',
  accent: 'oklch(0.205 0 0)',
  accentForeground: 'oklch(0.985 0 0)',
  destructive: 'oklch(0.455 0.305 21.163)',
  destructiveForeground: 'oklch(0.985 0 0)',
  border: 'oklch(0.205 0 0)',
  input: 'oklch(0.205 0 0)',
  inputBackground: 'transparent',
  switchBackground: 'transparent',
  ring: 'oklch(0.5 0 0)',
  chart1: 'oklch(0.822 0.16 45.776)',
  chart2: 'oklch(0.643 0.073 189.36)',
  chart3: 'oklch(0.6 0.085 240.43)',
  chart4: 'oklch(0.917 0.104 85.662)',
  chart5: 'oklch(0.861 0.118 67.813)',
  sidebar: 'oklch(0.174 0 0)',
  sidebarForeground: 'oklch(0.926 0 0)',
  sidebarPrimary: 'oklch(0.805 0 0)',
  sidebarPrimaryForeground: 'oklch(0.145 0 0)',
  sidebarAccent: 'oklch(0.234 0 0)',
  sidebarAccentForeground: 'oklch(0.926 0 0)',
  sidebarBorder: 'oklch(0.234 0 0)',
  sidebarRing: 'oklch(0.5 0 0)'
};

// Helper function to get CSS variable value
export const getCSSVariable = (variable: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

// Helper function to get current theme colors
export const getCurrentColors = (): ColorTokens => {
  if (typeof window === 'undefined') return lightColors;
  const isDark = document.documentElement.classList.contains('dark');
  return isDark ? darkColors : lightColors;
};
