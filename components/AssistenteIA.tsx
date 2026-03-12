import { createDexcoChat } from "./services/geminiServices"; // Ajuste o caminho se necessário

// Dentro do seu componente:
const [mensagem, setMensagem] = useState("");
const [resposta, setResposta] = useState("");

const handleEnviar = async (e) => {
  e.preventDefault();
  console.log("Botão clicado! Enviando prompt:", mensagem); // Isso TEM que aparecer no F12

  try {
    const chat = await createDexcoChat();
    const result = await chat.sendMessage(mensagem);
    const texto = result.response.text();
    console.log("IA respondeu:", texto);
    setResposta(texto);
  } catch (error) {
    console.error("ERRO DETECTADO:", error); // Isso vai mostrar o erro real no F12
    alert("Erro: " + error.message);
  }
};
