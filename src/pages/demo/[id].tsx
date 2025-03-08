import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '@/components/Layout';
import ErrorAlert from '@/components/error-alert';
import FrameEditor from '@/components/frame/frame-editor';
import FrameSelector from '@/components/frame/frame-selector';
import LoadingSpinner from '@/components/loading-spinner';
import { AppDispatch, RootState } from '@/store';
import { fetchDemoData, setSelectedFrame, saveHtmlAction } from '@/store/demo.slice';
import { updateFrame } from '@/store/demo.slice';

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

  const handleSaveHtml = (newHtml: string) => {
    dispatch(saveHtmlAction(newHtml));
  };

  const handleCancelEdit = (options = {}) => {
    // If we need to do anything when editing is canceled,
    // we can handle it here. For now, we're just ensuring
    // we don't reset the selected frame unless needed.
    console.log("Edit canceled with options:", options);
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
      <div className="max-w-6xl mx-auto">
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <FrameSelector 
            frames={frames} 
            selectedFrame={selectedFrame} 
            onSelect={(frame) => dispatch(setSelectedFrame(frame))}
          />
          <FrameEditor 
            selectedFrame={selectedFrame} 
            onSave={handleSaveHtml}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    </Layout>
  );
};

export default DemoPage;