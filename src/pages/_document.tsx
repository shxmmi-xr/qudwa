import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Malayalam:wght@400;500;700;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Sora:wght@400;600;700;800&family=Unbounded:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <meta name="theme-color" content="#060306" />
        {/* Default OG / Social sharing */}
        <meta property="og:site_name" content="QUDWA 2026" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="QUDWA 2026 – KUIA Arts Fest" />
        <meta property="og:description" content="QUDWA KUIA Arts Fest 2026 – Celebrating the scholars and students of Kasaragod. Official fest portal." />
        <meta property="og:image" content="https://qudwa-2026.vercel.app/images/og-default.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://qudwa-2026.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QUDWA 2026 – KUIA Arts Fest" />
        <meta name="twitter:description" content="QUDWA KUIA Arts Fest 2026 – Official fest portal." />
        <meta name="twitter:image" content="https://qudwa-2026.vercel.app/images/og-default.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="QUDWA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="QUDWA" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=2" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png?v=2" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
      </Head>
      <body className="bg-[#060306] text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
