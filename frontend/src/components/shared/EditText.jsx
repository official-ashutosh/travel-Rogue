import React from 'react';
import { Button } from '../ui/Button.jsx';

const EditText = ({ value, onSave, isEditing, setIsEditing, placeholder = 'Enter text...' }) => {
  const [text, setText] = React.useState(value || '');

  React.useEffect(() => {
    setText(value || '');
  }, [value]);

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(value || '');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="group">
        <p className="text-gray-700 dark:text-gray-300">{value || placeholder}</p>
        <Button
          onClick={() => setIsEditing(true)}
          className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
          variant="outline"
          size="sm"
        >
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        rows={4}
      />
      <div className="flex gap-2">
        <Button onClick={handleSave} variant="default" size="sm">
          Save
        </Button>
        <Button onClick={handleCancel} variant="outline" size="sm">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditText;
