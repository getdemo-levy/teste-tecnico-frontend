import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import FrameRenderer from '@/components/frame/frame-renderer';
import Layout from '@/components/Layout';

interface Frame {
  id: string;
  src: string;
}

interface DemoPageProps {
  demo: {
    id: string;
    title: string;
    frames: Frame[];
  };
}

const DemoPage: NextPage<DemoPageProps> = ({ demo }) => {
  const [selectedFrame, setSelectedFrame] = React.useState<Frame>(demo.frames[0]);

  return (
    <Layout title={demo.title}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">{demo.title}</h1>
        <div className="mt-4">
          <select
            onChange={(e) => {
              const frame = demo.frames.find(f => f.id === e.target.value);
              if (frame) setSelectedFrame(frame);
            }}
            className="border p-2"
          >
            {demo.frames.map(frame => (
              <option key={frame.id} value={frame.id}>
                Frame {frame.id}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <FrameRenderer src={selectedFrame.src} />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  
  // Exemplo de dados; aqui você faria a chamada para o backend
  const demo = {
    id,
    title: 'Demo Exemplo',
    frames: [
      { id: '1', src: 'https://example.com/frame1' },
      { id: '2', src: 'https://example.com/frame2' },
    ],
  };

  return {
    props: {
      demo,
    },
  };
};

export default DemoPage;
