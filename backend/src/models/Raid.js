const mongoose = require('mongoose');

const raidSchema = new mongoose.Schema({
  // Basic Raid Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Raid Classification (inspired by Max-Level Player)
  type: {
    type: String,
    enum: ['dungeon', 'boss-raid', 'guild-war', 'world-event', 'regression-trial'],
    required: true
  },
  
  difficulty: {
    rank: {
      type: String,
      enum: ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'EX'],
      required: true
    },
    level: { type: Number, required: true }, // Recommended level
    dangerRating: { type: Number, min: 1, max: 10 } // 1-10 danger scale
  },
  
  // Participation Requirements
  requirements: {
    minLevel: { type: Number, required: true },
    maxParticipants: { type: Number, required: true },
    minParticipants: { type: Number, default: 1 },
    requiredClasses: [String], // Specific classes needed
    requiredSkills: [{
      skillName: String,
      minLevel: Number
    }],
    entryFee: {
      gold: { type: Number, default: 0 },
      crystals: { type: Number, default: 0 },
      items: [String]
    }
  },
  
  // Raid Mechanics
  phases: [{
    name: String,
    description: String,
    objectives: [String],
    timeLimit: Number, // Minutes
    mechanics: [{
      type: String, // 'puzzle', 'combat', 'stealth', 'teamwork'
      description: String,
      skillCheck: {
        skill: String,
        difficulty: Number
      }
    }],
    rewards: {
      experience: Number,
      gold: Number,
      items: [String]
    }
  }],
  
  // Boss Information (if applicable)
  boss: {
    name: String,
    level: Number,
    hp: Number,
    skills: [String],
    weaknesses: [String],
    resistances: [String],
    patterns: [{
      phase: Number,
      description: String,
      mechanics: [String]
    }]
  },
  
  // Rewards System
  rewards: {
    // Base rewards
    baseRewards: {
      experience: Number,
      gold: Number,
      crystals: Number,
      prestigePoints: Number
    },
    
    // Rank-based multipliers
    rankMultipliers: {
      'S': { type: Number, default: 2.0 },
      'A': { type: Number, default: 1.5 },
      'B': { type: Number, default: 1.2 },
      'C': { type: Number, default: 1.0 },
      'D': { type: Number, default: 0.8 },
      'F': { type: Number, default: 0.5 }
    },
    
    // Possible item drops
    itemDrops: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      dropRate: { type: Number, min: 0, max: 100 }, // Percentage
      rarity: String,
      conditions: String // Special conditions for drop
    }],
    
    // First clear bonuses
    firstClearBonus: {
      experience: Number,
      gold: Number,
      crystals: Number,
      specialItems: [String]
    }
  },
  
  // Raid Instance Management
  instances: [{
    instanceId: { type: String, unique: true },
    participants: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: String, // 'leader', 'member'
      status: { type: String, enum: ['ready', 'in-progress', 'completed', 'failed', 'disconnected'] },
      joinedAt: { type: Date, default: Date.now },
      contribution: {
        damage: { type: Number, default: 0 },
        healing: { type: Number, default: 0 },
        support: { type: Number, default: 0 }
      }
    }],
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'completed', 'failed', 'abandoned'],
      default: 'waiting'
    },
    startTime: Date,
    endTime: Date,
    currentPhase: { type: Number, default: 0 },
    
    // Real-time raid data
    raidData: {
      bossHp: Number,
      phaseProgress: Number,
      timeRemaining: Number,
      teamStats: mongoose.Schema.Types.Mixed
    }
  }],
  
  // Raid Statistics
  statistics: {
    totalAttempts: { type: Number, default: 0 },
    totalCompletions: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    averageCompletionTime: { type: Number, default: 0 },
    fastestCompletion: {
      time: Number,
      team: [String],
      date: Date
    },
    
    // Leaderboards
    topPerformers: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: Number,
      rank: String,
      completionTime: Number,
      date: Date
    }]
  },
  
  // Availability and Scheduling
  availability: {
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
    
    // Daily/weekly scheduling
    schedule: {
      type: String,
      enum: ['always', 'daily', 'weekly', 'event'],
      default: 'always'
    },
    resetTime: String, // "00:00" format for daily resets
    
    // Limited attempts
    maxAttemptsPerDay: Number,
    maxAttemptsPerWeek: Number
  },
  
  // Regression-specific features
  regressionFeatures: {
    isRegressionTrial: { type: Boolean, default: false },
    requiredCycle: Number, // Must be on specific regression cycle
    cycleRewards: [{
      cycle: Number,
      bonusMultiplier: Number,
      specialRewards: [String]
    }],
    
    // Knowledge-based mechanics
    knowledgeChecks: [{
      description: String,
      requiredKnowledge: Number,
      reward: String
    }]
  }
}, {
  timestamps: true
});

// Indexes for performance
raidSchema.index({ 'difficulty.rank': 1, 'difficulty.level': 1 });
raidSchema.index({ type: 1, 'availability.isActive': 1 });
raidSchema.index({ 'requirements.minLevel': 1, 'requirements.maxParticipants': 1 });

// Virtual for completion rate
raidSchema.virtual('completionRate').get(function() {
  if (this.statistics.totalAttempts === 0) return 0;
  return (this.statistics.totalCompletions / this.statistics.totalAttempts) * 100;
});

// Method to check if user can participate
raidSchema.methods.canUserParticipate = function(user) {
  // Level check
  if (user.level < this.requirements.minLevel) return false;
  
  // Class requirement check
  if (this.requirements.requiredClasses.length > 0) {
    if (!this.requirements.requiredClasses.includes(user.class.currentClass)) return false;
  }
  
  // Skill requirement check
  for (const reqSkill of this.requirements.requiredSkills) {
    const userSkill = user.skills.find(s => s.name === reqSkill.skillName);
    if (!userSkill || userSkill.level < reqSkill.minLevel) return false;
  }
  
  // Entry fee check
  if (this.requirements.entryFee.gold > user.inventory.gold) return false;
  if (this.requirements.entryFee.crystals > (user.inventory.currencies?.crystals || 0)) return false;
  
  // Regression requirement check
  if (this.regressionFeatures.isRegressionTrial) {
    if (user.regression.cycle < this.regressionFeatures.requiredCycle) return false;
  }
  
  return true;
};

// Method to calculate rewards for user
raidSchema.methods.calculateRewards = function(user, performance) {
  const baseRewards = { ...this.rewards.baseRewards };
  
  // Apply rank multiplier
  const multiplier = this.rewards.rankMultipliers[performance.rank] || 1.0;
  
  // Apply regression cycle bonus
  let cycleBonus = 1.0;
  if (this.regressionFeatures.cycleRewards) {
    const cycleBonusData = this.regressionFeatures.cycleRewards.find(
      c => c.cycle === user.regression.cycle
    );
    if (cycleBonusData) {
      cycleBonus = cycleBonusData.bonusMultiplier;
    }
  }
  
  // Calculate final rewards
  return {
    experience: Math.floor(baseRewards.experience * multiplier * cycleBonus),
    gold: Math.floor(baseRewards.gold * multiplier * cycleBonus),
    crystals: Math.floor(baseRewards.crystals * multiplier * cycleBonus),
    prestigePoints: Math.floor(baseRewards.prestigePoints * multiplier * cycleBonus)
  };
};

// Static method to get available raids for user
raidSchema.statics.getAvailableRaids = function(user) {
  return this.find({
    'availability.isActive': true,
    'requirements.minLevel': { $lte: user.level }
  }).sort({ 'difficulty.level': 1, 'requirements.minLevel': 1 });
};

module.exports = mongoose.model('Raid', raidSchema);