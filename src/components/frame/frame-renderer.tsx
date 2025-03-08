import React, { useCallback, useEffect, useRef, useState } from 'react';

interface FrameRendererProps {
  html: string;
  onSave: (html: string) => void; // Função para salvar as edições
  onCancel: () => void; // Função para cancelar as edições
}

const FrameRenderer: React.FC<FrameRendererProps> = ({ html, onSave, onCancel }) => {
  const [editedHtml, setEditedHtml] = useState(html);
  const [originalHtml, setOriginalHtml] = useState(html); // Armazena o HTML original
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = useCallback((event: MouseEvent) => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

    const target = event.target as HTMLElement;
    
    // Verifica se o elemento é editável
    const editableElements = ['P', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'LI'];
    if (editableElements.includes(target.tagName)) {
      target.contentEditable = 'true';
      target.style.outline = '2px solid #3B82F6';
      target.style.minHeight = '1em';
      setIsEditing(true);
      
      target.addEventListener('blur', () => {
        target.contentEditable = 'false';
        target.style.outline = '';
        setIsEditing(false);
        setEditedHtml(iframeDoc.documentElement.outerHTML); // Salva as edições no HTML
      });
    }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const loadHandler = () => {
      iframe.contentDocument?.addEventListener('dblclick', handleDoubleClick);
    };

    iframe.addEventListener('load', loadHandler);
    return () => {
      iframe.removeEventListener('load', loadHandler);
      iframe.contentDocument?.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [handleDoubleClick]);

  const handleCancel = () => {
    // Restaura o conteúdo original e força o iframe a recarregar
    setEditedHtml(originalHtml);
    setIsEditing(false);
    onCancel(); // Chama o callback para informar o cancelamento
  };

  // Forçar a re-renderização do iframe quando o conteúdo é cancelado
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.srcdoc = editedHtml; // Atualiza diretamente o conteúdo do iframe
    }
  }, [editedHtml]);

  return (
    <div className="relative">
      <iframe
        ref={iframeRef}
        srcDoc={editedHtml}
        className={`w-full h-96 border-0 ${isEditing ? 'cursor-text' : ''}`}
        title="Frame Renderer"
        sandbox="allow-same-origin allow-scripts"
        loading="lazy"
      />
      
      {isEditing && (
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <button
            onClick={() => onSave(editedHtml)} // Salva as edições
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Salvar
          </button>
          <button
            onClick={handleCancel} // Cancela as edições e restaura o conteúdo original
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default FrameRenderer;
