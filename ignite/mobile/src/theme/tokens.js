// IGNITE design tokens — single source of truth for colors.
// CommonJS so both tailwind.config.js (Node) and app code (Metro) can load it.

const colors = {
  // Dark base surfaces
  base: '#121212',
  surface: '#1E1E1E',
  elevated: '#282828',
  edge: '#333333',

  // Typography on dark
  content: {
    DEFAULT: '#F5F5F5',
    secondary: '#B3B3B3',
    muted: '#7A7A7A',
  },

  // Competition — red (live races, pace battles, PRs under threat)
  competition: {
    DEFAULT: '#EF4444',
    bright: '#F87171',
    dim: '#B91C1C',
  },

  // Analysis — blue (stats, splits, post-run review)
  analysis: {
    DEFAULT: '#3B82F6',
    bright: '#60A5FA',
    dim: '#1D4ED8',
  },

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
};

module.exports = { colors };
