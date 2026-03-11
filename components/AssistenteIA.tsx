import { useState } from "react";
import { createDexcoChat } from "../services/geminiService";

export default function AssistenteIA() {

  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarPergunta = async () => {

    if (!pergunta.trim()) return;

    setLoading(true);
    setResposta("");

    try {

      const chat = createDexcoChat();

      const result = await chat.sendMessage(pergunta);

      const text = await result.response.text();

      setResposta(text);

    } catch (erro) {

      console.error(erro);

      setResposta("Erro ao consultar a IA.");

    }

    setLoading(false);

  };

  return (
    <div className="p-8 flex flex-col gap-4">

      <h1 className="text-2xl font-bold">
        Assistente Financeiro IA
      </h1>

      <textarea
        className="bg-[#1E1E1E] p-4 rounded-lg text-white min-h-[120px]"
        placeholder="Digite sua pergunta..."
        value={pergunta}
        onChange={(e) => setPergunta(e.target.value)}
      />

      <button
        onClick={enviarPergunta}
        className="bg-[#D4A373] text-black px-6 py-2 rounded-lg font-bold w-fit"
      >
        Perguntar
      </button>

      {loading && (
        <p className="text-gray-400">
          Consultando IA...
        </p>
      )}

      {resposta && (
        <div className="bg-[#1E1E1E] p-4 rounded-lg whitespace-pre-wrap">
          {resposta}
        </div>
      )}

    </div>
  );
}
