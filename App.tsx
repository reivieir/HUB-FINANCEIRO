import { useState } from "react";
// Importe seus componentes normalmente quando a página em branco for resolvida
// import Sidebar from "./components/Sidebar";
// import AssistenteIA from "./components/AssistenteIA";
// import Bancos from "./components/Bancos";
// import Conciliacao from "./components/Conciliacao";

function App() {
  const [pagina, setPagina] = useState("ia");

  // Versão simplificada para teste de renderização
  return (
    <div className="flex" style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Olá! Se você está vendo isso, o App.tsx está funcionando!</h1>
      <p>Página atual: {pagina}</p>
    </div>
  );

  /*
  // Sua lógica original (descomente quando o teste acima funcionar)
  const renderPagina = () => {
    switch (pagina) {
      case "bancos":
        return <Bancos />;
      case "conciliacao":
        return <Conciliacao />;
      case "ia":
      default:
        return <AssistenteIA />;
    }
  };

  return (
    <div className="flex">
      <Sidebar setPagina={setPagina} />
      <div className="flex-1 bg-[#121212] text-white min-h-screen">
        {renderPagina()}
      </div>
    </div>
  );
  */
}

export default App;
