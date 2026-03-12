import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Bancos from "./components/Bancos";
import Conciliacao from "./components/Conciliacao";
import AssistenteIA from "./components/AssistenteIA"; // Mantenha a importação do AssistenteIA

// Importe createDexcoChat do seu arquivo de serviços
import { createDexcoChat } from "./services/geminiServices"; // Ajuste o caminho se necessário

function App() {
  const [pagina, setPagina] = useState("ia");
  const [prompt, setPrompt] = useState("");
  const [respostaIA, setRespostaIA] = useState("Aguardando sua pergunta...");
  const [loading, setLoading] = useState(false);

  const handleEnviar = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (!prompt.trim()) return; // Não envia prompt vazio

    setLoading(true);
    setRespostaIA("Consultando a IA...");
    console.log("Enviando prompt para a IA:", prompt);

    try {
      const chat = await createDexcoChat();
      const result = await chat.sendMessage(prompt);
      const texto = result.response.text();
      console.log("IA respondeu:", texto);
      setRespostaIA(texto);
    } catch (error: any) {
      console.error("ERRO DETECTADO na consulta à IA:", error);
      setRespostaIA("Erro ao consultar a IA: " + error.message);
    } finally {
      setLoading(false);
      setPrompt(""); // Limpa o input após o envio
    }
  };

  const renderPagina = () => {
    switch (pagina) {
      case "bancos":
        return <Bancos />;
      case "conciliacao":
        return <Conciliacao />;
      case "ia":
      default:
        // Renderiza o AssistenteIA e passa as props necessárias
        return (
          <AssistenteIA
            prompt={prompt}
            setPrompt={setPrompt}
            respostaIA={respostaIA}
            loading={loading}
            handleEnviar={handleEnviar}
          />
        );
    }
  };

  return (
    <div className="flex">
      <Sidebar setPagina={setPagina} />
      <div className="flex-1 bg-[#121212] text-white min-h-screen p-4">
        {renderPagina()}
      </div>
    </div>
  );
}

export default App;
