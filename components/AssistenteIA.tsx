import React from 'react';

interface AssistenteIAProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  respostaIA: string;
  loading: boolean;
  handleEnviar: (e: React.FormEvent) => void;
}

const AssistenteIA: React.FC<AssistenteIAProps> = ({
  prompt,
  setPrompt,
  respostaIA,
  loading,
  handleEnviar,
}) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Assistente Financeiro IA</h1>
      <div className="mb-4 p-4 bg-gray-800 rounded-lg">
        <p>{respostaIA}</p>
      </div>
      <form onSubmit={handleEnviar} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Digite sua pergunta..."
          className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
          disabled={loading}
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

export default AssistenteIA;
