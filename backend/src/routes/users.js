const express = require('express');
const User = require('../models/User');
const BackgroundAnalysisService = require('../services/BackgroundAnalysisService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password before sending response
    const userResponse = { ...user, password: undefined };

    res.json({
      success: true,
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { profile, backgroundDeclaration } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile fields
    if (profile) {
      Object.keys(profile).forEach(key => {
        if (profile[key] !== undefined && key !== 'id') {
          user.profile[key] = profile[key];
        }
      });
    }

    // Update background declaration only if allowed
    if (backgroundDeclaration && user.backgroundDeclaration.canModify) {
      Object.keys(backgroundDeclaration).forEach(key => {
        if (backgroundDeclaration[key] !== undefined && key !== 'canModify') {
          user.backgroundDeclaration[key] = backgroundDeclaration[key];
        }
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// Add experience points
router.post('/experience', async (req, res) => {
  try {
    const { amount, source } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid experience amount'
      });
    }

    const oldLevel = user.level;
    user.addExperience(amount);
    await user.save();

    const levelUp = user.level > oldLevel;
    
    // Check if user reached Level 10 and can unlock classes
    let classUnlockData = null;
    if (user.level >= 10 && !user.class.isUnlocked) {
      try {
        classUnlockData = await BackgroundAnalysisService.analyzeForClassUnlock(user);
      } catch (error) {
        console.error('Class unlock analysis error:', error);
      }
    }

    res.json({
      success: true,
      message: `Gained ${amount} XP${levelUp ? ` and leveled up to ${user.level}!` : ''}`,
      data: {
        user,
        levelUp,
        oldLevel,
        newLevel: user.level,
        classUnlocked: classUnlockData !== null,
        classUnlockData
      }
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding experience'
    });
  }
});

// Assign stat points
router.post('/assign-stats', async (req, res) => {
  try {
    const { statAllocations } = req.body; // { agility: 2, intelligence: 3, ... }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate total points to assign
    const totalPointsToAssign = Object.values(statAllocations).reduce((sum, points) => sum + points, 0);

    if (totalPointsToAssign > user.stats.availablePoints) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stat points available'
      });
    }

    // Assign points
    Object.entries(statAllocations).forEach(([stat, points]) => {
      if (user.stats.arches[stat] && points > 0) {
        user.stats.arches[stat].base += points;
        user.stats.arches[stat].total = user.stats.arches[stat].base + user.stats.arches[stat].bonus;
      }
    });

    // Deduct available points
    user.stats.availablePoints -= totalPointsToAssign;
    user.stats.totalAssigned += totalPointsToAssign;

    await user.save();

    res.json({
      success: true,
      message: 'Stat points assigned successfully',
      data: {
        stats: user.stats,
        allocations: statAllocations
      }
    });
  } catch (error) {
    console.error('Assign stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error assigning stat points'
    });
  }
});

// Select class at Level 10
router.post('/select-class', async (req, res) => {
  try {
    const { baseClass, specificClass } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.level < 10) {
      return res.status(400).json({
        success: false,
        message: 'Must reach Level 10 to select a class'
      });
    }

    if (!user.class.isUnlocked) {
      return res.status(400).json({
        success: false,
        message: 'Classes not yet unlocked. Gain more experience first.'
      });
    }

    // Verify the selected class is available
    const availableClass = user.class.availableClasses.find(
      ac => ac.baseClass === baseClass && ac.specificClass === specificClass
    );

    if (!availableClass) {
      return res.status(400).json({
        success: false,
        message: 'Selected class is not available for your background'
      });
    }

    // Set the selected class
    user.class.baseClass = baseClass;
    user.class.currentClass = specificClass;
    user.class.classLevel = 1;
    user.class.selectionData = {
      selectedAt: new Date(),
      availableOptions: user.class.availableClasses.map(ac => ac.specificClass),
      selectionReason: req.body.reason || 'Player choice',
      systemRecommendation: user.class.availableClasses[0].specificClass
    };

    await user.save();

    res.json({
      success: true,
      message: `Class selected: ${specificClass}! Your journey begins!`,
      data: {
        selectedClass: {
          baseClass,
          specificClass,
          eligibilityScore: availableClass.eligibilityScore,
          recommendationReason: availableClass.recommendationReason
        },
        user
      }
    });
  } catch (error) {
    console.error('Select class error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error selecting class'
    });
  }
});

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get regression bonuses if applicable
    const RegressionService = require('../services/RegressionService');
    const regressionBonuses = user.regression.totalCycles > 0 ? 
      RegressionService.getRegressionBonuses(user) : {};

    // Mock data for dashboard (would be populated by other services)
    const dashboardData = {
      user,
      regressionBonuses,
      activeQuests: [], // Would be populated by quest service
      availableQuests: [], // Would be populated by quest service
      availableRaids: [], // Would be populated by raid service
      activeRaids: [], // Would be populated by raid service
      notifications: [],
      recentAchievements: [],
      rankings: {
        level: null, // Would be calculated
        regression: null, // Would be calculated
        guild: null // Would be calculated
      },
      guildInfo: null, // Would be populated if user is in guild
      regressionUnlocks: user.regression.totalCycles > 0 ? 
        RegressionService.checkRegressionUnlocks(user) : {}
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

module.exports = router;