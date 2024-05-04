export type Asset = {
  light: string;
  dark: string;
};

export const getThemedContent = (theme: string | undefined, asset: Asset) => {
  if (theme === 'dark') {
    return asset.dark;
  } else {
    return asset.light;
  }
};
