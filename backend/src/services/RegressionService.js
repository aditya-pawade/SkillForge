const User = require('../models/User');
const { ClassSystemHelper } = require('../data/classSystem');

/**
 * Regression System Service
 * Inspired by "Max-Level Player's 100th Regression"
 * Handles player regression, knowledge retention, and cycle bonuses
 */
class RegressionService {
  
  /**
   * Initiate a regression cycle for a user
   * Player goes back to level 1 but retains knowledge and gains prestige points
   */
  static async initiateRegression(userId, reason = 'voluntary') {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Can only regress if at significant level (level 50+)
    if (user.level < 50) {
      throw new Error('Must reach level 50+ to initiate regression');
    }
    
    // Calculate prestige points based on achievements
    const prestigePoints = this.calculatePrestigeReward(user);
    
    // Store milestone for this cycle
    const milestone = {
      cycle: user.regression.cycle,
      level: user.level,
      achievement: this.determineMajorAchievement(user),
      skillsLearned: user.skills.map(s => `${s.name} (Lv.${s.level})`),
      completedAt: new Date()
    };
    
    // Store retained skills (with mastery bonuses)
    const retainedSkills = this.calculateRetainedSkills(user);
    
    // Reset user stats but retain regression data
    user.level = 1;
    user.experience = 0;
    user.experienceToNext = 100;
    
    // Update regression data
    user.regression.totalCycles += 1;
    user.regression.cycle += 1;
    user.regression.maxLevelReached = Math.max(
      user.regression.maxLevelReached, 
      milestone.level
    );
    user.regression.prestigePoints += prestigePoints;
    user.regression.retainedKnowledge += this.calculateKnowledgePoints(user);
    user.regression.milestones.push(milestone);
    user.regression.retainedSkills = retainedSkills;
    
    // Reset skills but apply retained knowledge bonuses
    user.skills = this.applyRegressionSkillBonuses(user.skills, retainedSkills);
    
    // Reset stats but apply small permanent bonuses
    const statBonuses = this.calculatePermanentStatBonuses(milestone.level);
    user.stats.strength += statBonuses.strength;
    user.stats.agility += statBonuses.agility;
    user.stats.intelligence += statBonuses.intelligence;
    user.stats.vitality += statBonuses.vitality;
    user.stats.luck += statBonuses.luck;
    
    await user.save();
    
    return {
      success: true,
      message: `Regression initiated! Welcome to cycle ${user.regression.cycle}`,
      rewards: {
        prestigePoints,
        knowledgeGained: this.calculateKnowledgePoints(user),
        retainedSkills: retainedSkills.length,
        statBonuses
      },
      newCycle: user.regression.cycle
    };
  }
  
  /**
   * Calculate prestige points reward based on user achievements
   */
  static calculatePrestigeReward(user) {
    let prestige = 0;
    
    // Base prestige from level
    prestige += Math.floor(user.level * 0.5);
    
    // Bonus from high-level skills
    user.skills.forEach(skill => {
      if (skill.level >= 8) prestige += 10;
      if (skill.level >= 10) prestige += 15;
    });
    
    // Bonus from achievements
    prestige += user.achievements.length * 5;
    
    // Bonus from guild leadership
    if (user.guild?.role === 'leader') prestige += 25;
    
    // First-time level milestones
    if (user.level >= 100 && user.regression.maxLevelReached < 100) prestige += 100;
    if (user.level >= 75 && user.regression.maxLevelReached < 75) prestige += 50;
    
    return prestige;
  }
  
  /**
   * Calculate knowledge points gained from this cycle
   */
  static calculateKnowledgePoints(user) {
    let knowledge = 0;
    
    // Knowledge from levels
    knowledge += user.level;
    
    // Knowledge from skills
    user.skills.forEach(skill => {
      knowledge += skill.level * 2;
      if (skill.stats?.timesUsed > 100) knowledge += 10;
    });
    
    // Knowledge from completed quests
    knowledge += user.quests.completed.length * 3;
    
    return knowledge;
  }
  
  /**
   * Determine skills that carry over with bonuses
   */
  static calculateRetainedSkills(user) {
    const retained = [];
    
    user.skills.forEach(skill => {
      if (skill.level >= 5) { // Only skills level 5+ are retained
        const existing = user.regression.retainedSkills.find(rs => rs.skillName === skill.name);
        const masteryBonus = existing ? existing.masteryBonus + 1 : 1;
        
        retained.push({
          skillName: skill.name,
          level: Math.floor(skill.level * 0.3), // Retain 30% of skill level
          cycle: user.regression.cycle,
          masteryBonus
        });
      }
    });
    
    return retained;
  }
  
  /**
   * Apply regression bonuses to skills on new cycle
   */
  static applyRegressionSkillBonuses(currentSkills, retainedSkills) {
    return currentSkills.map(skill => {
      const retained = retainedSkills.find(rs => rs.skillName === skill.name);
      
      if (retained) {
        // Apply retained level and mastery bonus
        skill.level = Math.max(skill.level, retained.level);
        skill.experience = skill.level * 100; // Fast start
        
        // Add mastery bonus to skill
        if (!skill.mastery) skill.mastery = { masteryPoints: 0, rank: 'Novice' };
        skill.mastery.masteryPoints += retained.masteryBonus * 50;
        
        // Update mastery rank based on points
        if (skill.mastery.masteryPoints >= 500) skill.mastery.rank = 'Grandmaster';
        else if (skill.mastery.masteryPoints >= 300) skill.mastery.rank = 'Master';
        else if (skill.mastery.masteryPoints >= 200) skill.mastery.rank = 'Expert';
        else if (skill.mastery.masteryPoints >= 100) skill.mastery.rank = 'Apprentice';
      }
      
      return skill;
    });
  }
  
  /**
   * Calculate permanent stat bonuses from regression
   */
  static calculatePermanentStatBonuses(maxLevel) {
    const bonus = Math.floor(maxLevel / 25); // 1 point per 25 levels
    
    return {
      strength: bonus,
      agility: bonus,
      intelligence: bonus,
      vitality: bonus,
      luck: bonus
    };
  }
  
  /**
   * Determine major achievement for the cycle
   */
  static determineMajorAchievement(user) {
    if (user.level >= 100) return "Reached Max Level";
    if (user.level >= 75) return "Master Level Achieved";
    if (user.level >= 50) return "Advanced Player";
    if (user.guild?.role === 'leader') return "Guild Leadership";
    if (user.skills.some(s => s.level >= 10)) return "Skill Mastery";
    return "Knowledge Seeker";
  }
  
  /**
   * Get regression bonuses for user's current cycle
   */
  static getRegressionBonuses(user) {
    const bonuses = {
      experienceMultiplier: 1.0,
      knowledgeMultiplier: 1.0,
      skillLearningRate: 1.0,
      questRewardBonus: 1.0,
      specialAbilities: []
    };
    
    // Bonuses based on total cycles completed
    if (user.regression.totalCycles >= 1) {
      bonuses.experienceMultiplier += 0.1;
      bonuses.skillLearningRate += 0.2;
    }
    
    if (user.regression.totalCycles >= 5) {
      bonuses.knowledgeMultiplier += 0.5;
      bonuses.questRewardBonus += 0.3;
      bonuses.specialAbilities.push("Foresight"); // See future quest rewards
    }
    
    if (user.regression.totalCycles >= 10) {
      bonuses.experienceMultiplier += 0.3;
      bonuses.specialAbilities.push("Time Mastery"); // Reduced cooldowns
    }
    
    if (user.regression.totalCycles >= 20) {
      bonuses.specialAbilities.push("Perfect Recall"); // Access to all previous cycle knowledge
    }
    
    // Bonuses based on retained knowledge
    if (user.regression.retainedKnowledge >= 1000) {
      bonuses.skillLearningRate += 0.5;
      bonuses.specialAbilities.push("Rapid Learning");
    }
    
    if (user.regression.retainedKnowledge >= 5000) {
      bonuses.specialAbilities.push("Knowledge Bank"); // Can share knowledge with guild
    }
    
    return bonuses;
  }
  
  /**
   * Check if user can access special regression content
   */
  static checkRegressionUnlocks(user) {
    const unlocks = {
      specialRaids: [],
      uniqueSkills: [],
      advancedClasses: [],
      legendaryQuests: []
    };
    
    // Unlocks based on regression cycles
    if (user.regression.totalCycles >= 3) {
      unlocks.specialRaids.push("Time Rift Dungeon");
      unlocks.uniqueSkills.push("Temporal Insight");
    }
    
    if (user.regression.totalCycles >= 5) {
      unlocks.advancedClasses.push("Regression Master");
      unlocks.legendaryQuests.push("The 100th Cycle");
    }
    
    if (user.regression.totalCycles >= 10) {
      unlocks.specialRaids.push("Causal Loop Chamber");
      unlocks.uniqueSkills.push("Perfect Prediction");
    }
    
    // Unlocks based on max level reached
    if (user.regression.maxLevelReached >= 100) {
      unlocks.legendaryQuests.push("Beyond the Cycle");
      unlocks.specialRaids.push("EX-Rank: Infinity Tower");
    }
    
    return unlocks;
  }
  
  /**
   * Use retained knowledge to boost current progress
   */
  static async useRetainedKnowledge(userId, knowledgeAmount, targetType, targetId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    if (user.regression.retainedKnowledge < knowledgeAmount) {
      throw new Error('Insufficient retained knowledge');
    }
    
    let result = {};
    
    switch (targetType) {
      case 'skill':
        result = await this.boostSkillWithKnowledge(user, targetId, knowledgeAmount);
        break;
      case 'quest':
        result = await this.getQuestHint(user, targetId, knowledgeAmount);
        break;
      case 'training':
        result = await this.accelerateTraining(user, knowledgeAmount);
        break;
      default:
        throw new Error('Invalid knowledge usage target');
    }
    
    // Deduct knowledge points
    user.regression.retainedKnowledge -= knowledgeAmount;
    await user.save();
    
    return result;
  }
  
  /**
   * Boost skill using retained knowledge
   */
  static async boostSkillWithKnowledge(user, skillName, knowledgeAmount) {
    const skill = user.skills.find(s => s.name === skillName);
    if (!skill) throw new Error('Skill not found');
    
    // Convert knowledge to skill experience
    const expGain = knowledgeAmount * 10;
    skill.experience += expGain;
    
    // Auto-level if enough experience
    while (skill.experience >= (skill.level * 100)) {
      skill.experience -= (skill.level * 100);
      skill.level += 1;
    }
    
    return {
      success: true,
      skillName,
      expGained: expGain,
      newLevel: skill.level,
      message: `Used retained knowledge to boost ${skillName}!`
    };
  }
}

module.exports = RegressionService;