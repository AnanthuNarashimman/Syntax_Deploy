import { Monitor, Smartphone } from 'lucide-react';

export default function MobileBlocker({ children }) {
    return (
        <>
            <style>{`
                .mobile-blocker {
                    display: none;
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    background: linear-gradient(180deg, #faf8f5 0%, #fef7ed 50%, #fff7ed 100%);
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    text-align: center;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .mobile-blocker-icon {
                    position: relative;
                    margin-bottom: 2rem;
                }

                .mobile-blocker-icon .phone {
                    width: 64px;
                    height: 64px;
                    color: #ef4444;
                    opacity: 0.3;
                }

                .mobile-blocker-icon .monitor {
                    width: 80px;
                    height: 80px;
                    color: #f97316;
                }

                .mobile-blocker-icon .cross {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(45deg);
                    width: 80px;
                    height: 4px;
                    background: #ef4444;
                    border-radius: 2px;
                }

                .mobile-blocker h1 {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #1a1a1a;
                    margin-bottom: 0.75rem;
                    letter-spacing: -0.02em;
                }

                .mobile-blocker p {
                    font-size: 1rem;
                    color: #6b7280;
                    max-width: 320px;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }

                .mobile-blocker-hint {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }

                .mobile-blocker-hint .monitor-small {
                    width: 24px;
                    height: 24px;
                    color: #f97316;
                }

                .mobile-blocker-hint span {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #1a1a1a;
                }

                .mobile-content {
                    display: block;
                }

                @media (max-width: 768px) {
                    .mobile-blocker {
                        display: flex;
                    }
                    .mobile-content {
                        display: none;
                    }
                }
            `}</style>

            <div className="mobile-blocker">
                <div className="mobile-blocker-icon">
                    <Smartphone className="phone" />
                    <div className="cross"></div>
                </div>
                <h1>Desktop Only</h1>
                <p>
                    Syntax is optimized for larger screens. Please switch to a desktop or laptop for the best experience.
                </p>
                <div className="mobile-blocker-hint">
                    <Monitor className="monitor-small" />
                    <span>Use a screen wider than 768px</span>
                </div>
            </div>

            <div className="mobile-content">
                {children}
            </div>
        </>
    );
}
