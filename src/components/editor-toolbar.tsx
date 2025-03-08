import React from 'react';

interface EditorToolbarProps {
  onSave: () => void;
  onCancel: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onSave, onCancel }) => {
  return (
    <div className="absolute bottom-2 right-2 flex space-x-2">
      <button
        onClick={onSave}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Salvar
      </button>
      <button
        onClick={onCancel}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
      >
        Cancelar
      </button>
    </div>
  );
};

export default EditorToolbar;
