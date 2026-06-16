import { useState, useEffect, useRef } from 'react';

export function useCollaboration(
  sessionId: string | null,
  editorInstance: any,
  isHost: boolean = false
) {
  const [collaboratorsCount, setCollaboratorsCount] = useState(1);
  const [providerInstance, setProviderInstance] = useState<any>(null);
  const [ydocInstance, setYdocInstance] = useState<any>(null);

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

        if (isMounted) {
          setYdocInstance(ydoc);
          setProviderInstance(provider);
        }

        const type = ydoc.getText('monaco');

        provider.on('sync', (isSynced: boolean) => {
          if (isSynced && isHost && type.length === 0) {
            type.insert(0, editorInstance.getValue());
          }
        });

        binding = new MonacoBinding(
          type,
          editorInstance.getModel()!,
          new Set([editorInstance]),
          provider.awareness
        );

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
      if (binding) binding.destroy();
      if (provider) provider.disconnect();
      if (ydoc) ydoc.destroy();
      setYdocInstance(null);
      setProviderInstance(null);
    };
  }, [sessionId, editorInstance]);

  return { collaboratorsCount, provider: providerInstance, ydoc: ydocInstance };
}
