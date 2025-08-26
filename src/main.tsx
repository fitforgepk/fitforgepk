import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Detect common in-app browsers (Instagram, Facebook) and prefetch critical images
function isInAppBrowser() {
	if (typeof navigator === 'undefined') return false;
	const ua = navigator.userAgent || '';
	// Instagram in-app webview includes "Instagram"; Facebook's webview includes FBAN/FBAV
	return /Instagram|FBAN|FBAV|FB_IAB/i.test(ua);
}

async function prefetchImages(urls: string[]) {
	try {
		// Fetch images to warm the browser's cache. Keep requests small and quick.
		await Promise.all(
			urls.map(async (u) => {
				try {
					const res = await fetch(u, { credentials: 'same-origin', cache: 'force-cache' });
					// consume the body to ensure it's cached; some browsers cache on successful fetch
					await res.blob();
				} catch (e) {
					// ignore individual failures
				}
			})
		);
	} catch (e) {
		// swallow
	}
}

if (isInAppBrowser()) {
	// List of small critical assets to prime for Instagram in-app browser
	const critical = [
		'https://ik.imagekit.io/sy6soezys/assets/FFlogo.png',
		'https://ik.imagekit.io/sy6soezys/assets/hero-main.jpg',
		'https://ik.imagekit.io/sy6soezys/assets/hero-product-mockup.png',
		'https://ik.imagekit.io/sy6soezys/assets/Front_page_models/Front_model1.png',
	];

	// Run prefetch in background but don't block rendering
	setTimeout(() => {
		void prefetchImages(critical);
	}, 250);
}

import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
