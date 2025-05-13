import React from 'react';
import './HistorySidebar.css';

const HistorySidebar = ({ history, onSelectHistory }) => {
  return (
    <div className="history-sidebar">
      <h3>History</h3>
      <ul>
        {history.map((item, index) => (
          <li key={index} onClick={() => onSelectHistory(item)}>
            <div className="history-item">
              <span className="history-text">{item.input.substring(0, 30)}{item.input.length > 30 ? '...' : ''}</span>
              <span className="history-date">{new Date(item.timestamp).toLocaleString()}</span>
              <span className="history-type">{item.remodelOption}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistorySidebar;