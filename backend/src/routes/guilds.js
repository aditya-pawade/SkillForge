const express = require('express');
const Guild = require('../models/Guild');

const router = express.Router();

// Get available guilds
router.get('/', async (req, res) => {
  try {
    // Mock guilds for now
    const mockGuilds = [
      {
        _id: 'guild_1',
        name: 'Code Warriors',
        tag: 'CODE',
        description: 'A guild for aspiring software engineers',
        level: 5,
        memberCount: 12,
        maxMembers: 50,
        settings: {
          joinPolicy: 'open',
          isRecruiting: true
        }
      },
      {
        _id: 'guild_2',
        name: 'Data Scholars',
        tag: 'DATA',
        description: 'Scientists and analysts unite!',
        level: 3,
        memberCount: 8,
        maxMembers: 30,
        settings: {
          joinPolicy: 'approval',
          isRecruiting: true
        }
      }
    ];

    res.json({
      success: true,
      data: mockGuilds
    });
  } catch (error) {
    console.error('Get guilds error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching guilds'
    });
  }
});

// Create new guild
router.post('/', async (req, res) => {
  try {
    const { name, tag, description } = req.body;
    const user = req.user;

    // Mock guild creation
    const newGuild = {
      _id: `guild_${Date.now()}`,
      name,
      tag: tag.toUpperCase(),
      description,
      level: 1,
      memberCount: 1,
      createdBy: user._id,
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Guild created successfully!',
      data: newGuild
    });
  } catch (error) {
    console.error('Create guild error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating guild'
    });
  }
});

// Join guild
router.post('/:id/join', async (req, res) => {
  try {
    const guildId = req.params.id;
    const user = req.user;

    res.json({
      success: true,
      message: 'Successfully joined the guild!',
      data: {
        guildId,
        joinedAt: new Date(),
        role: 'member'
      }
    });
  } catch (error) {
    console.error('Join guild error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error joining guild'
    });
  }
});

module.exports = router;