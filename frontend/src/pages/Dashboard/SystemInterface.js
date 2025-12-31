import React, { useState } from 'react';
import './SystemInterface.css';

const SystemInterface = ({ user, connected }) => {
  const [expandedSections, setExpandedSections] = useState({
    title: false,
    stats: true,
    skills: false,
    runes: false,
    additional: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock data similar to the status window
  const userTitles = [
    'SYSTEM ADMINISTRATOR (HIDDEN)',
    'FIRST-EVER NETWORK ARCHITECT (HIDDEN)',
    'DEFENDER OF DIGITAL REALMS (HIDDEN)',
    'THE ONE AHEAD OF ALL OTHERS (HIDDEN)'
  ];

  const userStats = {
    adaptability: user.adaptability || 0,
    resilience: user.resilience || 0,
    charisma: user.charisma || 0,
    health: user.health || 0,
    efficiency: user.efficiency || 0,
    serendipity: user.serendipity || 0
  };

  const userSkills = {
    general: [
      'SYSTEM MONITORING', 'NETWORK ANALYSIS', 'DATA ENCRYPTION',
      'PERFORMANCE OPTIMIZATION', 'SECURITY PROTOCOLS', 'DATABASE MANAGEMENT',
      'API INTEGRATION', 'REAL-TIME PROCESSING', 'CLOUD ARCHITECTURE'
    ],
    exclusive: [
      'ADVANCED SYSTEM CONTROL', 'QUANTUM PROCESSING',
      'NEURAL NETWORK INTEGRATION'
    ]
  };

  const userRunes = [
    'RUNE OF PROCESSING', 'RUNE OF THE NETWORK',
    'RUNE OF EFFICIENCY', 'RUNE OF DEEP ANALYSIS',
    'RUNE OF OPTIMIZATION'
  ];

  const additionalSkills = [
    '[SYSTEM: ALLOWS YOU TO ACCESS CORE FUNCTIONS]',
    '[INTEGRATION: ALLOWS YOU TO COMBINE PROTOCOLS]',
    '[OPTIMIZATION: ALLOWS YOU TO ENHANCE PERFORMANCE]',
    '[???: UNLOCKED AT LVL 60]',
    '[???: UNLOCKED AT LVL 99]'
  ];

  return (
    <div className="system-interface">
      <div className="status-window">
        <div className="window-header">
          <div className="ornate-border-top"></div>
          <h1 className="window-title">STATUS WINDOW</h1>
          <button className="close-button">×</button>
        </div>
        
        <div className="character-info">
          <div className="basic-info">
            <div className="info-row">
              <span className="info-label">NAME:</span>
              <span className="info-value">{user.username?.toUpperCase()}</span>
              <span className="info-label">NICKNAME:</span>
              <span className="info-value nickname">{user.systemRune?.name?.toUpperCase() || 'SYSTEM USER'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">RANK:</span>
              <span className="info-value rank">{user.systemRune?.rank?.toUpperCase() || 'EXPERT'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">LEVEL:</span>
              <span className="info-value level">{user.level || 1}</span>
            </div>
            <div className="info-row">
              <span className="info-label">CLASS:</span>
              <span className="info-value class">{user.currentClass?.toUpperCase() || 'SYSTEM ADMINISTRATOR'}</span>
            </div>
          </div>

          {/* Title Section */}
          <div className="expandable-section">
            <div className="section-header" onClick={() => toggleSection('title')}>
              <span className="section-label">&lt;TITLE&gt;</span>
              <span className={`expand-arrow ${expandedSections.title ? 'expanded' : ''}`}>⌄</span>
            </div>
            {expandedSections.title && (
              <div className="section-content">
                {userTitles.map((title, index) => (
                  <div key={index} className="title-item">
                    · {title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="expandable-section">
            <div className="section-header" onClick={() => toggleSection('stats')}>
              <span className="section-label">&lt;STATS&gt;</span>
              <span className={`expand-arrow ${expandedSections.stats ? 'expanded' : ''}`}>⌄</span>
            </div>
            {expandedSections.stats && (
              <div className="section-content stats-content">
                <div className="stat-row">
                  <span className="stat-name">ADAPTABILITY +</span>
                  <span className="stat-value">{userStats.adaptability}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">RESILIENCE +</span>
                  <span className="stat-value">{userStats.resilience}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">CHARISMA +</span>
                  <span className="stat-value">{userStats.charisma}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">HEALTH +</span>
                  <span className="stat-value">{userStats.health}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">EFFICIENCY +</span>
                  <span className="stat-value">{userStats.efficiency}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">SERENDIPITY +</span>
                  <span className="stat-value">{userStats.serendipity}</span>
                </div>
                <div className="stat-points">
                  <span className="stat-points-label">STAT POINTS:</span>
                  <span className="stat-points-value">{user.statPoints || 0}</span>
                </div>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="expandable-section">
            <div className="section-header" onClick={() => toggleSection('skills')}>
              <span className="section-label">&lt;SKILLS&gt;</span>
              <span className={`expand-arrow ${expandedSections.skills ? 'expanded' : ''}`}>⌄</span>
            </div>
            {expandedSections.skills && (
              <div className="section-content skills-content">
                <div className="skills-category">
                  <span className="category-label">GENERAL SKILLS:</span>
                  <span className="skills-list">{userSkills.general.join(', ')}</span>
                </div>
                <div className="skills-category">
                  <span className="category-label">EXCLUSIVE SKILLS:</span>
                  <span className="skills-list">{userSkills.exclusive.join(', ')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Runes Section */}
          <div className="expandable-section">
            <div className="section-header" onClick={() => toggleSection('runes')}>
              <span className="section-label">&lt;RUNES&gt;</span>
              <span className={`expand-arrow ${expandedSections.runes ? 'expanded' : ''}`}>⌄</span>
            </div>
            {expandedSections.runes && (
              <div className="section-content runes-content">
                <div className="runes-grid">
                  {userRunes.map((rune, index) => (
                    <div key={index} className="rune-item">{rune}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Skills Section */}
          <div className="expandable-section">
            <div className="section-header" onClick={() => toggleSection('additional')}>
              <span className="section-label">&lt;ADDITIONAL SKILLS&gt;</span>
              <span className={`expand-arrow ${expandedSections.additional ? 'expanded' : ''}`}>⌄</span>
            </div>
            {expandedSections.additional && (
              <div className="section-content additional-content">
                {additionalSkills.map((skill, index) => (
                  <div key={index} className={`additional-skill ${skill.includes('???') ? 'locked' : ''}`}>
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="ornate-border-bottom"></div>
      </div>
    </div>
  );
};

export default SystemInterface;