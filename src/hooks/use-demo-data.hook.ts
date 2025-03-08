import { useState, useEffect } from 'react';
import { useFetch } from '@/hooks/use-fetch.hook';
import { ResponseApi } from '@/interfaces/response-api.interface';
import { Frame } from '@/interfaces/frame.interface';
import { Demo } from '@/interfaces/demo.interface';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useDemoData = (id: string | string[] | undefined) => {
  const { data: demoDetails, loading: loadingDetails, error: errorDetails } =
    useFetch<ResponseApi<Demo>>(id ? `${apiUrl}/demos/${id}` : '');

  const { data: demo, loading: loadingFrames, error: errorFrames } =
    useFetch<ResponseApi<Frame[]>>(id ? `${apiUrl}/demos/${id}/frames` : '');

  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (demo?.dados?.length) {
      const sortedFrames = [...demo.dados].sort((a, b) => a.order - b.order);
      setFrames(sortedFrames);
      setSelectedFrame(sortedFrames[0]);
    }
  }, [demo]);

  const handleSaveHtml = (newHtml: string) => {
    if (!selectedFrame) return;
    const updatedFrame: Frame = { ...selectedFrame, html: newHtml };
    const updatedFrames = frames.map(frame =>
      frame.id === selectedFrame.id ? updatedFrame : frame
    );
    setFrames(updatedFrames);
    setSelectedFrame(updatedFrame);
    setHasUnsavedChanges(true);
  };

  const saveFrameToServer = async (frame: Frame) => {
    try {
      const response = await fetch(`${apiUrl}/demos/${id}/frames/${frame.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(frame),
      });
      if (!response.ok) {
        throw new Error('Falha ao salvar alterações');
      }
      setHasUnsavedChanges(false);
      console.log('Frame salvo com sucesso');
    } catch (error) {
      console.error('Erro ao salvar frame:', error);
    }
  };

  const saveAllChanges = () => {
    if (hasUnsavedChanges && selectedFrame) {
      saveFrameToServer(selectedFrame);
    }
  };

  const loading = loadingDetails || loadingFrames;
  const error = errorDetails || errorFrames;

  return {
    demoDetails,
    frames,
    selectedFrame,
    setSelectedFrame,
    handleSaveHtml,
    saveAllChanges,
    hasUnsavedChanges,
    loading,
    error,
  };
};
