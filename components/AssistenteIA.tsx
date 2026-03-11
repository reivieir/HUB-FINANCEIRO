import { useState } from "react";
import { perguntarIA } from "../services/geminiService";

export default function AssistenteIA() {

  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarPergunta = async () => {
    if (!pergunta) return;

    setLoading(true);

    try {
      const resp = await perguntarIA(pergunta);
      setResposta(resp);
    } catch (erro) {
      setResposta("Erro ao consultar IA.");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 flex flex-col gap-4">

      <h1 className="text-2xl font-bold">
        Assistente Financeiro IA
      </h1>

      <textarea
        className="bg-[#1E1E1E] p-4 rounded-lg text-white"
        placeholder="Digite sua pergunta..."
        value={pergunta}
        onChange={(e) => setPergunta(e.target.value)}
      />

      <button
        onClick={enviarPergunta}
        className="bg-[#D4A373] text-black px-6 py-2 rounded-lg font-bold"
      >
        Perguntar
      </button>

      {loading && <p>Consultando IA...</p>}

      {resposta && (
        <div className="bg-[#1E1E1E] p-4 rounded-lg">
          {resposta}
        </div>
      )}

    </div>
  );
}
