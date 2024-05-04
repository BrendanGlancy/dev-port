import Hotjar from '@hotjar/browser';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

// Default: Tracking is enabled when no .env file is present
export const trackingEnabled =
  (process.env.ENABLE_TRACKING && process.env.ENABLE_TRACKING === 'true') ??
  true;

export const registerHotjar = () => {
  if (trackingEnabled) {
    const siteId = parseInt(process.env.HOTJAR_WEBSITE_UID ?? '3629844', 10);
    const hotjarVersion = parseInt(process.env.HOTJAR_VERSION ?? '6', 10);

    Hotjar.init(siteId, hotjarVersion);
  }
};

export const registerVercelAnalytics = () => {
  if (trackingEnabled) {
    return <Analytics />;
  }
};
