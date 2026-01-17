import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Cpu, Terminal, Sparkles, ArrowRight, Zap, Lock, BarChart3, Send, AppWindow } from 'lucide-react';
import LP from "../assets/Images/LP.png";

export default function LandingPage() {
    const navigate = useNavigate();

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const scrollToRoles = () => {
        document.getElementById('roles-section')?.scrollIntoView({ behavior: 'smooth' });
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
          background: linear-gradient(180deg, #faf8f5 0%, #fef7ed 50%, #fff7ed 100%);
        }

        .lp-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
          animation: orbFloat 20s ease-in-out infinite;
        }

        .lp-gradient-orb.orb-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
          top: -200px;
          left: -100px;
          animation-delay: 0s;
        }

        .lp-gradient-orb.orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          bottom: -150px;
          right: -100px;
          animation-delay: -7s;
        }

        .lp-gradient-orb.orb-3 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -14s;
          opacity: 0.4;
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
            linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
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
          min-height: 100vh;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 3rem;
          display: flex;
          flex-direction: column;
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
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 2rem 0;
          min-height: calc(100vh - 100px);
        }

        /* Hero Left */
        .lp-hero-content {
          opacity: 0;
          animation: fadeSlideUp 0.8s ease 0.2s forwards;
          margin-top: -40px;
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
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
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
          font-size: 1.2rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        /* CTA Buttons */
        .lp-cta-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
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
        }

        .lp-helper-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lp-helper-item svg {
          color: var(--accent);
        }

        /* Hero Right - Image */
        .lp-hero-visual {
          position: relative;
          opacity: 0;
          animation: fadeSlideUp 0.8s ease 0.4s forwards;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lp-hero-image {
          width: 100%;
          max-width: 590px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1));
          animation: floatImage 6s ease-in-out infinite;
          border-radius: 15px;
        }

        @keyframes floatImage {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        /* Role Cards */
        .lp-roles-section {
          padding: 4rem 0;
          opacity: 0;
          animation: fadeSlideUp 0.8s ease 0.6s forwards;
        }

        .lp-roles-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .lp-roles-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .lp-roles-subtitle {
          color: var(--text-muted);
        }

        .lp-roles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .lp-role-card {
          position: relative;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .lp-role-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--accent) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .lp-role-card:hover {
          transform: translateY(-8px);
          border-color: rgba(249, 115, 22, 0.2);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(249, 115, 22, 0.1);
        }

        .lp-role-card:hover::before {
          opacity: 0.03;
        }

        .lp-role-icon-wrapper {
          position: relative;
          width: 60px;
          height: 60px;
          margin-bottom: 1.5rem;
        }

        .lp-role-icon {
          width: 100%;
          height: 100%;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          transition: all 0.3s;
        }

        .lp-role-icon.icon-candidate {
          background: #fff7ed;
          color: var(--accent);
        }

        .lp-role-icon.icon-examiner {
          background: #f0f9ff;
          color: #0ea5e9;
        }

        .lp-role-icon.icon-admin {
          background: #ecfdf5;
          color: #10b981;
        }

        .lp-role-card:hover .lp-role-icon {
          transform: scale(1.1);
        }

        .lp-role-glow {
          position: absolute;
          inset: -10px;
          border-radius: 20px;
          opacity: 0;
          filter: blur(20px);
          transition: opacity 0.4s;
        }

        .lp-role-card:hover .lp-role-glow {
          opacity: 0.2;
        }

        .lp-role-glow.glow-candidate { background: var(--accent); }
        .lp-role-glow.glow-examiner { background: #0ea5e9; }
        .lp-role-glow.glow-admin { background: #10b981; }

        .lp-role-content {
          position: relative;
          z-index: 1;
        }

        .lp-role-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .lp-role-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .lp-role-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .lp-role-card:hover .lp-role-link {
          color: var(--accent);
          gap: 0.75rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .lp-main {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .lp-hero-visual {
            order: -1;
          }

          .lp-hero-image {
            max-width: 400px;
          }
        }

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

          .lp-main {
            min-height: auto;
            padding: 2rem 0 4rem;
          }

          .lp-roles-grid {
            grid-template-columns: 1fr;
          }

          .lp-cta-buttons {
            flex-direction: column;
          }

          .lp-submit-btn,
          .lp-contact-btn {
            justify-content: center;
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
                {/* Navigation */}
                <nav className="lp-nav">
                    <div className="lp-logo">
                        <div className="lp-logo-icon">
                            <Terminal size={20} strokeWidth={2.5} />
                        </div>
                        Syntax
                    </div>
                    <div className="lp-version-badge">
                        <span className="lp-version-tag">
                            <span className="pulse-dot"></span>
                            V1
                        </span>
                        <span className="lp-version-text">Actively improving · More features coming soon</span>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="lp-main">
                    {/* Hero Left */}
                    <div className="lp-hero-content">
                        <div className="lp-badge">
                            <div className="lp-badge-dot"></div>
                            <AppWindow size={14} />
                            Built for execution and evaluation.
                        </div>

                        <h1 className="lp-hero-title">
                            <span className="line-1">Evaluate Talent.</span>
                            <span className="line-2">Syntax.</span>
                        </h1>

                        <p className="lp-hero-desc">
                            A unified platform to manage admins, enroll students, and host live coding contests. No clutter, just the tools you need.
                        </p>

                        <div className="lp-cta-buttons">
                            <button onClick={scrollToRoles} className="lp-submit-btn">
                                Get Started
                                <ArrowRight size={18} />
                            </button>
                            <button className="lp-contact-btn">
                                <Send size={18} />
                                Contact
                            </button>
                        </div>

                        <div className="lp-helper-text">
                            <div className="lp-helper-item">
                                <Sparkles size={16} />
                                Distraction free
                            </div>
                            <div className="lp-helper-item">
                                <Lock size={16} />
                                Secure Sandbox
                            </div>
                            <div className="lp-helper-item">
                                <BarChart3 size={16} />
                                Real-time analytics
                            </div>
                        </div>
                    </div>

                    {/* Hero Right - Image */}
                    <div className="lp-hero-visual">
                        <img src={LP} alt="Syntax Platform" className="lp-hero-image" />
                    </div>
                </main>

                {/* Role Cards Section */}
                <section id="roles-section" className="lp-roles-section">
                    <div className="lp-roles-header">
                        <h2 className="lp-roles-title">Choose your portal</h2>
                        <p className="lp-roles-subtitle">Access the platform based on your role</p>
                    </div>

                    <div className="lp-roles-grid">
                        {/* Candidate */}
                        <div className="lp-role-card" onClick={() => navigate("/student-login")}>
                            <div className="lp-role-icon-wrapper">
                                <div className="lp-role-glow glow-candidate"></div>
                                <div className="lp-role-icon icon-candidate">
                                    <User size={28} />
                                </div>
                            </div>
                            <div className="lp-role-content">
                                <h3 className="lp-role-title">Candidate Portal</h3>
                                <p className="lp-role-desc">
                                    Take assessments, track your progress, and view detailed performance analytics.
                                </p>
                                <span className="lp-role-link">
                                    Get Started <ArrowRight size={16} />
                                </span>
                            </div>
                        </div>

                        {/* Examiner */}
                        <div className="lp-role-card" onClick={() => navigate("/admin-login")}>
                            <div className="lp-role-icon-wrapper">
                                <div className="lp-role-glow glow-examiner"></div>
                                <div className="lp-role-icon icon-examiner">
                                    <ShieldCheck size={28} />
                                </div>
                            </div>
                            <div className="lp-role-content">
                                <h3 className="lp-role-title">Examiner Admin</h3>
                                <p className="lp-role-desc">
                                    Create assessments, monitor proctoring sessions, and evaluate submissions.
                                </p>
                                <span className="lp-role-link">
                                    Get Started <ArrowRight size={16} />
                                </span>
                            </div>
                        </div>

                        {/* Admin */}
                        <div className="lp-role-card" onClick={() => navigate("/super-login")}>
                            <div className="lp-role-icon-wrapper">
                                <div className="lp-role-glow glow-admin"></div>
                                <div className="lp-role-icon icon-admin">
                                    <Cpu size={28} />
                                </div>
                            </div>
                            <div className="lp-role-content">
                                <h3 className="lp-role-title">System Admin</h3>
                                <p className="lp-role-desc">
                                    Onboard faculty members, and oversee platform operations and all active contests.
                                </p>
                                <span className="lp-role-link">
                                    Get Started <ArrowRight size={16} />
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}