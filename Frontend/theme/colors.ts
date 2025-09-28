export const COLORS = {
  navy: '#112B3C',
  steelBlue: '#205375',
  safetyOrange: '#F66B0E',
  softGray: '#EFEFEF',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof COLORS;
