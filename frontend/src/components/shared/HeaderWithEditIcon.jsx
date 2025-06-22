import React from 'react';
import { PencilIcon } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

const HeaderWithEditIcon = ({ title, onEdit, allowEdit = true, className = '' }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      {allowEdit && (
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          <PencilIcon className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default HeaderWithEditIcon;
