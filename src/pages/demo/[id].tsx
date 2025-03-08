import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ErrorAlert from '@/components/error-alert';
import FrameEditor from '@/components/frame/frame-editor';
import FrameSelector from '@/components/frame/frame-selector';
import LoadingSpinner from '@/components/loading-spinner';
import { useDemoData } from '@/hooks/use-demo-data.hook';

const DemoPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    demoDetails,
    frames,
    selectedFrame,
    setSelectedFrame,
    handleSaveHtml,
    saveAllChanges,
    hasUnsavedChanges,
    loading,
    error,
  } = useDemoData(id);

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
          <p className="text-gray-600 mb-8">O conteúdo que você está procurando pode ter sido removido ou não existe.</p>
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

  const demoName = demoDetails.dados?.name || 'Demo sem nome';

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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Salvar todas alterações
            </button>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <FrameSelector 
            frames={frames} 
            selectedFrame={selectedFrame} 
            onSelect={setSelectedFrame} 
          />
          <FrameEditor 
            selectedFrame={selectedFrame} 
            onSave={handleSaveHtml} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default DemoPage;
