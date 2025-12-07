import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './StockAlerts.css';

const StockAlerts = () => {
  const { getStockAlerts } = useAuth();
  const alerts = getStockAlerts();
  const [dismissed, setDismissed] = useState(false);

  if (alerts.length === 0 || dismissed) {
    return null;
  }

  return (
    <div className="modern-alert-container">
      <div className="modern-alert">
        <div className="alert-header">
          <div className="alert-icon-modern">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div className="alert-title">
            <h4>Low Stock Alert</h4>
            <span className="alert-count">{alerts.length} item{alerts.length > 1 ? 's' : ''} need attention</span>
          </div>
          <button className="alert-dismiss" onClick={() => setDismissed(true)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="alert-medicines">
          {alerts.map(medicine => (
            <div key={medicine.id} className="medicine-alert-item">
              <div className="medicine-info">
                <span className="medicine-name">{medicine.name}</span>
                <span className="stock-level">{medicine.stock} units left</span>
              </div>
              <div className="urgency-indicator">
                {medicine.stock === 0 ? (
                  <span className="out-of-stock">Out of Stock</span>
                ) : medicine.stock < 5 ? (
                  <span className="critical">Critical</span>
                ) : (
                  <span className="low">Low</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockAlerts;

