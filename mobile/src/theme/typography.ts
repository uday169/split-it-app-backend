import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography: Record<string, TextStyle> = {
  heading1: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
};
