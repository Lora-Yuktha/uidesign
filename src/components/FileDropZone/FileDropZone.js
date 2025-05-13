import React, { useCallback, useState } from 'react';
import './FileDropZone.css';

const FileDropZone = ({ onFileRead }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        onFileRead(event.target.result);
      };
      reader.readAsText(file);
    }
  }, [onFileRead]);

  return (
    <div 
      className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragging ? (
        <div className="drop-message">Drop your file here</div>
      ) : (
        <div className="drop-message">Drag & drop a text file here, or click to browse</div>
      )}
      <input 
        type="file" 
        id="file-upload" 
        style={{ display: 'none' }} 
        onChange={(e) => {
          if (e.target.files.length) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
              onFileRead(event.target.result);
            };
            reader.readAsText(file);
          }
        }}
      />
      <button 
        className="browse-button"
        onClick={() => document.getElementById('file-upload').click()}
      >
        Browse Files
      </button>
    </div>
  );
};

export default FileDropZone;