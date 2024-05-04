import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ILayoutState, LanguageEnum, ThemeModeEnum } from './types';

const initialState: ILayoutState = {
  language: LanguageEnum.EN,
  themeMode: ThemeModeEnum.DARK,
  displayMobileNavbar: false,
};

export const layoutSlice = createSlice({
  name: '@@layout',
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      if (state.language === LanguageEnum.EN) {
        state.language = LanguageEnum.FR;
      } else {
        state.language = LanguageEnum.EN;
      }
    },
    toggleDisplayMobileNavbar: (state) => {
      state.displayMobileNavbar = !state.displayMobileNavbar;
    },
    toggleThemeMode: (state) => {
      if (state.themeMode === ThemeModeEnum.DARK) {
        state.themeMode = ThemeModeEnum.LIGHT;
      } else {
        state.themeMode = ThemeModeEnum.DARK;
      }
    },
    setThemeMode: (state, action: PayloadAction<ThemeModeEnum>) => {
      state.themeMode = action.payload;
    },
  },
});

export const {
  toggleLanguage,
  toggleDisplayMobileNavbar,
  setThemeMode,
  toggleThemeMode,
} = layoutSlice.actions;

export const layoutReducer = layoutSlice.reducer;
