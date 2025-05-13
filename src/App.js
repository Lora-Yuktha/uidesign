import React, { useState } from 'react';
// Change these imports
import HistorySidebar from './components/HistorySidebar/HistorySidebar';
import FileDropZone from './components/FileDropZone/FileDropZone';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [remodelOption, setRemodelOption] = useState('none');
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const remodelText = (text, option) => {
    switch(option) {
      case 'uppercase': return text.toUpperCase();
      case 'lowercase': return text.toLowerCase();
      case 'reverse': return text.split('').reverse().join('');
      case 'capitalize': return text.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      case 'spongebob': return text.split('').map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      ).join('');
      case 'removeSpaces': return text.replace(/\s+/g, '');
      default: return text;
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    setOutputText(remodelText(text, remodelOption));
  };

  const handleOptionChange = (e) => {
    const option = e.target.value;
    setRemodelOption(option);
    const remodeled = remodelText(inputText, option);
    setOutputText(remodeled);
    
    // Add to history
    if (inputText) {
      setHistory(prev => [
        {
          input: inputText,
          output: remodeled,
          remodelOption: option,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 9) // Keep only last 10 items
      ]);
    }
  };

  const handleFileRead = (content) => {
    setInputText(content);
    setOutputText(remodelText(content, remodelOption));
  };

  const handleSelectHistory = (item) => {
    setInputText(item.input);
    setOutputText(item.output);
    setRemodelOption(item.remodelOption);
  };

  return (
    <div className="app-container">
      <button 
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '◄' : '►'}
      </button>
      
      {sidebarOpen && (
        <HistorySidebar 
          history={history} 
          onSelectHistory={handleSelectHistory} 
        />
      )}

      <div className="main-content">
        <div className="panel input-panel">
          <h2>Input</h2>
          <FileDropZone onFileRead={handleFileRead} />
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Or type your text here..."
          />
          <div className="controls">
            <select value={remodelOption} onChange={handleOptionChange}>
              <option value="none">No Remodeling</option>
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="reverse">Reverse</option>
              <option value="capitalize">Capitalize Words</option>
              <option value="spongebob">SpOnGeBoB Case</option>
              <option value="removeSpaces">Remove Spaces</option>
            </select>
            <button 
              className="clear-btn"
              onClick={() => {
                setInputText('');
                setOutputText('');
              }}
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="panel output-panel">
          <h2>Output</h2>
          <div className="output-display">
            {outputText || <span className="placeholder">Your remodeled text will appear here</span>}
          </div>
          <div className="output-controls">
            <button 
              onClick={() => navigator.clipboard.writeText(outputText)}
              disabled={!outputText}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;