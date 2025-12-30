const express = require('express');
const Quest = require('../models/Quest');

const router = express.Router();

// Get available quests for user
router.get('/', async (req, res) => {
  try {
    const user = req.user;
    
    // For now, return mock quests since we haven't implemented the full quest system
    const mockQuests = [
      {
        _id: 'quest_1',
        title: 'Daily Learning Challenge',
        description: 'Complete a learning activity today',
        type: 'daily',
        difficulty: 'easy',
        minLevel: 1,
        rewards: {
          experience: 50,
          gold: 25
        },
        objectives: [{
          description: 'Complete any learning activity',
          type: 'complete',
          required: 1,
          current: 0
        }]
      },
      {
        _id: 'quest_2',
        title: 'Skill Practice Session',
        description: 'Practice a skill for 30 minutes',
        type: 'daily',
        difficulty: 'normal',
        minLevel: 1,
        rewards: {
          experience: 75,
          gold: 35
        },
        objectives: [{
          description: 'Practice any skill for 30 minutes',
          type: 'complete',
          required: 1,
          current: 0
        }]
      }
    ];

    res.json({
      success: true,
      data: mockQuests
    });
  } catch (error) {
    console.error('Get quests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quests'
    });
  }
});

// Start a quest
router.post('/:id/start', async (req, res) => {
  try {
    const questId = req.params.id;
    const user = req.user;

    // Mock quest start
    res.json({
      success: true,
      message: `Quest ${questId} started successfully!`,
      data: {
        questId,
        startTime: new Date(),
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Start quest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error starting quest'
    });
  }
});

// Complete a quest
router.post('/:id/complete', async (req, res) => {
  try {
    const questId = req.params.id;
    const user = req.user;

    // Mock quest completion with XP reward
    const expReward = 50;
    const goldReward = 25;

    res.json({
      success: true,
      message: `Quest completed! Gained ${expReward} XP and ${goldReward} gold!`,
      data: {
        questId,
        completedAt: new Date(),
        rewards: {
          experience: expReward,
          gold: goldReward
        }
      }
    });
  } catch (error) {
    console.error('Complete quest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing quest'
    });
  }
});

module.exports = router;