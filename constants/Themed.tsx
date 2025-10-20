import { useColorScheme, View as DefaultView, Text as DefaultText } from 'react-native';

// Importa Colors.ts (um nível acima de 'components' para 'constants')
import { Colors } from '../constants/Colors'; 

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

// Função que estava causando o TypeError porque Colors era undefined (se o caminho estivesse errado)
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  
  // Garante que a cor seja acessada corretamente
  return Colors[colorName];
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  
  // Cor padrão do texto
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'darkGreyText');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  
  // Cor padrão do fundo
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'white');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
