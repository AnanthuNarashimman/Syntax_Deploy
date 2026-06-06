import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Send,
  X,
  Mail,
  Copy,
  FileText,
  Code2,
  Newspaper,
  Shield,
  Users,
  GraduationCap,
  Terminal,
  Clock,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import superAdminDash from "../assets/Images/super_dash.png";
import adminDash from "../assets/Images/admin_dash.png";
import studentDash from "../assets/Images/stu_dash.png";

export default function LandingPage() {
  const navigate = useNavigate();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --primary: #1a1a1a;
          --primary-dark: #000000;
          --accent: #f97316;
          --accent-light: #fdba74;
          --bg-main: #faf8f5;
          --bg-card: #ffffff;
          --bg-card-hover: #ffffff;
          --text-primary: #1a1a1a;
          --text-secondary: #4b5563;
          --text-muted: #6b7280;
          --border: rgba(0, 0, 0, 0.08);
          --border-hover: rgba(249, 115, 22, 0.4);
          --glow-primary: rgba(249, 115, 22, 0.15);
          --glow-accent: rgba(249, 115, 22, 0.2);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body, html {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg-main);
          color: var(--text-primary);
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* Animated Background */
        .lp-bg-wrapper {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: #ffffff;
        }

        .lp-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          animation: orbFloat 20s ease-in-out infinite;
        }

        .lp-gradient-orb.orb-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
          top: -200px;
          left: -100px;
          animation-delay: 0s;
        }

        .lp-gradient-orb.orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #fffbf5 0%, #ffedd5 100%);
          bottom: -150px;
          right: -100px;
          animation-delay: -7s;
        }

        .lp-gradient-orb.orb-3 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -14s;
          opacity: 0.1;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, 30px) scale(1.02); }
        }

        /* Grid Pattern */
        .lp-grid-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(249, 115, 22, 0.07) 2px, transparent 2px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.07) 2px, transparent 2px);
          background-size: 50px 50px;
        }

        /* Noise texture */
        .lp-noise {
          position: absolute;
          inset: 0;
          opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        /* Mouse follower */
        .lp-mouse-glow {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
          opacity: 0.6;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s;
        }

        /* Container */
        .lp-container {
          position: relative;
          z-index: 10;
          height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 3rem;
          display: flex;
          flex-direction: column;
          // overflow: hidden;
        }

        /* Navigation */
        .lp-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          opacity: 0;
          animation: fadeSlideDown 0.6s ease forwards;
        }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .lp-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .lp-logo-icon {
          padding: 0.5rem;
          background: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .lp-version-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 100px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .lp-version-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.6rem;
          background: var(--primary);
          color: white;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .lp-version-tag .pulse-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        /* Main Content */
        .lp-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
          height: calc(100vh - 4rem);
          text-align: center;
          position: relative;
          // overflow: hidden;
        }

        /* Background Text */
        .lp-bg-text {
          font-family: Poppins;
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 23vw;
          font-weight: 600;
          color: var(--text-primary);
          opacity: 0.065;
          letter-spacing: 1 rem;
          user-select: none;
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
        }

        /* Hero Content */
        .lp-hero-content {
          opacity: 0;
          animation: fadeSlideUp 0.8s ease 0.2s forwards;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #fff7ed;
          border: 1px dashed var(--accent);
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--accent);
          margin-bottom: 2rem;
          position: relative;
        }

        .lp-badge-dot {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .lp-hero-title {
          font-size: 5rem;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 1.5rem;
          font-family: 'Montserrat', sans-serif;
        }

        .lp-hero-title .line-1 {
          display: block;
          color: var(--text-primary);
        }

        .lp-hero-title .line-2 {
          display: block;
          background: linear-gradient(135deg, var(--accent) 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-hero-desc {
          font-size: 1.3rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 3rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        /* CTA Buttons */
        .lp-cta-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          justify-content: center;
        }

        .lp-submit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: var(--primary);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }

        .lp-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }

        .lp-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .lp-submit-btn:hover::before {
          transform: translateX(100%);
        }

        .lp-contact-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 14px;
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .lp-contact-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.15);
        }

        .lp-helper-text {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.9rem;
          color: var(--text-muted);
          justify-content: center;
        }

        /* Stats Badge */
        .lp-stats-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .lp-stats-number {
          font-size: 1.1rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent) 0%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Feature Badges */
        .lp-feature-badges {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 2.5rem;
        }

        .lp-feature-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1.5px solid rgba(249, 115, 22, 0.5);
          border-radius: 100px;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--accent);
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .lp-feature-badge:hover {
          background: white;
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
        }

        /* Decorative Grid Pattern */
        .lp-grid-dots {
          position: absolute;
          display: grid;
          grid-template-columns: repeat(3, 20px);
          grid-template-rows: repeat(10, 25px);
          gap: 8px;
          z-index: 5;
        }

        .lp-grid-dots.top-right {
          top: 10%;
          right: -17%;
        }

        .lp-grid-dots.bottom-left {
          bottom: 4%;
          left: -17%;
        }

        .lp-grid-dots .dot {
          width: 15px;
          height: 15px;
          background: var(--accent);
          border-radius: 2px;
          opacity: 0.5;
          transition: opacity 0.3s;
        }

        .lp-grid-dots:hover .dot {
          opacity: 0.8;
        }

        /* Multi-Tenant Section */
        .lp-multitenant-section {
          background: #fff9f5;
          padding: 6rem 3rem;
          position: relative;
          z-index: 2;
        }

        .lp-section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .lp-section-title {
          font-size: 3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .lp-section-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Multi-Tenant Container */
        .lp-multitenant-container {
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 6rem;
        }

        .lp-tenant-item {
          background: transparent;
          padding: 3rem;
          display: flex;
          gap: 3rem;
          align-items: center;
          position: relative;
        }

        .lp-tenant-item:nth-child(even) {
          flex-direction: row-reverse;
        }

        .lp-tenant-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .lp-tenant-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: var(--text-primary);
          border-radius: 50px;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          width: fit-content;
        }

        .lp-tenant-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-top: 0.5rem;
        }

        .lp-tenant-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-top: 0.5rem;
        }

        .lp-tenant-image {
          flex: 1.2;
          position: relative;
          z-index: 1;
        }

        .lp-tenant-image img {
          width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          object-fit: cover;
        }

        /* Assessment Suite Section */
        .lp-assessment-section {
          background: white;
          padding: 6rem 3rem;
          position: relative;
          background-image: radial-gradient(circle, rgba(249, 115, 22, 0.4) 1.5px, transparent 1px);
          background-size: 30px 30px;
        }

        .lp-assessment-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          gap: 5rem;
          align-items: stretch;
        }

        .lp-assessment-item {
          flex: 1;
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .lp-assessment-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .lp-assessment-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex: 1;
        }

        .lp-assessment-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--accent) 0%, #ea580c 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 0.5rem;
        }

        .lp-assessment-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }

        .lp-assessment-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .lp-assessment-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .lp-assessment-features li {
          display: grid;
          grid-template-columns: 24px auto;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .lp-assessment-features li::before {
          content: '✓';
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: rgba(249, 115, 22, 0.1);
          color: var(--accent);
          border-radius: 50%;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .lp-assessment-features li strong {
          display: block;
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 0.15rem;
        }



        /* CTA Section */
        .lp-cta-section {
          background: var(--accent);
          padding: 5rem 3rem;
          position: relative;
          overflow: hidden;
        }

        .lp-cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.15) 2px, transparent 2px);
          background-size: 30px 30px;
          pointer-events: none;
          opacity: 0.6;
        }

        .lp-cta-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .lp-cta-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .lp-cta-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 2.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .lp-cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .lp-cta-button {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lp-cta-button-primary {
          background: white;
          color: var(--accent);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .lp-cta-button-primary:hover {
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
        }

        .lp-cta-button-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .lp-cta-button-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        /* Footer */
        .lp-footer-wrapper {
          background: var(--accent);
          padding: 4rem 3rem 6rem;
          position: relative;
        }

        .lp-footer-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.15) 2px, transparent 2px);
          background-size: 30px 30px;
          pointer-events: none;
          opacity: 0.6;
        }

        .lp-footer {
          max-width: 95vw;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          padding: 5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 3rem;
          position: relative;
          z-index: 1;
          margin-bottom: -70px;
        }

        .lp-footer-left {
          flex: 1;
          max-width: 500px;
        }

        .lp-footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .lp-footer-logo-icon {
          width: 40px;
          height: 40px;
          background: var(--accent);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .lp-footer-logo-text {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          font-family: 'JetBrains Mono', monospace;
        }

        .lp-footer-description {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .lp-footer-social {
          display: flex;
          gap: 1rem;
        }

        .lp-footer-social-link {
          width: 44px;
          height: 44px;
          background: rgba(249, 115, 22, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .lp-footer-social-link:hover {
          background: var(--accent);
          color: white;
          transform: translateY(-3px);
        }

        .lp-footer-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          min-height: 200px;
        }

        .lp-footer-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-end;
        }

        .lp-footer-credit {
          text-align: right;
          color: var(--text-secondary);
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .lp-footer-link {
          font-size: 1rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease;
          font-weight: 500;
          cursor: pointer;
        }

        .lp-footer-link:hover {
          color: var(--accent);
        }

        .lp-footer-bottom {
          text-align: center;
          padding: 2rem 0 0;
          margin-top: 2rem;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        /* Contact Modal */
        .lp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 15, 0.6);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: modalFadeIn 0.25s ease;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lp-modal {
          background: linear-gradient(180deg, #ffffff 0%, #fefdfb 100%);
          border-radius: 28px;
          padding: 0;
          max-width: 400px;
          width: 100%;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.03),
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 100px rgba(249, 115, 22, 0.1);
          animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .lp-modal-hero {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          padding: 2rem 2rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .lp-modal-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 50%);
          animation: modalGlow 8s ease-in-out infinite;
        }

        @keyframes modalGlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }

        .lp-modal-icon {
          position: relative;
          width: 72px;
          height: 72px;
          margin: 0 auto 1rem;
          background: linear-gradient(135deg, var(--accent) 0%, #ea580c 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 10px 30px rgba(249, 115, 22, 0.3);
        }

        .lp-modal-title {
          position: relative;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .lp-modal-subtitle {
          position: relative;
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        .lp-modal-close {
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
          color: var(--text-muted);
          transition: all 0.2s;
          z-index: 10;
        }

        .lp-modal-close:hover {
          background: #ffffff;
          color: var(--text-primary);
          transform: scale(1.05);
        }

        .lp-modal-body {
          padding: 1.5rem 2rem 2rem;
        }

        .lp-modal-email-box {
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

        .lp-modal-email {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: -0.02em;
        }

        .lp-modal-copy {
          padding: 0.5rem 0.75rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-shrink: 0;
        }

        .lp-modal-copy:hover {
          background: #fff7ed;
          border-color: var(--accent);
          color: var(--accent);
        }

        .lp-modal-send-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, var(--primary) 0%, #2d2d2d 100%);
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

        .lp-modal-send-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }

        .lp-modal-send-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .lp-modal-send-btn:hover::before {
          transform: translateX(100%);
        }

        .lp-modal-hint {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .lp-container {
            padding: 1.5rem;
          }

          .lp-hero-title {
            font-size: 2.75rem;
          }

          .lp-version-badge {
            font-size: 0.75rem;
            padding: 0.4rem 0.75rem;
          }

          .lp-version-badge .lp-version-text {
            display: none;
          }

          .lp-cta-buttons {
            flex-direction: column;
          }

          .lp-submit-btn,
          .lp-contact-btn {
            justify-content: center;
          }

          .lp-multitenant-section {
            padding: 4rem 1.5rem;
          }

          .lp-section-title {
            font-size: 2rem;
          }

          .lp-tenant-item {
            padding: 2rem 1.5rem;
            flex-direction: column;
          }

          .lp-tenant-title {
            font-size: 1.75rem;
          }

          .lp-tenant-badge {
            font-size: 0.75rem;
            padding: 0.4rem 1rem;
          }

          .lp-assessment-section {
            padding: 4rem 1.5rem;
          }

          .lp-assessment-container {
            flex-direction: column;
            gap: 2rem;
          }

          .lp-assessment-item {
            padding: 2rem;
          }

          .lp-assessment-title {
            font-size: 1.75rem;
          }

          .lp-assessment-description {
            font-size: 1rem;
          }

          .lp-assessment-icon {
            width: 50px;
            height: 50px;
          }

          .lp-grid-dots {
            display: none;
          }

          .lp-cta-section {
            padding: 4rem 1.5rem;
          }

          .lp-cta-title {
            font-size: 2.25rem;
          }

          .lp-cta-subtitle {
            font-size: 1rem;
          }

          .lp-cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .lp-cta-button {
            justify-content: center;
          }

          .lp-footer-wrapper {
            padding: 3rem 1.5rem;
          }

          .lp-footer {
            flex-direction: column;
            padding: 2rem;
            gap: 2rem;
          }

          .lp-footer-left {
            max-width: 100%;
          }

          .lp-footer-right {
            align-items: flex-start;
            gap: 2rem;
            width: 100%;
            min-height: auto;
          }

          .lp-footer-links {
            align-items: flex-start;
          }

          .lp-footer-credit {
            text-align: left;
          }
        }
      `}</style>

      {/* Background */}
      <div className="lp-bg-wrapper">
        <div className="lp-gradient-orb orb-1"></div>
        <div className="lp-gradient-orb orb-2"></div>
        <div className="lp-gradient-orb orb-3"></div>
        <div className="lp-grid-pattern"></div>
        <div className="lp-noise"></div>
      </div>

      {/* Mouse Glow Effect */}
      <div
        className="lp-mouse-glow"
        style={{ left: mousePosition.x, top: mousePosition.y }}
      ></div>

      <div className="lp-container">
        {/* Decorative Grid Dots */}
        <div className="lp-grid-dots top-right">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="lp-grid-dots bottom-left">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        {/* Main Content */}
        <main className="lp-main">
          {/* Background Text */}
          <div className="lp-bg-text">SYNTAX</div>

          {/* Hero Content */}
          <div className="lp-hero-content">
            <h1 className="lp-hero-title">
              <span className="line-1">Evaluate Talent.</span>
              <span className="line-2">Elevate Teams.</span>
            </h1>

            <p className="lp-hero-desc">
              The scalable assessment platform for institutions. Create quizzes,
              host coding contests, and publish technical articles — all in one
              place.
            </p>

            <div className="lp-stats-badge">
              <Zap size={18} />
              Handled <span className="lp-stats-number">500+</span> users
            </div>

            <div className="lp-cta-buttons">
              <button
                onClick={() => navigate("/student-login")}
                className="lp-submit-btn"
              >
                Login to Platform
                <ArrowRight size={18} />
              </button>
              <button
                className="lp-contact-btn"
                onClick={() => setShowContactModal(true)}
              >
                <Send size={18} />
                Register Institution
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Multi-Tenant Experience Section */}
      <section id="features" className="lp-multitenant-section">
        <div className="lp-section-header">
          <h2 className="lp-section-title">The Multi-Tenant Experience</h2>
          <p className="lp-section-subtitle">
            Tailored dashboards for every role in your ecosystem
          </p>
        </div>

        <div className="lp-multitenant-container">
          {/* Students */}
          <div className="lp-tenant-item">
            <div className="lp-tenant-content">
              <div className="lp-tenant-badge">
                <GraduationCap size={16} />
                Students
              </div>
              <h3 className="lp-tenant-title">Practice, compete, and grow</h3>
              <p className="lp-tenant-description">
                A distraction-free sandbox environment to practice coding, track
                tier progression, and compete on the leaderboard. Access
                quizzes, participate in contests, read technical articles, and
                monitor your growth journey with personalized insights.
              </p>
            </div>
            <div className="lp-tenant-image">
              <img src={studentDash} alt="Student Dashboard" />
            </div>
          </div>

          {/* Trainers/Evaluators */}
          <div className="lp-tenant-item">
            <div className="lp-tenant-content">
              <div className="lp-tenant-badge">
                <Users size={16} />
                Trainers/Evaluators
              </div>
              <h3 className="lp-tenant-title">
                Create, evaluate, and track performance
              </h3>
              <p className="lp-tenant-description">
                Powerful tools to create custom MCQ quizzes, configure test
                cases for coding contests, and publish technical articles. Track
                candidate performance with detailed analytics, manage
                assessments, and evaluate results efficiently with intuitive
                controls.
              </p>
            </div>
            <div className="lp-tenant-image">
              <img src={adminDash} alt="Admin Dashboard" />
            </div>
          </div>

          {/* Super Admins */}
          <div className="lp-tenant-item">
            <div className="lp-tenant-content">
              <div className="lp-tenant-badge">
                <Shield size={16} />
                Super Admins
              </div>
              <h3 className="lp-tenant-title">
                Manage and monitor the entire platform
              </h3>
              <p className="lp-tenant-description">
                Comprehensive dashboard for managing admin accounts, tracking
                overall platform performance, and monitoring system behavior.
                Get real-time insights into user activity, system health, and
                institutional metrics all in one centralized hub.
              </p>
            </div>
            <div className="lp-tenant-image">
              <img src={superAdminDash} alt="Super Admin Dashboard" />
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Suite Section */}
      <section id="assessment" className="lp-assessment-section">
        <div className="lp-section-header">
          <h2 className="lp-section-title">The Assessment Suite</h2>
          <p className="lp-section-subtitle">
            Powerful tools to evaluate talent and track progress
          </p>
        </div>

        <div className="lp-assessment-container">
          {/* Coding Contests */}
          <div className="lp-assessment-item">
            <div className="lp-assessment-content">
              <div className="lp-assessment-icon">
                <Terminal size={28} />
              </div>
              <h3 className="lp-assessment-title">Coding Contests</h3>
              <p className="lp-assessment-description">
                Create comprehensive coding challenges with a professional-grade
                development environment designed for accurate skill assessment.
              </p>
              <ul className="lp-assessment-features">
                <li>
                  <div>
                    <strong>Secure Sandbox Environment:</strong>
                    <span>
                      Isolated execution ensures code runs safely without
                      affecting the system
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Multiple Language Support:</strong>
                    <span>
                      Python, Java, C, C++, and JavaScript with customizable
                      starter code
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Real-Time Test Case Evaluation:</strong>
                    <span>
                      Instant feedback with detailed test results and execution
                      metrics
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Custom Quizzes */}
          <div className="lp-assessment-item">
            <div className="lp-assessment-content">
              <div className="lp-assessment-icon">
                <Clock size={28} />
              </div>
              <h3 className="lp-assessment-title">Custom Quizzes</h3>
              <p className="lp-assessment-description">
                Build and deploy MCQ assessments with advanced features for fair
                and efficient candidate evaluation.
              </p>
              <ul className="lp-assessment-features">
                <li>
                  <div>
                    <strong>Customizable Timer:</strong>
                    <span>
                      Set precise time limits with server-synchronized countdown
                      and auto-submit functionality
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Question Randomization:</strong>
                    <span>
                      Each student gets a unique question order using seeded
                      randomization for fairness
                    </span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Automated Grading:</strong>
                    <span>
                      Instant results with detailed analytics, answer review,
                      and performance tracking
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="lp-cta-section">
        <div className="lp-cta-container">
          <h2 className="lp-cta-title">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="lp-cta-subtitle">
            Join the students and educators already using Syntax to master
            coding skills and evaluate talent effectively.
          </p>
          <div className="lp-cta-buttons">
            <button
              className="lp-cta-button lp-cta-button-primary"
              onClick={() => navigate("/login")}
            >
              <Zap size={20} />
              Get Started
            </button>
            <button
              className="lp-cta-button lp-cta-button-secondary"
              onClick={() => setShowContactModal(true)}
            >
              <Mail size={20} />
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer-wrapper">
        <div className="lp-footer">
          <div className="lp-footer-left">
            <div className="lp-footer-logo">
              <div className="lp-footer-logo-icon">
                <Code2 size={24} />
              </div>
              <span className="lp-footer-logo-text">&lt; SYNTAX /&gt;</span>
            </div>
            <p className="lp-footer-description">
              Our mission is to revolutionize coding education through
              comprehensive assessment tools, empowering students and educators
              to achieve excellence in software development.
            </p>
            <div className="lp-footer-social">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-footer-social-link"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-footer-social-link"
              >
                <Twitter size={20} />
              </a>
              <div
                className="lp-footer-social-link"
                onClick={() => setShowContactModal(true)}
              >
                <Mail size={20} />
              </div>
            </div>
          </div>
          <div className="lp-footer-right">
            <div className="lp-footer-links">
              <span
                className="lp-footer-link"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Home
              </span>
              <span
                className="lp-footer-link"
                onClick={() => scrollToSection("features")}
              >
                Features
              </span>
              <span
                className="lp-footer-link"
                onClick={() => scrollToSection("assessment")}
              >
                Assessment Suite
              </span>
              <span
                className="lp-footer-link"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
              <span
                className="lp-footer-link"
                onClick={() => setShowContactModal(true)}
              >
                Contact
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className="lp-modal-overlay"
          onClick={() => setShowContactModal(false)}
        >
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lp-modal-hero">
              <button
                className="lp-modal-close"
                onClick={() => setShowContactModal(false)}
              >
                <X size={18} />
              </button>
              <div className="lp-modal-icon">
                <Send size={32} />
              </div>
              <h3 className="lp-modal-title">Get in Touch</h3>
              <p className="lp-modal-subtitle">We'd love to hear from you</p>
            </div>

            <div className="lp-modal-body">
              <div className="lp-modal-email-box">
                <span className="lp-modal-email">syntaxplatform@gmail.com</span>
                <button className="lp-modal-copy" onClick={copyEmail}>
                  <Copy size={14} />
                  Copy
                </button>
              </div>

              <button className="lp-modal-send-btn" onClick={openMailClient}>
                <Mail size={20} />
                Open Mail App
              </button>

              <p className="lp-modal-hint">Opens your default email client</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
