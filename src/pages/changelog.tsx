import React from 'react';
import Layout from '@theme/Layout';

export default function Changelog() {
  return (
    <Layout title="Changelog - ActionCut" description="ActionCut version history and updates">
      <div className="changelog-page">
        <style>{`
          .navbar {
            display: none !important;
          }
        `}</style>
        
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .changelog-page {
            font-family: 'Poppins', sans-serif;
            background-color: #121212;
            color: #EAEAEA;
            line-height: 1.6;
            min-height: 100vh;
          }
          
          .changelog-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 60px 20px;
          }
          
          .changelog-header {
            text-align: center;
            margin-bottom: 60px;
            padding-bottom: 40px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .changelog-title {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #EAEAEA, #00BFFF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .changelog-subtitle {
            font-size: 18px;
            color: #888888;
            margin-bottom: 32px;
          }
          
          .download-latest {
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
            margin-bottom: 20px;
          }
          
          .download-latest:hover {
            background: linear-gradient(135deg, #0099CC, #007AA3);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 191, 255, 0.3);
            color: white;
            text-decoration: none;
          }
          
          .version-info {
            font-size: 14px;
            color: #888888;
          }
          
          .version-entry {
            margin-bottom: 48px;
            padding-bottom: 32px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .version-entry:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          
          .version-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }
          
          .version-number {
            font-size: 24px;
            font-weight: 700;
            color: #00BFFF;
          }
          
          .version-date {
            font-size: 14px;
            color: #888888;
            font-weight: 500;
          }
          
          .version-changes {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .version-changes li {
            padding: 8px 0;
            padding-left: 24px;
            position: relative;
            color: #EAEAEA;
          }
          
          .version-changes li:before {
            content: '•';
            color: #00BFFF;
            font-size: 18px;
            position: absolute;
            left: 0;
            top: 8px;
          }
          
          .change-type {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-right: 8px;
            text-transform: uppercase;
          }
          
          .change-type.new {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
          }
          
          .change-type.fix {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
          }
          
          .change-type.improve {
            background: rgba(59, 130, 246, 0.2);
            color: #3b82f6;
          }
          
          .back-link {
            display: inline-block;
            margin-bottom: 40px;
            color: #00BFFF;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
          }
          
          .back-link:hover {
            color: #0099CC;
            text-decoration: none;
          }
          
          @media (max-width: 768px) {
            .changelog-container {
              padding: 40px 16px;
            }
            
            .changelog-title {
              font-size: 36px;
            }
            
            .version-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
            
            .version-number {
              font-size: 20px;
            }
          }
        `}</style>

        <div className="changelog-container">
          <a href="/" className="back-link">← Back to Home</a>
          
          <div className="changelog-header">
            <h1 className="changelog-title">Changelog</h1>
            <p className="changelog-subtitle">Stay up to date with ActionCut's latest features and improvements</p>
            <a href="/actioncut-latest.apk" className="download-latest" download>
              Download Latest Version
            </a>
            <div className="version-info">Current version: v1.2.0 • Android 7.0+</div>
          </div>

          <div className="changelog-content">
            <div className="version-entry">
              <div className="version-header">
                <div className="version-number">v1.2.0</div>
                <div className="version-date">2024.12.15</div>
              </div>
              <ul className="version-changes">
                <li><span className="change-type new">New</span>Smart auto-sync with multiple video sources</li>
                <li><span className="change-type new">New</span>Export highlights in multiple resolutions (720p, 1080p, 4K)</li>
                <li><span className="change-type improve">Improve</span>Faster video processing with improved compression</li>
                <li><span className="change-type improve">Improve</span>Enhanced overlay button visibility in bright conditions</li>
                <li><span className="change-type fix">Fix</span>Resolved crash when marking moments in portrait mode</li>
                <li><span className="change-type fix">Fix</span>Fixed timestamp accuracy for videos longer than 2 hours</li>
              </ul>
            </div>

            <div className="version-entry">
              <div className="version-header">
                <div className="version-number">v1.1.3</div>
                <div className="version-date">2024.11.28</div>
              </div>
              <ul className="version-changes">
                <li><span className="change-type fix">Fix</span>Critical bug causing app crashes during video export</li>
                <li><span className="change-type fix">Fix</span>Memory leak when processing large video files</li>
                <li><span className="change-type improve">Improve</span>Better error messages for unsupported video formats</li>
              </ul>
            </div>

            <div className="version-entry">
              <div className="version-header">
                <div className="version-number">v1.1.2</div>
                <div className="version-date">2024.11.15</div>
              </div>
              <ul className="version-changes">
                <li><span className="change-type new">New</span>Customizable clip duration before and after each mark</li>
                <li><span className="change-type new">New</span>Batch export multiple highlight reels at once</li>
                <li><span className="change-type improve">Improve</span>Reduced app startup time by 40%</li>
                <li><span className="change-type improve">Improve</span>Better integration with device gallery apps</li>
                <li><span className="change-type fix">Fix</span>Audio sync issues in exported videos</li>
              </ul>
            </div>

            <div className="version-entry">
              <div className="version-header">
                <div className="version-number">v1.1.1</div>
                <div className="version-date">2024.10.30</div>
              </div>
              <ul className="version-changes">
                <li><span className="change-type fix">Fix</span>Overlay button not responding on some device models</li>
                <li><span className="change-type fix">Fix</span>Video quality degradation during processing</li>
                <li><span className="change-type improve">Improve</span>Enhanced compatibility with Android 14</li>
              </ul>
            </div>

            <div className="version-entry">
              <div className="version-header">
                <div className="version-number">v1.1.0</div>
                <div className="version-date">2024.10.12</div>
              </div>
              <ul className="version-changes">
                <li><span className="change-type new">New</span>Real-time preview of marked moments</li>
                <li><span className="change-type new">New</span>Share highlights directly to social media platforms</li>
                <li><span className="change-type new">New</span>Dark mode support throughout the app</li>
                <li><span className="change-type improve">Improve</span>Streamlined onboarding experience</li>
                <li><span className="change-type improve">Improve</span>Better performance on older Android devices</li>
                <li><span className="change-type fix">Fix</span>Incorrect timestamp display in some timezones</li>
              </ul>
            </div>

            <div className="version-entry">
              <div className="version-header">
                <div className="version-number">v1.0.0</div>
                <div className="version-date">2024.09.20</div>
              </div>
              <ul className="version-changes">
                <li><span className="change-type new">New</span>Initial release of ActionCut</li>
                <li><span className="change-type new">New</span>Live moment marking with overlay button</li>
                <li><span className="change-type new">New</span>Automatic video file detection and sync</li>
                <li><span className="change-type new">New</span>One-tap highlight reel generation</li>
                <li><span className="change-type new">New</span>Support for HD video processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}