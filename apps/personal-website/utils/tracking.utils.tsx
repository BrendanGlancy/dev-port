import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

export const registerVercelAnalytics = () => {
  if (trackingEnabled) {
    return <Analytics />;
  }
};
