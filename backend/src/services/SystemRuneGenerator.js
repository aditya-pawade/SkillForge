// System Rune Generator for SkillForge
// Generates unique System Runes with various ranks and abilities

class SystemRuneGenerator {
  // Rank probabilities (percentage chance)
  static RANK_PROBABILITIES = {
    'F': 30.0,
    'E': 25.0,
    'D': 20.0,
    'C': 12.0,
    'B': 7.0,
    'A': 3.5,
    'S': 1.5,
    'SS': 0.8,
    'SSS': 0.15,
    'EX': 0.05  // 1 in 2000 chance
  };
  
  // Rune categories with their focus areas
  static CATEGORIES = {
    learning: {
      name: 'Learning',
      description: 'Enhances knowledge acquisition and skill development',
      statAffinity: ['intelligence', 'agility']
    },
    execution: {
      name: 'Execution', 
      description: 'Improves task completion and consistency',
      statAffinity: ['strength', 'health']
    },
    social: {
      name: 'Social',
      description: 'Boosts communication and leadership abilities', 
      statAffinity: ['charisma', 'serendipity']
    },
    resilience: {
      name: 'Resilience',
      description: 'Provides mental stamina and burnout resistance',
      statAffinity: ['health', 'strength']
    },
    insight: {
      name: 'Insight',
      description: 'Grants analytical depth and creative thinking',
      statAffinity: ['intelligence', 'serendipity']
    },
    fortune: {
      name: 'Fortune',
      description: 'Increases opportunities and favorable outcomes',
      statAffinity: ['serendipity', 'charisma']
    }
  };
  
  /**
   * Generate a unique system rune for a new player
   */
  static generateUniqueRune(userId = null) {
    const rank = this.rollRuneRank();
    const category = this.rollRuneCategory();
    const runeData = this.generateRuneData(rank, category);
    
    return {
      id: this.generateRuneId(userId, rank, category),
      name: runeData.name,
      description: runeData.description,
      rank,
      category,
      abilities: runeData.abilities,
      evolution: {
        canEvolve: rank !== 'EX', // EX rank cannot evolve further
        requirements: this.generateEvolutionRequirements(rank, category),
        nextRank: this.getNextRank(rank),
        evolutionHistory: []
      },
      stats: {
        activations: 0,
        totalEffect: 0,
        averageImpact: 0
      }
    };
  }
  
  /**
   * Roll for rune rank based on probabilities
   */
  static rollRuneRank() {
    const roll = Math.random() * 100;
    let cumulative = 0;
    
    for (const [rank, probability] of Object.entries(this.RANK_PROBABILITIES)) {
      cumulative += probability;
      if (roll <= cumulative) {
        return rank;
      }
    }
    
    return 'F'; // Fallback
  }
  
  /**
   * Roll for rune category
   */
  static rollRuneCategory() {
    const categories = Object.keys(this.CATEGORIES);
    return categories[Math.floor(Math.random() * categories.length)];
  }
  
  /**
   * Generate unique rune ID
   */
  static generateRuneId(userId, rank, category) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const userIdPart = userId ? userId.toString().slice(-6) : 'NEW_USER';
    return `RUNE_${userIdPart}_${rank}_${category.toUpperCase()}_${timestamp}_${random}`;
  }
  
  /**
   * Generate rune data based on rank and category
   */
  static generateRuneData(rank, category) {
    const templates = this.getRuneTemplates(category);
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const powerMultiplier = this.getRankPowerMultiplier(rank);
    const abilities = this.scaleAbilities(template.abilities, powerMultiplier, rank);
    
    return {
      name: `${template.prefix} ${this.getRankTitle(rank)} ${template.suffix}`,
      description: `${template.description} (${rank}-Rank)`,
      abilities
    };
  }
  
  /**
   * Get rune templates for each category
   */
  static getRuneTemplates(category) {
    const templates = {
      learning: [
        {
          prefix: "Scholar's",
          suffix: 'Codex',
          description: 'Accelerates learning and knowledge retention',
          abilities: [
            {
              name: 'Rapid Acquisition',
              description: 'Gain bonus XP from learning activities',
              effect: { type: 'xp_multiplier', value: 1.2 },
              cooldown: 0
            },
            {
              name: 'Memory Palace',
              description: 'Retain more information from completed quests',
              effect: { type: 'knowledge_retention', value: 0.15 },
              cooldown: 60
            }
          ]
        }
      ],
      
      execution: [
        {
          prefix: "Executor's",
          suffix: 'Will',
          description: 'Enhances task completion and consistency',
          abilities: [
            {
              name: 'Unwavering Focus',
              description: 'Immune to distraction penalties for 1 hour',
              effect: { type: 'immunity', condition: 'distraction' },
              cooldown: 180
            }
          ]
        }
      ],
      
      social: [
        {
          prefix: "Diplomat's",
          suffix: 'Charm',
          description: 'Enhances social interactions and team coordination',
          abilities: [
            {
              name: 'Team Synergy',
              description: "Boost entire guild's performance temporarily",
              effect: { type: 'guild_buff', value: 1.15 },
              cooldown: 240
            }
          ]
        }
      ]
    };
    
    return templates[category] || templates.learning;
  }
  
  /**
   * Get power multiplier based on rank
   */
  static getRankPowerMultiplier(rank) {
    const multipliers = {
      'F': 0.8,
      'E': 0.9,
      'D': 1.0,
      'C': 1.2,
      'B': 1.5,
      'A': 2.0,
      'S': 3.0,
      'SS': 4.5,
      'SSS': 7.0,
      'EX': 10.0
    };
    
    return multipliers[rank] || 1.0;
  }
  
  /**
   * Get rank title for rune naming
   */
  static getRankTitle(rank) {
    const titles = {
      'F': 'Fledgling',
      'E': 'Emerging', 
      'D': 'Developing',
      'C': 'Capable',
      'B': 'Brilliant',
      'A': 'Apex',
      'S': 'Supreme',
      'SS': 'Transcendent',
      'SSS': 'Mythical',
      'EX': 'UNLIMITED'
    };
    
    return titles[rank] || 'Unknown';
  }
  
  /**
   * Scale abilities based on power multiplier and rank
   */
  static scaleAbilities(abilities, multiplier, rank) {
    return abilities.map(ability => {
      const scaledAbility = { ...ability };
      
      // Scale numerical effects
      if (scaledAbility.effect.value) {
        scaledAbility.effect.value *= multiplier;
      }
      if (scaledAbility.effect.multiplier) {
        scaledAbility.effect.multiplier = 1 + ((scaledAbility.effect.multiplier - 1) * multiplier);
      }
      
      // Add rank-specific enhancements
      if (['S', 'SS', 'SSS', 'EX'].includes(rank)) {
        scaledAbility.enhanced = true;
        scaledAbility.description += ' [Enhanced]';
      }
      
      if (rank === 'EX') {
        scaledAbility.unlimited = true;
        scaledAbility.description += ' [UNLIMITED POTENTIAL]';
        scaledAbility.cooldown = Math.max(0, scaledAbility.cooldown * 0.5); // Half cooldown
      }
      
      return scaledAbility;
    });
  }
  
  /**
   * Generate evolution requirements
   */
  static generateEvolutionRequirements(currentRank, category) {
    return [
      {
        type: 'level',
        value: 10,
        completed: false
      },
      {
        type: 'consistency',
        value: { days: 7, category: 'learning' },
        completed: false
      }
    ];
  }
  
  /**
   * Get next rank in evolution chain
   */
  static getNextRank(currentRank) {
    const progression = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'EX'];
    const currentIndex = progression.indexOf(currentRank);
    
    return currentIndex < progression.length - 1 ? progression[currentIndex + 1] : null;
  }
}

module.exports = SystemRuneGenerator;