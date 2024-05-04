export enum LanguageEnum {
  EN = 'en',
  FR = 'fr',
}

export enum ThemeModeEnum {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface ILayoutState {
  readonly language: LanguageEnum;
  readonly themeMode: ThemeModeEnum;
  readonly displayMobileNavbar: boolean;
}
