'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track API routes or static assets
    if (pathname.startsWith('/api') || pathname.startsWith('/_next')) return;

    // Send ping to telemetry API
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname })
    }).catch(console.error); // Fail silently
  }, [pathname]);

  return null; // This component renders nothing on the screen
}
