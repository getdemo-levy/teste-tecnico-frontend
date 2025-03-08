import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import FrameRenderer from '@/components/frame/frame-renderer';
import Layout from '@/components/Layout';
import { useFetch } from '@/hooks/use-fetch.hook';
import { ResponseApi } from '@/interfaces/response-api.interface';
import { Frame } from '@/interfaces/frame.interface';
import { Demo } from '@/interfaces/demo.interface';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const DemoPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: demoDetails, loading: loadingDetails, error: errorDetails } = 
    useFetch<ResponseApi<Demo>>(id ? `${apiUrl}/demos/${id}` : '');

  const { data: demo, loading, error } = 
    useFetch<ResponseApi<Frame[]>>(id ? `${apiUrl}/demos/${id}/frames` : '');

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFrameHtml, setEditedFrameHtml] = useState<string | null>(null);

  useEffect(() => {
    if (demo?.dados?.length) {
      const sortedFrames = demo.dados.toSorted((a, b) => a.order - b.order);
      setSelectedFrame(sortedFrames[0]);
    }
  }, [demo]);

  const handleSave = (html: string) => {
    if (selectedFrame) {
      setEditedFrameHtml(html);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedFrameHtml(null);
    setIsEditing(false);
  };

  if (loading || loadingDetails) {
    return (
      <Layout title="Carregando...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 mb-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Carregando demo...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || errorDetails) {
    return (
      <Layout title="Erro">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md my-6">
          <div className="flex items-center">
            <div className="text-red-500 text-2xl mr-4">⚠️</div>
            <div>
              <p className="font-medium text-red-800">Ocorreu um erro</p>
              <p className="text-red-700">{error || errorDetails || 'Não foi possível carregar a demo'}</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Voltar para a lista de demos
          </button>
        </div>
      </Layout>
    );
  }

  const sortedFrames = demo?.dados?.toSorted((a, b) => a.order - b.order) || [];
  const demoName = demoDetails?.dados?.name || 'Demo sem nome';

  return (
    <Layout title={demoName}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <button
            onClick={() => router.push('/')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="mx-2">›</span>
          <span className="font-medium text-gray-700">{demoName}</span>
        </div>

        {demo && demo.dados?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 p-4 bg-gray-50">
              <label htmlFor="frame-select" className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o frame:
              </label>
              <div className="relative">
                <select
                  id="frame-select"
                  onChange={(e) => {
                    const frame = demo?.dados.find((f) => f.id === e.target.value);
                    if (frame) setSelectedFrame(frame);
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm appearance-none"
                  value={selectedFrame?.id}
                >
                  {sortedFrames.map((frame, index) => (
                    <option key={frame.id} value={frame.id}>
                      Frame {index + 1} {frame.id && `- ${frame.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4">
              {selectedFrame && (
                <div className="border border-gray-200 rounded-md w-full">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
                    <div className="flex space-x-1 mr-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {selectedFrame.id || `Frame ${sortedFrames.indexOf(selectedFrame) + 1}`}
                    </p>
                  </div>
                  <div className="w-full">
                    <FrameRenderer 
                      html={selectedFrame.html} 
                      onSave={handleSave} 
                      onCancel={handleCancel} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DemoPage;
