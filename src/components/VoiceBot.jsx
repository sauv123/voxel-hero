import React, { useEffect, useRef } from 'react';

export default function VoiceBot({ theme }) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current || document.getElementById('dograh-widget')) return;
    
    scriptLoaded.current = true;
    
    // Create the Dograh script
    const script = document.createElement('script');
    script.id = 'dograh-widget';
    script.src = 'https://app.dograh.com/embed/dograh-widget.js?token=emb_mtEDsaP5o9nKNVIB97noya-GEKe0Gu2wBSeXgOIWzHo&environment=production&apiEndpoint=https://api.dograh.com';
    script.async = true;
    
    // Append it
    document.body.appendChild(script);

    return () => {
      // Optional cleanup if we want the widget to disappear when leaving Playground
      // Note: Some third-party widgets don't clean up well, but we can try removing the script
      const existingScript = document.getElementById('dograh-widget');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Attempt to remove any DOM nodes the widget might have injected (often an iframe or a specific div ID)
      // Since we don't know the exact ID of the injected container, we'll leave it globally active 
      // or try to find common generic IDs if needed.
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      maxWidth: 400,
      backgroundColor: '#111',
      border: `1px solid ${theme?.text || '#fff'}`,
      borderRadius: 16,
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      textAlign: 'center'
    }}>
      <h3 style={{ 
        fontFamily: 'var(--font-heading)', 
        color: theme?.text || '#fff',
        margin: 0,
        fontSize: '1.5rem',
        textTransform: 'uppercase'
      }}>
        Dograh Voice Agent
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        color: theme?.text || '#fff',
        opacity: 0.7,
        fontSize: '0.9rem',
        margin: 0
      }}>
        The official Dograh Voice Widget has been loaded into the page. 
        <br/><br/>
        Check your screen (usually the bottom right corner) for the widget button to start the call!
      </p>
    </div>
  );
}
