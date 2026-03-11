import { useState } from "react";
import { createDexcoChat } from "../services/geminiService";

interface Mensagem {
  autor: "user" | "ia";
  texto: string;
}

export default function AssistenteIA() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [pergunta, setPergunta] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarPergunta = async () => {
    if (!pergunta.trim()) return;

    const novaPergunta = pergunta;
    setPergunta("");
    setMensagens((prev) => [...prev, { autor: "user", texto: novaPergunta }]);
    setLoading(true);

    try {
      const chat = createDexcoChat();
      const result = await chat.sendMessage(novaPergunta);
      const respostaIA = await result.response.text();
      setMensagens((prev) => [...prev, { autor: "ia", texto: respostaIA }]);
    } catch (erro) {
      setMensagens((prev) => [...prev, { autor: "ia", texto: "Erro ao consultar IA." }]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      <div className="p-6 border-b border-[#2D2D2D] text-xl font-bold text-white">
        Assistente Financeiro IA
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {mensagens.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] p-4 rounded-lg ${
              msg.autor === "user"
                ? "bg-[#D4A373] text-black self-end"
                : "bg-[#1E1E1E] text-white self-start"
            }`}
          >
            {msg.texto}
          </div>
        ))}

        {loading && (
          <div className="bg-[#1E1E1E] p-4 rounded-lg w-fit text-white">
            IA está pensando...
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#2D2D2D] flex gap-3">
        <input
          className="flex-1 bg-[#1E1E1E] p-3 rounded-lg text-white"
          placeholder="Digite sua pergunta..."
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") enviarPergunta();
          }}
        />
        <button
          onClick={enviarPergunta}
          className="bg-[#D4A373] text-black px-6 rounded-lg font-bold"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
