import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

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
    let hasShownSuccess = false;

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

        provider.on('status', (event: any) => {
          if (event.status === 'connected' && !hasShownSuccess) {
            hasShownSuccess = true;
            toast.success(`Successfully connected to session: ${sessionId!.substring(0, 8)}...`);
          } else if (event.status === 'disconnected') {
            hasShownSuccess = false; // Reset if they want to reconnect
          }
        });

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

        let previousCount = provider.awareness.getStates().size || 1;
        provider.awareness.on('change', () => {
          if (isMounted) {
            const currentCount = provider.awareness.getStates().size;
            if (hasShownSuccess) {
              if (currentCount > previousCount) {
                toast.info('A collaborator joined the session');
              } else if (currentCount < previousCount) {
                toast.info('A collaborator left the session');
              }
            }
            previousCount = currentCount;
            setCollaboratorsCount(currentCount);
          }
        });
      } catch (err) {
        console.error("Yjs setup error:", err);
        toast.error("Failed to connect to collaboration server");
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
