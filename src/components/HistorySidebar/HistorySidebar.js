import React from 'react';
import './HistorySidebar.css';

const HistorySidebar = ({
  history,
  onSelectHistory,
  onClose,       // <-- function to close sidebar
}) => {
  return (
    <div className="history-sidebar">
      <div className="history-header">
        <h3>History</h3>
        <button
          onClick={onClose}
          className="close-button"
          title="Close Sidebar"
        >
          &times;
        </button>
      </div>

      <ul className="history-list">
        {history.length > 0 ? (
          history.map((item, index) => (
            <li key={index} onClick={() => onSelectHistory(item)}>
              <div className="history-item">
                <span className="history-text">
                  {item.input.length > 30
                    ? `${item.input.substring(0, 30)}...`
                    : item.input}
                </span>
                <span className="history-date">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                <span className="history-type">{item.remodelOption}</span>
              </div>
            </li>
          ))
        ) : (
          <div className="empty-history">No history found</div>
        )}
      </ul>
    </div>
  );
};

export default HistorySidebar;
