import React, { useEffect, useState, useContext } from "react";
import FaceExpression from "../../Expression/components/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";
import { SongContext } from "../song.context";
import "./home.scss";

const Home = () => {
  const { handleGetSong, song, loading } = useSong();
  const { setSong } = useContext(SongContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("moodHistory")) || [];
    setHistory(data);
  }, []);

  const handleDetection = async (expression) => {
    if (!expression) return;
    
    // Spelling fix for UI
    const formattedExpression = expression.toLowerCase() === 'nultural' ? 'Neutral' : expression;

    await handleGetSong({ mood: formattedExpression });

    const newEntry = { 
      mood: formattedExpression, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    const updatedHistory = [newEntry, ...history.slice(0, 7)]; 
    setHistory(updatedHistory);
    localStorage.setItem("moodHistory", JSON.stringify(updatedHistory));
  };

  const getEmoji = (mood) => {
    const m = mood?.toLowerCase();
    if (m === 'happy') return '😊';
    if (m === 'sad') return '😢';
    if (m === 'surprised') return '😯';
    return '😐';
  };

  return (
    <div className="moodify-container">
      
      {/* Background Glows for Depth */}
      <div className="glow-1"></div>
      <div className="glow-2"></div>

      <div className="app-layout">
        
        {/* LEFT: Camera & Detection */}
        <aside className="glass-sidebar">
          
          <div className="section-label">EXPRESSION CAPTURE</div>
          <div className="camera-box">
            <FaceExpression onClick={handleDetection} />
          </div>
          <div className="current-status">
            <h2 className={history[0]?.mood.toLowerCase()}>{history[0]?.mood || "Neutral"}</h2>
            <button className="reset-btn" onClick={() => window.location.reload()}>
              Reset Camera
            </button>
          </div>
        </aside>

        {/* CENTER: Analysis & History */}
        <main className="main-content">
          <div className="hero-card glass">
            <div className="analysis-info">
              <p className="sub-text">CURRENT MOOD ANALYSIS</p>
              <h1 className="mood-title">{history[0]?.mood || "Neutral"}</h1>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: history[0] ? '99%' : '5%' }}></div>
              </div>
            </div>
            <div className="big-emoji">{getEmoji(history[0]?.mood)}</div>
          </div>

          <div className="timeline-section glass">
            <div className="timeline-header">
              <h3>Today's Timeline</h3>
              <span className="live-indicator">LIVE</span>
            </div>
            <div className="timeline-scroll">
              {history.map((item, i) => (
                <div key={i} className="timeline-row">
                  <div className="status-dot"></div>
                  <span className="mood-name">{item.mood}</span>
                  <span className="timestamp">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* RIGHT: Recommendations */}
        <section className="playlist-sidebar glass">
          <div className="section-header">
            <h3>Recommended Songs</h3>
            <span className="icon">🎵</span>
          </div>
          
          <div className="song-container">
            {loading ? (
              <div className="skeleton-loader">Fetching Vibes...</div>
            ) : Array.isArray(song) && song.length > 0 ? (
              song.map((s, i) => (
                <div key={i} className="song-card-modern" onClick={() => setSong([s])}>
                  <div className="img-wrapper">
                    <img src={s.posterUrl} alt={s.title} />
                    <div className="play-btn">▶</div>
                  </div>
                  <div className="info">
                    <p className="song-name">{s.title}</p>
                    <span className="mood-tag">{s.mood}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No songs yet. Start detection!</div>
            )}
          </div>
        </section>
      </div>

      {/* BOTTOM PLAYER */}
      <footer className="fixed-player">
        <Player />
      </footer>
    </div>
  );
};

export default Home;