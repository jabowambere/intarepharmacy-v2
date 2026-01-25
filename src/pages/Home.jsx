import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MedicineCard from '../components/MedicineCard';
import StockAlerts from '../components/StockAlerts';
import Loader from '../components/Loader';
import PageTransition from '../components/PageTransition';
import avatarImg from './avatar.png';
import './Home.css';
import {
  Stethoscope,
  Pill,
  Truck,
  BadgeDollarSign,
  ChevronDown,
  Star
} from "lucide-react";

const Home = () => {
  const { medicines, getStockAlerts, fetchMedicines } = useAuth();
  const alerts = getStockAlerts();
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our medicines, click on the one you need, and follow the purchase process. You'll need to provide your details and delivery address."
    },
    {
      question: "Do you require prescriptions?",
      answer: "For prescription medications, yes. You can upload your prescription during the ordering process. Over-the-counter medicines don't require prescriptions."
    },
    {
      question: "What are your delivery times?",
      answer: "We offer same-day delivery within the city and 1-2 business days for other areas. Emergency medications can be delivered within 2 hours."
    },
    {
      question: "Are your medicines authentic?",
      answer: "Yes, all our medicines are sourced directly from licensed manufacturers and distributors. We guarantee 100% authentic medications."
    }
  ];

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Excellent service! Fast delivery and genuine medicines. Highly recommended."
    },
    {
      name: "Michael Brown",
      rating: 5,
      comment: "Professional staff and great customer service. They always have what I need."
    },
    {
      name: "Emily Davis",
      rating: 4,
      comment: "Good quality medicines at affordable prices. Very satisfied with their service."
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchMedicines();
      setTimeout(() => setLoading(false), 1000);
    };
    loadData();
  }, []);

  if (loading) return <Loader />;

  return (
    <PageTransition>
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-avatar-container">
              <img src={avatarImg} alt="Healthcare Professional" className="hero-avatar-img" />
            </div>
            <div className="hero-text">
              <h1 className="hero-title">What if healthcare felt simpler?</h1>
              <p className="hero-subtitle">
                Intare Pharmacy-your trusted partner in healthcare. We provide quality medicines and 
                professional pharmaceutical services to ensure your well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <h2>About Our Pharmacy</h2>
            <div className="about-grid">
              <div className="about-card">
                <div className="about-icon">
                  <Stethoscope size={32}/>
                </div>
                <h3>Professional Service</h3>
                <p>Our licensed pharmacists provide expert consultation and medication management services.</p>
              </div>
              <div className="about-card">
                <div className="about-icon">
                  <Pill size={32}/>                </div>
                <h3>Quality Medicines</h3>
                <p>We stock only FDA-approved medications from trusted manufacturers.</p>
              </div>
              <div className="about-card">
                <div className="about-icon">
                  <Truck size={32}/>
                </div>
                <h3>Fast Delivery</h3>
                <p>We offer convenient home delivery service for all your medication needs.</p>
              </div>
              <div className="about-card">
                <div className="about-icon">
                  <BadgeDollarSign size={32}/>
                </div>
                <h3>Affordable Prices</h3>
                <p>Competitive pricing with special discounts for regular customers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="medicines-section">
        <div className="container">
          <h2 className="section-title">Our Medicines</h2>
          {alerts.length > 0 && <StockAlerts />}
          <div className="medicines-grid">
            {medicines.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.question}
                  <ChevronDown className={`faq-icon ${openFaq === index ? 'open' : ''}`} size={20} />
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < review.rating ? 'star-filled' : 'star-empty'} 
                    />
                  ))}
                </div>
                <p className="review-comment">"{review.comment}"</p>
                <p className="review-author">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  );
};

export default Home;

