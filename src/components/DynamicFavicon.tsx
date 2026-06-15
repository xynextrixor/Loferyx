import { useEffect } from 'react';

export function DynamicFavicon() {
  useEffect(() => {
    // Media query to detect if user is in dark mode
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');

    const updateFavicon = () => {
      const isDark = matcher.matches;
      // We are using /logo.svg for both modes currently.
      // If you create a logo-light.svg in /public, you can swap it here!
      const iconUrl = isDark ? '/logo.svg' : '/logo.svg'; 
      
      const links = document.querySelectorAll("link[rel~='icon']");
      links.forEach((el) => {
        const link = el as HTMLLinkElement;
        // Only update the primary SVG icon to prevent overriding all sizes
        if (link.type === 'image/svg+xml') {
          link.href = iconUrl;
        }
      });
    };

    updateFavicon(); // Run once on mount
    matcher.addEventListener('change', updateFavicon);
    return () => matcher.removeEventListener('change', updateFavicon);
  }, []);

  return null;
}
