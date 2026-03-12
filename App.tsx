import { useState } from "react";
// Remova as importações dos outros componentes temporariamente para testar
// import Sidebar from "./components/Sidebar";
// import AssistenteIA from "./components/AssistenteIA";
// import Bancos from "./components/Bancos";
// import Conciliacao from "./components/Conciliacao";

function App() {
  const [pagina, setPagina] = useState("ia");

  // Remova o renderPagina e retorne um texto simples
  return (
    <div className="flex" style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Olá! Se você está vendo isso, o App.tsx está funcionando!</h1>
      <p>Página atual: {pagina}</p>
    </div>
  );
}

export default App;
