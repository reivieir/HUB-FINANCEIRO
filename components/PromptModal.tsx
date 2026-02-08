
import React, { useState } from 'react';

interface PromptModalProps {
  fields: string[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ fields, title, isOpen, onClose, onSubmit }) => {
  const [values, setValues] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-black uppercase text-gray-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map(field => (
            <div key={field}>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{field}</label>
              <input
                required
                type="text"
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A373] transition-all"
                placeholder={`Informe ${field.toLowerCase()}`}
                onChange={(e) => setValues(prev => ({ ...prev, [field]: e.target.value }))}
              />
            </div>
          ))}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors uppercase text-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 bg-[#D4A373] text-black font-bold rounded-lg hover:bg-[#c39262] transition-colors uppercase text-sm"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptModal;
