import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, Shield, ArrowRight, Send, X, Mail, Copy } from "lucide-react";

export default function RoleSelectPage() {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const openMailClient = () => {
    const email = "syntaxplatform@gmail.com";
    const subject = encodeURIComponent("Inquiry about Syntax Platform");
    const body = encodeURIComponent(
      "Hello Syntax Team,\n\nI would like to inquire about...\n\n",
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("syntaxplatform@gmail.com");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body, html {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #faf8f5;
          color: #1a1a1a;
          min-height: 100vh;
        }

        .rp-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .rp-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(249, 115, 22, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.06) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        .rp-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 1100px;
          width: 100%;
        }

        .rp-back-wrap {
          position: absolute;
          top: 2rem;
          left: 2rem;
          z-index: 2;
        }

        .rp-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          color: #6b7280;
          cursor: pointer;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 8px;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .rp-back:hover {
          color: #f97316;
          border-color: rgba(249, 115, 22, 0.4);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);
        }

        .rp-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
          letter-spacing: -0.03em;
        }

        .rp-subtitle {
          font-size: 1.1rem;
          color: #4b5563;
          margin-bottom: 3.5rem;
        }

        .rp-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .rp-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: center;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .rp-card:hover {
          border-color: rgba(249, 115, 22, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        .rp-card-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 1.5rem;
        }

        .rp-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .rp-card-desc {
          font-size: 0.9rem;
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 2rem;
          flex: 1;
        }

        .rp-card-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #1a1a1a;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
        }

        .rp-card-btn:hover {
          background: #2d2d2d;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .rp-contact-row {
          margin-top: 3rem;
          text-align: center;
        }

        .rp-contact-text {
          font-size: 0.95rem;
          color: #4b5563;
        }

        .rp-contact-link {
          background: none;
          border: none;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          color: #f97316;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .rp-contact-link:hover {
          color: #ea580c;
        }

        /* Contact Modal */
        .rp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 15, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: rpModalFadeIn 0.25s ease;
        }

        @keyframes rpModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .rp-modal {
          background: linear-gradient(180deg, #ffffff 0%, #fefdfb 100%);
          border-radius: 28px;
          padding: 0;
          max-width: 400px;
          width: 100%;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.03),
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 100px rgba(249, 115, 22, 0.1);
          animation: rpModalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        @keyframes rpModalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .rp-modal-hero {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          padding: 2rem 2rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .rp-modal-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 50%);
          animation: rpModalGlow 8s ease-in-out infinite;
        }

        @keyframes rpModalGlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }

        .rp-modal-icon {
          position: relative;
          width: 72px;
          height: 72px;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 10px 30px rgba(249, 115, 22, 0.3);
        }

        .rp-modal-title {
          position: relative;
          font-size: 1.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .rp-modal-subtitle {
          position: relative;
          font-size: 0.95rem;
          color: #6b7280;
        }

        .rp-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 36px;
          height: 36px;
          border: none;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.2s;
          z-index: 10;
        }

        .rp-modal-close:hover {
          background: #ffffff;
          color: #1a1a1a;
          transform: scale(1.05);
        }

        .rp-modal-body {
          padding: 1.5rem 2rem 2rem;
        }

        .rp-modal-email-box {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .rp-modal-email {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1a1a;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: -0.02em;
        }

        .rp-modal-copy {
          padding: 0.5rem 0.75rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-shrink: 0;
        }

        .rp-modal-copy:hover {
          background: #fff7ed;
          border-color: #f97316;
          color: #f97316;
        }

        .rp-modal-send-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .rp-modal-send-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }

        .rp-modal-send-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .rp-modal-send-btn:hover::before {
          transform: translateX(100%);
        }

        .rp-modal-hint {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.8rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .rp-cards {
            grid-template-columns: 1fr;
          }

          .rp-title {
            font-size: 1.75rem;
          }

          .rp-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="rp-page">
        <div className="rp-back-wrap">
          <button className="rp-back" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
        <div className="rp-content">

          <h1 className="rp-title">Choose Your Portal</h1>
          <p className="rp-subtitle">
            Access the platform based on your role
          </p>

          <div className="rp-cards">
            <div className="rp-card">
              <div className="rp-card-icon">
                <GraduationCap size={28} />
              </div>
              <h2 className="rp-card-title">Candidate Portal</h2>
              <p className="rp-card-desc">
                Take assessments, track your progress, and view detailed
                performance analytics.
              </p>
              <button
                className="rp-card-btn"
                onClick={() => navigate("/student-login")}
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="rp-card">
              <div className="rp-card-icon">
                <Users size={28} />
              </div>
              <h2 className="rp-card-title">Examiner Admin</h2>
              <p className="rp-card-desc">
                Create assessments, monitor proctoring sessions, and evaluate
                submissions.
              </p>
              <button
                className="rp-card-btn"
                onClick={() => navigate("/admin-login")}
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="rp-card">
              <div className="rp-card-icon">
                <Shield size={28} />
              </div>
              <h2 className="rp-card-title">System Admin</h2>
              <p className="rp-card-desc">
                Onboard faculty members, and oversee platform operations and all
                active contests.
              </p>
              <button
                className="rp-card-btn"
                onClick={() => navigate("/super-login")}
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="rp-contact-row">
            <span className="rp-contact-text">
              Not registered yet?{" "}
              <button
                className="rp-contact-link"
                onClick={() => setShowContactModal(true)}
              >
                Contact Us
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className="rp-modal-overlay"
          onClick={() => setShowContactModal(false)}
        >
          <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rp-modal-hero">
              <button
                className="rp-modal-close"
                onClick={() => setShowContactModal(false)}
              >
                <X size={18} />
              </button>
              <div className="rp-modal-icon">
                <Send size={32} />
              </div>
              <h3 className="rp-modal-title">Get in Touch</h3>
              <p className="rp-modal-subtitle">We'd love to hear from you</p>
            </div>

            <div className="rp-modal-body">
              <div className="rp-modal-email-box">
                <span className="rp-modal-email">syntaxplatform@gmail.com</span>
                <button className="rp-modal-copy" onClick={copyEmail}>
                  <Copy size={14} />
                  Copy
                </button>
              </div>

              <button className="rp-modal-send-btn" onClick={openMailClient}>
                <Mail size={20} />
                Open Mail App
              </button>

              <p className="rp-modal-hint">Opens your default email client</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
