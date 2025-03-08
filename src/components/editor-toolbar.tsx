import { EditorToolbarProps } from '@/interfaces/editor-toolbar-props.interface';
import React from 'react';

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onSave, onCancel }) => {
  return (
    <div className="flex justify-end space-x-2 mt-2">
      <button 
        onClick={onSave} 
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        title="Salva apenas as alterações deste frame. Lembre-se de clicar em 'Salvar todas alterações' após concluir todas as edições."
      >
        Salvar
      </button>
      <button 
        onClick={onCancel} 
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        title="Cancela as alterações deste frame."
      >
        Cancelar
      </button>
    </div>
  );
};

export default EditorToolbar;
