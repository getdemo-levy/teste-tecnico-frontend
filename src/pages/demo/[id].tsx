import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '@/components/Layout';
import ErrorAlert from '@/components/error-alert';
import FramePreview from '@/components/frame/frame-preview';
import FrameSelector from '@/components/frame/frame-selector';
import LoadingSpinner from '@/components/loading-spinner';
import { FullscreenModal } from '@/components/frame/fullscreen-modal/fullscreen-modal';
import { AppDispatch, RootState } from '@/store';
import { fetchDemoData, setSelectedFrame } from '@/store/demo.slice';
import { updateFrame } from '@/store/demo.slice';
import { resetFrame, setFullscreen } from '@/store/iframe-editing.slice';

const DemoPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const { 
    demoDetails, 
    frames, 
    selectedFrame, 
    hasUnsavedChanges, 
    loading, 
    error, 
    saving 
  } = useSelector((state: RootState) => state.demo);

  useEffect(() => {
    if (typeof id === 'string') {
      dispatch(fetchDemoData(id));
    }
  }, [id, dispatch]);

  const handleSaveHtml = async (newHtml: string) => {
    if (!demoDetails || !selectedFrame) return;
    
    try {
      await dispatch(updateFrame({
        id_demo: demoDetails.id,
        id_frame: selectedFrame.id,
        html: newHtml
      })).unwrap();
      
      dispatch(resetFrame());
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleCancelEdit = () => {
    dispatch(resetFrame());
  };

  const saveAllChanges = () => {
    if (!demoDetails) return;
    
    const modifiedFrames = frames.filter(frame => frame.isModified);
    
    modifiedFrames.forEach(frame => {
      dispatch(updateFrame({
        id_demo: demoDetails.id,
        id_frame: frame.id,
        html: frame.html
      }));
    });
  };

  if (loading) {
    return (
      <Layout title="Carregando...">
        <LoadingSpinner message="Carregando demo..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Erro">
        <ErrorAlert message={error} onBack={() => router.push('/')} />
      </Layout>
    );
  }

  if (!demoDetails || frames.length === 0) {
    return (
      <Layout title="Demo não encontrada">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Demo não encontrada</h2>
          <p className="text-gray-600 mb-8">
            O conteúdo que você está procurando pode ter sido removido ou não existe.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
          >
            Voltar para a página inicial
          </button>
        </div>
      </Layout>
    );
  }

  const demoName = demoDetails.name || 'Demo sem nome';

  return (
    <Layout title={demoName}>
    <FullscreenModal 
      selectedFrame={selectedFrame}
      onSave={handleSaveHtml}
      onCancel={handleCancelEdit}
      frames={frames}
      onSelectFrame={(index) => dispatch(setSelectedFrame(frames[index]))}
    />

      <div className="max-w-8xl mx-auto py-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <button 
              onClick={() => router.push('/')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="mx-2">›</span>
            <span className="font-medium text-gray-700">{demoName}</span>
          </div>
          {hasUnsavedChanges && (
            <button
              onClick={saveAllChanges}
              disabled={saving > 0}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors
                ${saving > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving > 0 ? 'Salvando...' : 'Salvar todas alterações'}
            </button>
          )}
        </div>
        
        {saving > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <LoadingSpinner message="Salvando alterações..." />
            </div>
          </div>
        )}

        <div className="flex gap-10 p-1">
          <div className='w-[30%] flex flex-col justify-center align-middle gap-4'>
            <span className='text-3xl'>Frame: </span>
            <span className='text-3xl font-bold'>{selectedFrame?.id}</span>
            <div className="flex justify-start space-x-2 mt-2">
              <button
                onClick={() => dispatch(setFullscreen(true))}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Visualizar Fullscreen
              </button>
            </div>
            <div className="mt-3 p-2 bg-blue-50 text-sm text-black-700 rounded border border-blue-200">
              <strong>Dica:</strong> Clique em <strong className="text-blue-700">&rdquo;Visualizar Fullscreen&rdquo;</strong> para editar o conteúdo do Frame.
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex-col w-[70%]">
            <FramePreview 
              selectedFrame={selectedFrame} 
              onSave={handleSaveHtml}
              onCancel={handleCancelEdit}
            />
            <FrameSelector 
              frames={frames} 
              selectedFrame={selectedFrame}
              onSelect={(frame) => dispatch(setSelectedFrame(frame))}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DemoPage;
