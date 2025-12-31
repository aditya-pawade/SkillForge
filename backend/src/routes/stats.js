// Stats allocation routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user stats
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      stats: {
        adaptability: user.adaptability,
        resilience: user.resilience,
        charisma: user.charisma,
        health: user.health,
        efficiency: user.efficiency,
        serendipity: user.serendipity
      },
      statPoints: user.statPoints,
      level: user.level
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Allocate stat points
router.post('/allocate', auth, async (req, res) => {
  try {
    const { statAllocations } = req.body;
    
    if (!statAllocations || typeof statAllocations !== 'object') {
      return res.status(400).json({ message: 'Invalid stat allocations' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.allocateStatPoints(statAllocations);

    res.json({
      message: 'Stats allocated successfully',
      stats: {
        adaptability: user.adaptability,
        resilience: user.resilience,
        charisma: user.charisma,
        health: user.health,
        efficiency: user.efficiency,
        serendipity: user.serendipity
      },
      statPoints: user.statPoints
    });
  } catch (error) {
    console.error('Allocate stats error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;