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

export const registerGTM = () => {
  if (trackingEnabled) {
    return (
      <>
        {/* Google Tag Manager */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${
            process.env.GOOGLE_TAG_MANAGER_UID ?? 'AW-779764156'
          }`}
        />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
  
          gtag('config', '${
            process.env.GOOGLE_TAG_MANAGER_UID ?? 'AW-779764156'
          }');
        `}
        </Script>
      </>
    );
  }
};

export const registerMicrosoftClarity = () => {
  if (trackingEnabled) {
    return (
      <>
        {/* Microsoft Clarity */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${
                process.env.MICROSOFT_CLARITY_UID ?? 'inxvkei7ob'
              }");
            `,
          }}
        />
      </>
    );
  }
};

export const registerVercelAnalytics = () => {
  if (trackingEnabled) {
    return <Analytics />;
  }
};

export const registerDebugBearRUM = () => {
  if (trackingEnabled) {
    return (
      <>
        {/* RUM for DebugBear */}
        <script
          src={`https://cdn.debugbear.com/${
            process.env.DEBUGBEAR_RUM_UID ?? 'H50JpacVHAon'
          }.js`}
          async
        ></script>
      </>
    );
  }
};
