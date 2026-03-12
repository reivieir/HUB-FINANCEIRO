import { useState } from "react";
import Sidebar from "./components/Sidebar";
import AssistenteIA from "./components/AssistenteIA";
import Bancos from "./components/Bancos";
import Conciliacao from "./components/Conciliacao";
function App() {
  const [pagina, setPagina] = useState("ia");
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
}
export default App;
