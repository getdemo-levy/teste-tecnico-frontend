import React from 'react';

const SuccessNotification: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 max-w-md">
      <div className="flex items-center">
        <div className="py-1">
          <svg className="h-6 w-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <p className="font-medium">Frame salvo com sucesso!</p>
          <p>Lembre-se de clicar em &rdquo;Salvar todas alterações&rdquo; no topo da página quando terminar de editar todos os frames.</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;