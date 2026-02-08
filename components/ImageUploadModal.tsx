
import React, { useState, useEffect, useCallback } from 'react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (base64Data: string) => void;
  isLoading: boolean;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onPaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) handleFile(blob);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('paste', onPaste);
    } else {
      window.removeEventListener('paste', onPaste);
      setPreview(null);
    }
    return () => window.removeEventListener('paste', onPaste);
  }, [isOpen, onPaste]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in border border-white/20">
        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black uppercase text-gray-800">Extrair Dados de Imagem</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Cole um print ou selecione um arquivo</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="p-8">
          {!preview ? (
            <div 
              className="border-4 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-gray-400 hover:border-[#D4A373] hover:bg-amber-50/30 transition-all cursor-pointer group"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <i className="fas fa-camera-retro text-6xl mb-4 group-hover:scale-110 transition-transform text-gray-200 group-hover:text-[#D4A373]"></i>
              <p className="font-black uppercase text-xs tracking-tighter">Pressione <span className="bg-gray-800 text-white px-2 py-1 rounded mx-1">CTRL + V</span> para colar o print</p>
              <p className="text-[10px] mt-2 opacity-60">OU CLIQUE PARA SELECIONAR ARQUIVO</p>
              <input 
                id="fileInput" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
              />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border-4 border-[#D4A373]/20 shadow-lg bg-gray-100">
              <img src={preview} alt="Preview" className="w-full max-h-[400px] object-contain mx-auto" />
              <button 
                onClick={() => setPreview(null)}
                className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <i className="fas fa-trash-can text-xs"></i>
              </button>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all uppercase text-xs tracking-widest"
            >
              Cancelar
            </button>
            <button 
              disabled={!preview || isLoading}
              onClick={() => preview && onConfirm(preview.split(',')[1])}
              className="flex-[2] px-6 py-4 bg-[#D4A373] text-black font-black rounded-2xl hover:bg-[#c39262] disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles"></i>
                  <span>Extrair Informações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
