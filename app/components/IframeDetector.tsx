'use client';

import { useEffect, useState } from 'react';

interface IframeDetectorProps {
  children: React.ReactNode;
}

export default function IframeDetector({ children }: IframeDetectorProps) {
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Check if the app is running inside an iframe
    const checkIfInIframe = () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        // If we can't access window.top due to cross-origin restrictions,
        // we're probably in an iframe
        return true;
      }
    };

    setIsInIframe(checkIfInIframe());

    // Also listen for messages from parent window
    const handleMessage = (event: MessageEvent) => {
      // You can add custom message handling here if needed
      console.log('Received message from parent:', event.data);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Add iframe-specific styles
  useEffect(() => {
    if (isInIframe) {
      // Add a class to the body to indicate we're in an iframe
      document.body.classList.add('in-iframe');
      
      // Prevent the page from trying to break out of the iframe
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    } else {
      document.body.classList.remove('in-iframe');
    }
  }, [isInIframe]);

  return (
    <div className={`iframe-container ${isInIframe ? 'in-iframe' : 'standalone'}`}>
      {children}
      {isInIframe && (
        <style jsx global>{`
          .in-iframe {
            /* Ensure the app fits well in an iframe */
            margin: 0;
            padding: 0;
            height: 100vh;
            overflow: auto;
          }
          
          .iframe-container.in-iframe {
            height: 100vh;
            overflow: auto;
          }
          
          /* Hide elements that might not work well in iframe */
          .in-iframe .external-links {
            display: none;
          }
          
          /* Adjust any fixed positioning for iframe */
          .in-iframe .fixed-header {
            position: relative;
          }
        `}</style>
      )}
    </div>
  );
}
