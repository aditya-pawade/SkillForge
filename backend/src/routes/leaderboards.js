const express = require('express');

const router = express.Router();

// Get level leaderboard
router.get('/levels', async (req, res) => {
  try {
    // Mock leaderboard data
    const mockLeaderboard = [
      {
        rank: 1,
        username: 'CodeMaster99',
        level: 45,
        experience: 125000,
        class: 'Senior Software Engineer',
        regressionCycles: 2
      },
      {
        rank: 2,
        username: 'DataWizard',
        level: 42,
        experience: 118000,
        class: 'Research Scientist',
        regressionCycles: 1
      },
      {
        rank: 3,
        username: 'DesignGuru',
        level: 38,
        experience: 95000,
        class: 'Senior Designer',
        regressionCycles: 0
      }
    ];

    res.json({
      success: true,
      data: mockLeaderboard
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard'
    });
  }
});

// Get guild leaderboard
router.get('/guilds', async (req, res) => {
  try {
    const mockGuildLeaderboard = [
      {
        rank: 1,
        name: 'Code Warriors',
        level: 15,
        memberCount: 45,
        totalExperience: 2500000
      },
      {
        rank: 2,
        name: 'Data Scholars',
        level: 12,
        memberCount: 38,
        totalExperience: 1800000
      }
    ];

    res.json({
      success: true,
      data: mockGuildLeaderboard
    });
  } catch (error) {
    console.error('Guild leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching guild leaderboard'
    });
  }
});

module.exports = router;