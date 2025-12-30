const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  tag: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    minlength: 2,
    maxlength: 5
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // Guild Stats
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  experienceToNext: { type: Number, default: 1000 },
  
  // Membership
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: ['member', 'officer', 'co-leader', 'leader'],
      default: 'member'
    },
    joinedAt: { type: Date, default: Date.now },
    contribution: { type: Number, default: 0 }, // Total contribution to guild
    weeklyContribution: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  }],
  
  // Settings
  settings: {
    maxMembers: { type: Number, default: 50 },
    joinPolicy: {
      type: String,
      enum: ['open', 'approval', 'invite-only'],
      default: 'approval'
    },
    minLevelToJoin: { type: Number, default: 1 },
    allowedClasses: [String], // Empty array means all classes allowed
    isRecruiting: { type: Boolean, default: true }
  },
  
  // Guild Features
  facilities: [{
    type: {
      type: String,
      enum: ['training-ground', 'library', 'workshop', 'treasury', 'hall']
    },
    level: { type: Number, default: 1 },
    effects: mongoose.Schema.Types.Mixed // Bonuses this facility provides
  }],
  
  // Resources
  treasury: {
    gold: { type: Number, default: 0 },
    materials: mongoose.Schema.Types.Mixed,
    items: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      quantity: { type: Number, default: 1 },
      donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      donatedAt: { type: Date, default: Date.now }
    }]
  },
  
  // Guild Quests and Events
  activeQuests: [{
    questId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
    startedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    contributors: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      contribution: { type: Number, default: 0 }
    }]
  }],
  
  // Guild Wars/Competition
  warStats: {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    rating: { type: Number, default: 1000 },
    lastWarAt: Date
  },
  
  // Achievements
  achievements: [{
    achievementId: String,
    unlockedAt: { type: Date, default: Date.now },
    title: String,
    description: String,
    unlockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Visual Customization
  customization: {
    emblem: String, // URL to guild emblem image
    color: { type: String, default: '#4CAF50' },
    banner: String, // URL to guild banner
    motto: { type: String, maxlength: 100 }
  },
  
  // Communication
  announcements: [{
    title: String,
    message: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
    pinned: { type: Boolean, default: false }
  }],
  
  // Analytics
  stats: {
    totalMembersAllTime: { type: Number, default: 0 },
    questsCompleted: { type: Number, default: 0 },
    totalContribution: { type: Number, default: 0 },
    averageLevel: { type: Number, default: 1 }
  },
  
  // System
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Indexes
guildSchema.index({ name: 1 });
guildSchema.index({ tag: 1 });
guildSchema.index({ level: -1, experience: -1 });
guildSchema.index({ 'settings.joinPolicy': 1, 'settings.isRecruiting': 1 });

// Virtual for member count
guildSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for active member count (active within last 7 days)
guildSchema.virtual('activeMemberCount').get(function() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return this.members.filter(member => member.lastActive > weekAgo).length;
});

// Method to add experience and handle guild leveling
guildSchema.methods.addExperience = function(xp) {
  this.experience += xp;
  
  while (this.experience >= this.experienceToNext) {
    this.experience -= this.experienceToNext;
    this.level += 1;
    
    // Level up bonuses
    this.settings.maxMembers += 5;
    this.treasury.gold += this.level * 100;
    
    // Calculate next level XP requirement
    this.experienceToNext = Math.floor(1000 * Math.pow(1.3, this.level - 1));
  }
};

// Method to check if user can join
guildSchema.methods.canUserJoin = function(user) {
  // Check if guild is active and recruiting
  if (!this.isActive || !this.settings.isRecruiting) return false;
  
  // Check member limit
  if (this.members.length >= this.settings.maxMembers) return false;
  
  // Check level requirement
  if (user.level < this.settings.minLevelToJoin) return false;
  
  // Check class restriction
  if (this.settings.allowedClasses.length > 0) {
    if (!this.settings.allowedClasses.includes(user.class.currentClass)) return false;
  }
  
  // Check if user is already a member
  const isMember = this.members.some(member => 
    member.userId.toString() === user._id.toString()
  );
  if (isMember) return false;
  
  return true;
};

// Method to get member by user ID
guildSchema.methods.getMember = function(userId) {
  return this.members.find(member => 
    member.userId.toString() === userId.toString()
  );
};

// Method to update weekly contributions (called by cron job)
guildSchema.methods.resetWeeklyContributions = function() {
  this.members.forEach(member => {
    member.weeklyContribution = 0;
  });
};

// Static method to find guilds available for user
guildSchema.statics.findAvailableForUser = function(user) {
  return this.find({
    isActive: true,
    'settings.isRecruiting': true,
    'settings.minLevelToJoin': { $lte: user.level },
    $expr: { $lt: [{ $size: "$members" }, "$settings.maxMembers"] },
    'members.userId': { $ne: user._id }
  });
};

module.exports = mongoose.model('Guild', guildSchema);