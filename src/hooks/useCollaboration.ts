import { useState, useEffect, useRef } from 'react';

export function useCollaboration(
  sessionId: string | null,
  editorInstance: any
) {
  const [collaboratorsCount, setCollaboratorsCount] = useState(1);
  const providerRef = useRef<any>(null);
  const bindingRef = useRef<any>(null);

  useEffect(() => {
    if (!sessionId || !editorInstance) return;

    let isMounted = true;
    let ydoc: any;
    let provider: any;
    let binding: any;

    async function setupYjs() {
      try {
        const Y = await import('yjs');
        const { WebsocketProvider } = await import('y-websocket');
        const { MonacoBinding } = await import('y-monaco');

        if (!isMounted) return;

        const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 
          (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host;

        ydoc = new Y.Doc();
        provider = new WebsocketProvider(wsUrl, sessionId!, ydoc);
        providerRef.current = provider;

        const type = ydoc.getText('monaco');

        binding = new MonacoBinding(
          type,
          editorInstance.getModel()!,
          new Set([editorInstance]),
          provider.awareness
        );
        bindingRef.current = binding;

        provider.awareness.on('change', () => {
          if (isMounted) {
            setCollaboratorsCount(provider.awareness.getStates().size);
          }
        });
      } catch (err) {
        console.error("Yjs setup error:", err);
      }
    }

    setupYjs();

    return () => {
      isMounted = false;
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.disconnect();
      }
      if (ydoc) {
        ydoc.destroy();
      }
    };
  }, [sessionId, editorInstance]);

  return { collaboratorsCount };
}
