
import React from 'react';
import { COLORS } from '../constants';

interface ListItemProps {
  index?: number;
  text: string;
  isActive: boolean;
  onClick: () => void;
  showIndex?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ index, text, isActive, onClick, showIndex = false }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        p-4 border-b border-[#2D2D2D] cursor-pointer transition-all duration-200 
        text-[13px] flex items-start gap-3
        ${isActive 
          ? 'bg-[#D4A373] text-black font-bold' 
          : 'text-gray-400 hover:bg-[#262626] hover:text-[#D4A373]'
        }
      `}
    >
      {showIndex && index !== undefined && (
        <span className={`${isActive ? 'text-black' : 'text-gray-600'} font-bold`}>
          {index + 1}.
        </span>
      )}
      <div className="flex-1 leading-tight">
        {text}
      </div>
    </div>
  );
};

export default ListItem;
