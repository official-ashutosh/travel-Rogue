import React from 'react';
import { Button } from '../ui/Button.jsx';
import { Trash2, Plus } from 'lucide-react';

const EditList = ({ items = [], onSave, isEditing, setIsEditing, placeholder = 'Add item...' }) => {
  const [list, setList] = React.useState(items);

  React.useEffect(() => {
    setList(items);
  }, [items]);

  const addItem = () => {
    setList([...list, '']);
  };

  const updateItem = (index, value) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const removeItem = (index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const filteredList = list.filter(item => item.trim() !== '');
    onSave(filteredList);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setList(items);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="group">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-700 dark:text-gray-300">{item}</span>
            </div>
          ))}
        </div>
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
      {list.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
          <Button
            onClick={() => removeItem(index)}
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button
        onClick={addItem}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
      <div className="flex gap-2 mt-4">
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

export default EditList;
