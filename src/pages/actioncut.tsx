import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function ActionCut() {
  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Add scroll listeners for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    // Add smooth scroll event listeners
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      observer.disconnect();
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <Layout title="ActionCut - Sports Highlight Video Creator" description="Transform hours of game footage into epic highlight reels in minutes">
      <div className="actioncut-page">
        {/* Global Styles */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .actioncut-page {
            font-family: 'Poppins', sans-serif;
            background-color: #121212;
            color: #EAEAEA;
            line-height: 1.6;
          }
          
          .actioncut-page * {
            box-sizing: border-box;
          }
          
          .primary-button {
            background: linear-gradient(135deg, #00BFFF, #0099CC);
            color: white;
            padding: 16px 32px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
          }
          
          .primary-button:hover {
            background: linear-gradient(135deg, #0099CC, #007AA3);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 191, 255, 0.3);
            color: white;
            text-decoration: none;
          }
          
          .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
          }
          
          .animate-fade-in {
            opacity: 1;
            transform: translateY(0);
          }
          
          .sticky-header {
            position: sticky;
            top: 0;
            background: rgba(18, 18, 18, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .hero-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
          }
          
          .section-padding {
            padding: 80px 0;
          }
          
          .feature-icon {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #00BFFF, #0099CC);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            font-size: 28px;
            color: white;
          }
          
          .step-number {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #00BFFF, #0099CC);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 20px;
            color: white;
            margin: 0 auto 16px;
          }
        `}</style>

        {/* Header/Navigation */}
        <header className="sticky-header">
          <div className="container">
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#00BFFF' }}>
                ActionCut
              </div>
              <div style={{ display: 'flex', gap: '32px' }}>
                <a href="#features" style={{ color: '#EAEAEA', textDecoration: 'none', fontWeight: '500' }}>Features</a>
                <a href="#how-it-works" style={{ color: '#EAEAEA', textDecoration: 'none', fontWeight: '500' }}>How It Works</a>
                <a href="#download" style={{ color: '#EAEAEA', textDecoration: 'none', fontWeight: '500' }}>Download</a>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
              <div className="animate-on-scroll">
                <h1 style={{ fontSize: '48px', fontWeight: '700', lineHeight: '1.2', marginBottom: '24px', background: 'linear-gradient(135deg, #EAEAEA, #00BFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Go From Full Game to Epic Highlights in Minutes
                </h1>
                <p style={{ fontSize: '20px', color: '#888888', marginBottom: '32px' }}>
                  Stop wasting hours scrubbing through footage. With ActionCut, you mark the best moments live and get a share-ready video instantly.
                </p>
                <a href="https://github.com/your-username/actioncut/releases/latest" className="primary-button">
                  Download Free Trial
                </a>
              </div>
              <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  height: '400px', 
                  background: 'linear-gradient(135deg, #00BFFF20, #0099CC20)', 
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #00BFFF40'
                }}>
                  <span style={{ fontSize: '18px', color: '#888888' }}>
                    [Dynamic Sports Video Placeholder]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="section-padding" style={{ background: '#1a1a1a' }}>
          <div className="container">
            <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>What You Can Do</h2>
              <p style={{ fontSize: '18px', color: '#888888' }}>Powerful features designed for athletes, parents, and sports videographers</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
              <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                <div className="feature-icon">🎯</div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Mark Moments Instantly</h3>
                <p style={{ color: '#888888' }}>
                  Tap our non-intrusive overlay button the second a great play happens. No need to stop recording or switch apps.
                </p>
              </div>
              
              <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                <div className="feature-icon">🔄</div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Smart Video Sync</h3>
                <p style={{ color: '#888888' }}>
                  ActionCut intelligently finds the video files on your device that match your marking session. No manual searching required.
                </p>
              </div>
              
              <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                <div className="feature-icon">✂️</div>
                <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Effortless Cutting</h3>
                <p style={{ color: '#888888' }}>
                  Set your preferred clip length before and after each marker. The app handles all the trimming and processing for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="section-padding">
          <div className="container">
            <div className="animate-on-scroll" style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>How It Works</h2>
              <p style={{ fontSize: '18px', color: '#888888' }}>Three simple steps to create amazing highlight reels</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px' }}>
              <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                <div className="step-number">1</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Start a Session & Record</h3>
                <p style={{ color: '#888888' }}>
                  Begin your ActionCut session and start recording the game with your device.
                </p>
              </div>
              
              <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                <div className="step-number">2</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Tap to Mark Highlights</h3>
                <p style={{ color: '#888888' }}>
                  When something amazing happens, simply tap the overlay button to mark the moment.
                </p>
              </div>
              
              <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                <div className="step-number">3</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Generate & Share Your Video</h3>
                <p style={{ color: '#888888' }}>
                  ActionCut automatically creates your highlight reel and makes it ready to share.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Download CTA Section */}
        <section id="download" className="section-padding" style={{ background: 'linear-gradient(135deg, #1a1a1a, #121212)' }}>
          <div className="container">
            <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '24px' }}>
                Ready to Cut Your Editing Time by 90%?
              </h2>
              <div style={{ marginBottom: '24px' }}>
                <a href="https://github.com/your-username/actioncut/releases/latest" className="primary-button">
                  Download Free Trial
                </a>
              </div>
              <p style={{ color: '#888888', fontSize: '16px' }}>
                Available for Android. iOS coming soon.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: '#0a0a0a', padding: '40px 0', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="container">
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#888888', marginBottom: '16px' }}>
                © 2025 ActionCut. All Rights Reserved.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                <a href="#" style={{ color: '#888888', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: '#888888', textDecoration: 'none' }}>Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}