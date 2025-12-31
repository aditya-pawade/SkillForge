import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import SystemInterface from './SystemInterface';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-nav">
          <h1 className="dashboard-title">SkillForge</h1>
          <div className="connection-status">
            <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}>
              {connected ? '🟢 Online' : '🔴 Offline'}
            </span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="tab-icon">🏠</span>
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <span className="tab-icon">⚙️</span>
            System
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            {/* User Profile Card */}
            <div className="dashboard-card user-profile">
              <h2>Hunter Profile</h2>
              <div className="profile-info">
                <div className="profile-header">
                  <div className="avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h3>{user.username}</h3>
                    <p className="level">Level {user.level}</p>
                  </div>
                </div>
                
                {user.systemRune && (
                  <div className="system-rune">
                    <h4>System Rune</h4>
                    <div className="rune-info">
                      <span className={`rune-rank rank-${user.systemRune.rank?.toLowerCase()}`}>
                        {user.systemRune.rank}-Rank
                      </span>
                      <p className="rune-name">{user.systemRune.name}</p>
                      <p className="rune-category">{user.systemRune.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ARCHES Stats */}
            <div className="dashboard-card arches-stats">
              <h2>ARCHES Stats</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Adaptability</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill adaptability" 
                      style={{ width: `${(user.adaptability / 20) * 100}%` }}
                    ></div>
                    <span className="stat-value">{user.adaptability}</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Resilience</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill resilience" 
                      style={{ width: `${(user.resilience / 20) * 100}%` }}
                    ></div>
                    <span className="stat-value">{user.resilience}</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Charisma</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill charisma" 
                      style={{ width: `${(user.charisma / 20) * 100}%` }}
                    ></div>
                    <span className="stat-value">{user.charisma}</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Health</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill health" 
                      style={{ width: `${(user.health / 20) * 100}%` }}
                    ></div>
                    <span className="stat-value">{user.health}</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Efficiency</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill efficiency" 
                      style={{ width: `${(user.efficiency / 20) * 100}%` }}
                    ></div>
                    <span className="stat-value">{user.efficiency}</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Serendipity</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill serendipity" 
                      style={{ width: `${(user.serendipity / 20) * 100}%` }}
                    ></div>
                    <span className="stat-value">{user.serendipity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button className="action-button">
                  <span className="action-icon">⚡</span>
                  Start Quest
                </button>
                <button className="action-button">
                  <span className="action-icon">🎯</span>
                  View Skills
                </button>
                <button className="action-button">
                  <span className="action-icon">👥</span>
                  Join Guild
                </button>
                <button className="action-button">
                  <span className="action-icon">🏆</span>
                  Leaderboard
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="dashboard-card system-status">
              <h2>System Status</h2>
              <div className="status-info">
                <div className="status-item">
                  <span className="status-label">Server Connection</span>
                  <span className={`status-value ${connected ? 'online' : 'offline'}`}>
                    {connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Account Status</span>
                  <span className="status-value online">Active</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Last Login</span>
                  <span className="status-value">Just now</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <SystemInterface user={user} connected={connected} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;