const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Quest Type
  type: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'main', 'side', 'boss', 'event', 'guild']
  },
  
  // Difficulty and Requirements
  difficulty: {
    type: String,
    enum: ['easy', 'normal', 'hard', 'nightmare', 'legendary'],
    default: 'normal'
  },
  minLevel: {
    type: Number,
    default: 1
  },
  requiredClass: {
    type: String,
    default: null // null means any class can take it
  },
  
  // Objectives
  objectives: [{
    description: String,
    type: {
      type: String,
      enum: ['collect', 'defeat', 'reach', 'complete', 'custom']
    },
    target: mongoose.Schema.Types.Mixed, // What to collect/defeat/etc
    required: { type: Number, default: 1 }, // How many needed
    current: { type: Number, default: 0 } // Progress tracking
  }],
  
  // Rewards
  rewards: {
    experience: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    items: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      quantity: { type: Number, default: 1 },
      chance: { type: Number, default: 100 } // Drop chance percentage
    }],
    skills: [{
      name: String,
      experience: { type: Number, default: 0 }
    }],
    stats: {
      strength: { type: Number, default: 0 },
      agility: { type: Number, default: 0 },
      intelligence: { type: Number, default: 0 },
      vitality: { type: Number, default: 0 },
      luck: { type: Number, default: 0 }
    }
  },
  
  // Availability
  isActive: { type: Boolean, default: true },
  isRepeatable: { type: Boolean, default: false },
  cooldown: { type: Number, default: 0 }, // Hours before can repeat
  
  // Time Limits
  timeLimit: { type: Number, default: null }, // Hours to complete
  availableFrom: { type: Date, default: null },
  availableUntil: { type: Date, default: null },
  
  // Prerequisites
  prerequisites: {
    quests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
    level: { type: Number, default: 1 },
    skills: [{
      name: String,
      level: { type: Number, default: 1 }
    }],
    achievements: [String]
  },
  
  // Creator and Meta
  createdBy: {
    type: String,
    enum: ['system', 'admin', 'guild'],
    default: 'system'
  },
  guildId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guild' }, // For guild quests
  
  // Analytics
  stats: {
    timesCompleted: { type: Number, default: 0 },
    timesStarted: { type: Number, default: 0 },
    averageCompletionTime: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
questSchema.index({ type: 1, isActive: 1 });
questSchema.index({ difficulty: 1, minLevel: 1 });
questSchema.index({ 'rewards.experience': -1 });
questSchema.index({ availableFrom: 1, availableUntil: 1 });

// Virtual for total reward value
questSchema.virtual('rewardValue').get(function() {
  return this.rewards.experience + (this.rewards.gold * 0.1);
});

// Method to check if quest is available for user
questSchema.methods.isAvailableForUser = function(user) {
  // Check level requirement
  if (user.level < this.minLevel) return false;
  
  // Check class requirement
  if (this.requiredClass && user.class.currentClass !== this.requiredClass) return false;
  
  // Check time availability
  const now = new Date();
  if (this.availableFrom && now < this.availableFrom) return false;
  if (this.availableUntil && now > this.availableUntil) return false;
  
  // Check if quest is active
  if (!this.isActive) return false;
  
  return true;
};

// Method to calculate XP based on user level
questSchema.methods.getScaledRewards = function(userLevel) {
  const levelDiff = userLevel - this.minLevel;
  const scaleFactor = Math.max(0.1, 1 - (levelDiff * 0.1)); // Reduce rewards for overleveled players
  
  return {
    experience: Math.floor(this.rewards.experience * scaleFactor),
    gold: Math.floor(this.rewards.gold * scaleFactor),
    items: this.rewards.items, // Items don't scale
    skills: this.rewards.skills,
    stats: this.rewards.stats
  };
};

// Static method to generate daily quests
questSchema.statics.generateDailyQuests = async function(userLevel, userClass) {
  const dailyQuestTemplates = [
    {
      title: "Daily Learning Challenge",
      description: "Learn something new today",
      experience: 50,
      type: "daily"
    },
    {
      title: "Skill Practice",
      description: "Practice a skill for 30 minutes",
      experience: 75,
      type: "daily"
    },
    {
      title: "Health & Wellness",
      description: "Exercise or do a wellness activity",
      experience: 60,
      type: "daily"
    }
  ];
  
  // Return randomized daily quests based on templates
  return dailyQuestTemplates.map(template => ({
    ...template,
    rewards: {
      experience: Math.floor(template.experience * (1 + userLevel * 0.1)),
      gold: Math.floor(template.experience * 0.5),
      items: [],
      skills: [],
      stats: {}
    }
  }));
};

module.exports = mongoose.model('Quest', questSchema);