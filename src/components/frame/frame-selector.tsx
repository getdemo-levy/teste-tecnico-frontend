import { FrameSelectorProps } from '@/interfaces/frame/frame-selector-props.interface';
import React, { useRef, useState, useEffect } from 'react';

const FrameSelector: React.FC<FrameSelectorProps> = ({ frames, selectedFrame, onSelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  
  const createThumbnailPreview = (html: string) => {

    return (
      <div className="h-full w-full bg-white overflow-hidden">
        <iframe
          srcDoc={html}
          className="w-full h-full border-0 overflow-hidden"
          title="Frame Renderer"
          sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
          loading="lazy"
          style={{
            pointerEvents: 'none',
            width: '500%',
            height: '500%',
            transform: 'scale(0.2)',
            transformOrigin: '0 0',
            overflow: 'hidden',
          }}
        />
      </div>
    );

  };

  useEffect(() => {
    const checkForOverflow = () => {
      if (scrollContainerRef.current) {
        const hasHorizontalOverflow = scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth;
        setHasOverflow(hasHorizontalOverflow);
      }
    };

    checkForOverflow();
    
    const timer = setTimeout(checkForOverflow, 100);
    
    window.addEventListener('resize', checkForOverflow);
    
    return () => {
      window.removeEventListener('resize', checkForOverflow);
      clearTimeout(timer);
    };
  }, [frames]);

  useEffect(() => {
    if (selectedFrame && scrollContainerRef.current) {
      try {
        const selectedElement = document.getElementById(`frame-${selectedFrame.id}`);
        if (selectedElement) {
          selectedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      } catch (error) {
        console.error("Erro ao tentar scroll:", error);
      }
    }
  }, [selectedFrame]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          {selectedFrame ? `Frame ${frames.findIndex(f => f.id === selectedFrame.id) + 1} selecionado` : 'Nenhum selecionado'}
        </h3>
        
        {hasOverflow && (
          <div className="flex space-x-2">
            <button 
              onClick={scrollLeft}
              className="rounded bg-white p-1 text-gray-500 shadow hover:bg-gray-100"
              aria-label="Scroll para esquerda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={scrollRight}
              className="rounded bg-white p-1 text-gray-500 shadow hover:bg-gray-100"
              aria-label="Scroll para direita"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex p-2 w-full space-x-3 overflow-x-auto"
        style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
      >
        {frames.map((frame, index) => {
          const isSelected = selectedFrame?.id === frame.id;
          
          return (
            <div 
              key={frame.id}
              id={`frame-${frame.id}`}
              onClick={() => onSelect(frame)}
              className={`relative flex-shrink-0 cursor-pointer ${
                isSelected ? 'z-10' : 'z-0'
              }`}
              style={{
                transition: 'transform 0.2s ease-in-out',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <div 
                className={`flex h-24 w-40 flex-col overflow-hidden rounded-lg border-2 bg-white shadow-sm ${
                  isSelected ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex h-5 items-center justify-between bg-gray-100 px-2 text-xs font-medium text-gray-700">
                  <span>Frame {index + 1}</span>
                  {frame.isModified && (
                    <span className="rounded bg-yellow-100 px-1 py-0.5 text-yellow-800 text-xs">
                      Modificado
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden p-1">
                  <div className="h-full w-full">
                    {createThumbnailPreview(frame.html)}
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute -bottom-1 left-1/2 h-2 w-6 -translate-x-1/2 transform rounded-t bg-blue-500"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FrameSelector;