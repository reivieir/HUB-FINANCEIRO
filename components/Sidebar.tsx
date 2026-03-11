import React from "react";

interface SidebarProps {
  setPagina: (pagina: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setPagina }) => {
  return (
    <div className="w-64 bg-[#1E1E1E] text-gray-300 h-screen p-6 flex flex-col gap-6">

      <div className="text-xl font-bold text-white">
        Finance Hub
      </div>

      <div className="text-xs text-gray-500 uppercase mt-6">
        Conhecimento
      </div>

      <button onClick={() => setPagina("ia")} className="text-left hover:text-white">
        Assistente IA
      </button>

      <button onClick={() => setPagina("conhecimento")} className="text-left hover:text-white">
        Base de Conhecimento
      </button>

      <div className="text-xs text-gray-500 uppercase mt-6">
        Operações
      </div>

      <button onClick={() => setPagina("bancos")} className="text-left hover:text-white">
        Gestão de Bancos
      </button>

      <button onClick={() => setPagina("conciliacao")} className="text-left hover:text-white">
        Conciliação Bancária
      </button>

      <button onClick={() => setPagina("caixa")} className="text-left hover:text-white">
        Gestão de Caixa
      </button>

      <button onClick={() => setPagina("protestos")} className="text-left hover:text-white">
        Gestão de Protestos
      </button>

    </div>
  );
};

export default Sidebar;
