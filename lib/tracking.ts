// Site-wide tracking and widgets, added to every page from this one place:
// the migrated pages get it in lib/wp.ts (renderDocument), the React pages in
// app/layout.tsx.
//
// GA4 and GTM are the tags WordPress output through Site Kit (Google tag
// GT-TWZG7JP -> GA4 property G-SZF5PDG3CP, and container GTM-K229SLJ).

export const GOOGLE_TAG_ID = 'GT-TWZG7JP';
export const GTM_ID = 'GTM-K229SLJ';
export const CHATBOT = { src: 'https://chatbot.hiaimate.com/chatbot-widget.js', widgetKey: 'aw_4wyjY-klVZJkz3vFJWG9NtTWTPBTA806' };

export const GTAG_INLINE = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_TAG_ID}');`;
export const GTM_INLINE = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

/** For the top of <head>. */
export const TRACKING_HEAD =
  `<script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}"></script>` +
  `<script>${GTAG_INLINE}</script>` +
  `<script>${GTM_INLINE}</script>` +
  `<script src="${CHATBOT.src}" data-widget-key="${CHATBOT.widgetKey}" async></script>`;

/** For right after <body> opens (GTM without JavaScript). */
export const TRACKING_BODY = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
