export const colors = {
  primary: {
    50: '#f0f0ff',
    100: '#d9d9f5',
    200: '#b3b3e8',
    300: '#8c8cdb',
    400: '#6666ce',
    500: '#5555c2',
    400: '#4444b5',
    300: '#3333a8',
    200: '#22229b',
    100: '#18186b',
    50: '#0e0e4d',
  },
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
    destructive: '#ef4444',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
} as const;

export const typography = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tighter: '-0.025em',
    tight: '-0.015em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

export const shadows = {
  xs: '0 1px 2px oklch(0 0 0 / 0.05)',
  sm: '0 1px 3px oklch(0 0 0 / 0.1), 0 1px 2px oklch(0 0 0 / 0.06)',
  DEFAULT: '0 1px 3px oklch(0 0 0 / 0.12), 0 1px 2px oklch(0 0 0 / 0.06)',
  md: '0 4px 6px oklch(0 0 0 / 0.1), 0 2px 4px oklch(0 0 0 / 0.06)',
  lg: '0 10px 15px oklch(0 0 0 / 0.1), 0 4px 6px oklch(0 0 0 / 0.05)',
  xl: '0 20px 25px oklch(0 0 0 / 0.1), 0 8px 10px oklch(0 0 0 / 0.04)',
  '2xl': '0 25px 50px oklch(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px oklch(0 0 0 / 0.06)',
  ring: '0 0 0 2px oklch(0.985 0 0), 0 0 0 4px oklch(0.55 0.2 260 / 0.4)',
  'ring-sm': '0 0 0 1px oklch(0.985 0 0), 0 0 0 2px oklch(0.55 0.2 260 / 0.4)',
} as const;

export const transitions = {
  fast: '150ms ease',
  default: '200ms ease',
  slow: '300ms ease',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  base: '0',
  dropdown: '1000',
  sticky: '1020',
  modal: '1030',
  popover: '1040',
  tooltip: '1050',
} as const;

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
} as const;

export type Theme = typeof theme;
