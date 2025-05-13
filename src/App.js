import React, { useState, useEffect, useRef } from 'react';
import FileDropZone from './components/FileDropZone/FileDropZone';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [remodelOption, setRemodelOption] = useState('none');
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sidebarRef = useRef();

  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        if (isMobile) setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  const remodelText = (text, option) => {
    switch (option) {
      case 'uppercase': return text.toUpperCase();
      case 'lowercase': return text.toLowerCase();
      case 'reverse': return text.split('').reverse().join('');
      case 'capitalize':
        return text.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      case 'spongebob':
        return text.split('').map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
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

    if (inputText) {
      setHistory(prev => [
        {
          input: inputText,
          output: remodeled,
          remodelOption: option,
          timestamp: new Date().toISOString()
        },
        ...prev.slice(0, 9)
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
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      {/* NAVBAR TOGGLE ICON ONLY */}
      <div className="navbar black-navbar">
        <button
          className="sidebar-toggle-icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close history' : 'Open history'}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        ref={sidebarRef}
        className={`history-sidebar ${sidebarOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}
      >
        <h3>History</h3>
        {history.length > 0 ? (
          <ul>
            {history.map((item, index) => (
              <li key={index} onClick={() => handleSelectHistory(item)}>
                <div className="history-item">
                  <span className="history-text">
                    {item.input.substring(0, 30)}
                    {item.input.length > 30 ? '...' : ''}
                  </span>
                  <span className="history-date">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                  <span className="history-type">
                    {item.remodelOption}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-history">No history yet</p>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className={`main-content ${sidebarOpen && !isMobile ? 'with-sidebar' : ''}`}>
        <div className="panel input-panel">
          <h2>Input</h2>
          <FileDropZone onFileRead={handleFileRead} />
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type or drop your text here..."
          />
          <div className="controls">
            <select
              value={remodelOption}
              onChange={handleOptionChange}
            >
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
