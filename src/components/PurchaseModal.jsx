import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './PurchaseModal.css';

const PurchaseModal = ({ medicine, onClose }) => {
  const { setMedicines, setOrders, fetchMedicines } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    quantity: 1,
    prescription: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'prescription' && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          prescription: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.quantity > medicine.stock) {
      alert(`Only ${medicine.stock} items available in stock.`);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineId: medicine.id,
          medicineName: medicine.name,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          quantity: parseInt(formData.quantity),
          totalPrice: medicine.price * formData.quantity,
          prescription: formData.prescription
        })
      });

      if (response.ok) {
        fetchMedicines();
        setSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.message || 'Purchase failed');
      }
    } catch (error) {
      console.error('Backend not available, using fallback:', error);
      // Fallback to local state if backend is not available
      const order = {
        id: Date.now(),
        medicineId: medicine.id,
        medicineName: medicine.name,
        quantity: parseInt(formData.quantity),
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        totalPrice: (medicine.price * formData.quantity).toFixed(2),
        status: 'pending',
        prescription: formData.prescription
      };
      
      setOrders(prev => [...prev, order]);
      setMedicines(prev =>
        prev.map(m =>
          m.id === medicine.id
            ? { ...m, stock: m.stock - parseInt(formData.quantity) }
            : m
        )
      );
      
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>We'll deliver your medicine to the provided address soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Purchase {medicine.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="purchase-info">
          <p><strong>Price:</strong> ${medicine.price.toFixed(2)} per unit</p>
          <p><strong>Available Stock:</strong> {medicine.stock} units</p>
        </div>

        <form onSubmit={handleSubmit} className="purchase-form">
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              max={medicine.stock}
              required
            />
          </div>

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Delivery Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter your complete delivery address"
            />
          </div>

          <div className="form-group">
            <label>Doctor's Prescription *</label>
            <input
              type="file"
              name="prescription"
              onChange={handleChange}
              accept="image/*,.pdf"
              required
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Upload a clear image or PDF of your doctor's prescription
            </small>
          </div>

          <div className="total-price">
            <strong>Total: ${(medicine.price * formData.quantity).toFixed(2)}</strong>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseModal;

