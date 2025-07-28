import React, { useState } from 'react';
import { Play, Save, MessageCircle, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';

const SaveModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), description.trim());
      onClose();
      setName('');
      setDescription('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <h3 className="text-lg font-semibold mb-4">Save Workflow</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workflow Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter workflow name"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
            placeholder="Enter workflow description"
          />
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ 
  onValidate, 
  onSave, 
  onChat, 
  isValidating, 
  validationResult, 
  nodeCount, 
  edgeCount 
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);

  const getValidationIcon = () => {
    if (isValidating) {
      return <Loader className="w-4 h-4 animate-spin" />;
    }
    if (!validationResult) {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
    if (validationResult.valid) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getValidationText = () => {
    if (isValidating) return 'Validating...';
    if (!validationResult) return 'Not validated';
    if (validationResult.valid) return 'Valid workflow';
    return 'Invalid workflow';
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Workflow Builder</h1>
              <p className="text-sm text-gray-600">Create intelligent workflows with drag & drop components</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{nodeCount} components</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{edgeCount} connections</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
              {getValidationIcon()}
              <span className="text-sm font-medium">{getValidationText()}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onValidate}
                disabled={isValidating || nodeCount === 0}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4" />
                {isValidating ? 'Validating...' : 'Build Stack'}
              </button>

              <button
                onClick={() => setShowSaveModal(true)}
                disabled={nodeCount === 0}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>

              <button
                onClick={onChat}
                disabled={!validationResult?.valid}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Stack
              </button>
            </div>
          </div>
        </div>
      </header>

      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={onSave}
      />
    </>
  );
};

export default Header;