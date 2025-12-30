import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsPanel from '../../components/Dashboard/StatsPanel';
import RegressionPanel from '../../components/Dashboard/RegressionPanel';
import QuestPanel from '../../components/Dashboard/QuestPanel';
import SkillsPanel from '../../components/Dashboard/SkillsPanel';
import RaidPanel from '../../components/Dashboard/RaidPanel';
import NotificationPanel from '../../components/Dashboard/NotificationPanel';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your RPG data...</p>
      </div>
    );
  }

  const regressionBonuses = dashboardData?.regressionBonuses || {};
  const hasRegressed = user?.regression?.totalCycles > 0;

  return (
    <div className="dashboard">
      {/* Header with player info and regression status */}
      <div className="dashboard-header">
        <div className="player-info">
          <div className="player-avatar">
            <img 
              src={user?.profile?.avatar || '/default-avatar.png'} 
              alt="Player Avatar"
            />
            {hasRegressed && (
              <div className="regression-badge">
                <span className="cycle-count">{user.regression.totalCycles}</span>
                <span className="regression-icon">🔄</span>
              </div>
            )}
          </div>
          
          <div className="player-details">
            <h1>{user?.username}</h1>
            <div className="player-title">
              {user?.profile?.title || user?.class?.currentClass}
            </div>
            
            <div className="level-info">
              <span className="level">Lv. {user?.level}</span>
              {hasRegressed && (
                <span className="cycle-info">
                  Cycle {user.regression.cycle} | Max Lv.{user.regression.maxLevelReached}
                </span>
              )}
            </div>
            
            {/* Experience Bar with Regression Multiplier */}
            <div className="exp-bar-container">
              <div className="exp-bar">
                <div 
                  className="exp-fill"
                  style={{ 
                    width: `${(user?.experience / user?.experienceToNext) * 100}%` 
                  }}
                />
                <span className="exp-text">
                  {user?.experience} / {user?.experienceToNext} XP
                  {regressionBonuses.experienceMultiplier > 1 && (
                    <span className="bonus-multiplier">
                      (×{regressionBonuses.experienceMultiplier.toFixed(1)})
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => window.location.href = '/quests'}>
            <span className="icon">⚔️</span>
            Quests
          </button>
          <button className="quick-action-btn" onClick={() => window.location.href = '/raids'}>
            <span className="icon">🏛️</span>
            Raids
          </button>
          <button className="quick-action-btn" onClick={() => window.location.href = '/guilds'}>
            <span className="icon">🛡️</span>
            Guild
          </button>
          {user?.level >= 50 && (
            <button className="quick-action-btn regression-btn">
              <span className="icon">🔄</span>
              Regress
            </button>
          )}
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Stats Panel */}
        <div className="dashboard-section">
          <StatsPanel 
            user={user} 
            regressionBonuses={regressionBonuses}
            className="stats-panel"
          />
        </div>

        {/* Regression Panel (if user has regressed) */}
        {hasRegressed && (
          <div className="dashboard-section">
            <RegressionPanel 
              user={user}
              regressionData={dashboardData?.regressionData}
              className="regression-panel"
            />
          </div>
        )}

        {/* Active Quests */}
        <div className="dashboard-section">
          <QuestPanel 
            activeQuests={dashboardData?.activeQuests || []}
            availableQuests={dashboardData?.availableQuests || []}
            regressionBonuses={regressionBonuses}
            className="quest-panel"
          />
        </div>

        {/* Skills Overview */}
        <div className="dashboard-section">
          <SkillsPanel 
            skills={user?.skills || []}
            retainedSkills={user?.regression?.retainedSkills || []}
            regressionBonuses={regressionBonuses}
            className="skills-panel"
          />
        </div>

        {/* Available Raids */}
        <div className="dashboard-section">
          <RaidPanel 
            availableRaids={dashboardData?.availableRaids || []}
            activeRaids={dashboardData?.activeRaids || []}
            regressionUnlocks={dashboardData?.regressionUnlocks || {}}
            className="raid-panel"
          />
        </div>

        {/* Notifications & Updates */}
        <div className="dashboard-section">
          <NotificationPanel 
            notifications={dashboardData?.notifications || []}
            achievements={dashboardData?.recentAchievements || []}
            className="notification-panel"
          />
        </div>

        {/* Guild Info (if in guild) */}
        {user?.guild?.guildId && (
          <div className="dashboard-section">
            <div className="card guild-card">
              <h3>Guild: {dashboardData?.guildInfo?.name}</h3>
              <div className="guild-stats">
                <div className="stat">
                  <span className="label">Level</span>
                  <span className="value">{dashboardData?.guildInfo?.level}</span>
                </div>
                <div className="stat">
                  <span className="label">Members</span>
                  <span className="value">{dashboardData?.guildInfo?.memberCount}</span>
                </div>
                <div className="stat">
                  <span className="label">Rank</span>
                  <span className="value">#{dashboardData?.guildInfo?.rank}</span>
                </div>
              </div>
              <button className="btn btn-secondary">View Guild</button>
            </div>
          </div>
        )}

        {/* Leaderboard Preview */}
        <div className="dashboard-section">
          <div className="card leaderboard-card">
            <h3>Global Rankings</h3>
            <div className="leaderboard-preview">
              <div className="rank-item">
                <span className="rank">Your Level Rank:</span>
                <span className="value">#{dashboardData?.rankings?.level || '---'}</span>
              </div>
              {hasRegressed && (
                <div className="rank-item">
                  <span className="rank">Regression Rank:</span>
                  <span className="value">#{dashboardData?.rankings?.regression || '---'}</span>
                </div>
              )}
              <div className="rank-item">
                <span className="rank">Guild Rank:</span>
                <span className="value">#{dashboardData?.rankings?.guild || '---'}</span>
              </div>
            </div>
            <button className="btn btn-secondary">View All Rankings</button>
          </div>
        </div>
      </div>

      {/* Regression Modal (when user clicks regress button) */}
      {user?.level >= 50 && (
        <div className="regression-modal-trigger">
          {/* This would open a detailed regression confirmation modal */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;