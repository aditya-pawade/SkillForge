// User model for MySQL database
const { getDB } = require('../config/database');
const bcrypt = require('bcryptjs');
const SystemRuneGenerator = require('../services/SystemRuneGenerator');

class User {
  constructor(data = {}) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.level = data.level || 1;
    this.experience = data.experience || 0;
    
    // ARCHES Stats
    this.adaptability = data.adaptability || 0;
    this.resilience = data.resilience || 0;
    this.charisma = data.charisma || 0;
    this.health = data.health || 0;
    this.efficiency = data.efficiency || 0;
    this.serendipity = data.serendipity || 0;
    
    // Background Declaration
    this.backgroundDeclaration = typeof data.background_declaration === 'string' 
      ? JSON.parse(data.background_declaration) 
      : data.background_declaration || null;
    this.backgroundAnalyzed = data.background_analyzed || false;
    
    // System Rune
    this.systemRune = typeof data.system_rune === 'string' 
      ? JSON.parse(data.system_rune) 
      : data.system_rune || null;
    
    // Class System
    this.availableClasses = typeof data.available_classes === 'string' 
      ? JSON.parse(data.available_classes) 
      : data.available_classes || [];
    this.selectedClass = data.selected_class || null;
    this.classUnlockedAt = data.class_unlocked_at || null;
    
    // Regression System
    this.regressionCount = data.regression_count || 0;
    this.previousMaxLevel = data.previous_max_level || 0;
    this.retainedMemories = typeof data.retained_memories === 'string' 
      ? JSON.parse(data.retained_memories) 
      : data.retained_memories || [];
    this.regressionBonuses = typeof data.regression_bonuses === 'string' 
      ? JSON.parse(data.regression_bonuses) 
      : data.regression_bonuses || {};
    
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const db = await getDB();
    
    try {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // Generate System Rune
      const systemRune = SystemRuneGenerator.generateUniqueRune();
      
      // Calculate initial ARCHES stats based on background
      const initialStats = this.calculateInitialStats(userData.backgroundDeclaration);
      
      const [result] = await db.execute(`
        INSERT INTO users (
          username, email, password, level, experience,
          adaptability, resilience, charisma, health, efficiency, serendipity,
          background_declaration, system_rune,
          regression_count, total_experience_gained, peak_level_achieved, classes_unlocked
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userData.username,
        userData.email,
        hashedPassword,
        1, // level
        0, // experience
        initialStats.adaptability,
        initialStats.resilience,
        initialStats.charisma,
        initialStats.health,
        initialStats.efficiency,
        initialStats.serendipity,
        JSON.stringify(userData.backgroundDeclaration),
        JSON.stringify(systemRune),
        0, // regression_count
        0, // total_experience_gained
        1, // peak_level_achieved
        JSON.stringify([]) // classes_unlocked
      ]);

      return await this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const db = await getDB();
    
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return new User(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const db = await getDB();
    
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return new User(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    const db = await getDB();
    
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return new User(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email OR username (for registration checks)
  static async findOne(query) {
    const db = await getDB();
    
    try {
      // Handle MongoDB-style $or query for compatibility
      if (query.$or) {
        const conditions = query.$or;
        let sqlQuery = 'SELECT * FROM users WHERE ';
        const params = [];
        const whereClauses = [];
        
        conditions.forEach(condition => {
          if (condition.email) {
            whereClauses.push('email = ?');
            params.push(condition.email);
          }
          if (condition.username) {
            whereClauses.push('username = ?');
            params.push(condition.username);
          }
        });
        
        sqlQuery += whereClauses.join(' OR ');
        const [rows] = await db.execute(sqlQuery, params);
        
        if (rows.length === 0) {
          return null;
        }
        
        return new User(rows[0]);
      }
      
      // Handle simple query objects
      const whereClause = [];
      const params = [];
      
      Object.entries(query).forEach(([key, value]) => {
        whereClause.push(`${key} = ?`);
        params.push(value);
      });
      
      const sqlQuery = `SELECT * FROM users WHERE ${whereClause.join(' AND ')}`;
      const [rows] = await db.execute(sqlQuery, params);
      
      if (rows.length === 0) {
        return null;
      }
      
      return new User(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Save/update user
  async save() {
    const db = await getDB();
    
    try {
      if (this.id) {
        // Update existing user
        await db.execute(`
          UPDATE users SET 
            username = ?, email = ?, level = ?, experience = ?,
            agility = ?, resilience = ?, charisma = ?, health = ?, efficiency = ?, serendipity = ?,
            background_declaration = ?, background_analyzed = ?, system_rune = ?,
            available_classes = ?, selected_class = ?, class_unlocked_at = ?,
            regression_count = ?, previous_max_level = ?, retained_memories = ?, regression_bonuses = ?
          WHERE id = ?
        `, [
          this.username, this.email, this.level, this.experience,
          this.agility, this.resilience, this.charisma, this.health, this.efficiency, this.serendipity,
          JSON.stringify(this.backgroundDeclaration), this.backgroundAnalyzed, JSON.stringify(this.systemRune),
          JSON.stringify(this.availableClasses), this.selectedClass, this.classUnlockedAt,
          this.regressionCount, this.previousMaxLevel, JSON.stringify(this.retainedMemories), JSON.stringify(this.regressionBonuses),
          this.id
        ]);
      } else {
        throw new Error('Cannot save user without ID. Use User.create() for new users.');
      }
      
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Calculate initial ARCHES stats based on background declaration
  static calculateInitialStats(backgroundDeclaration) {
    const stats = {
      adaptability: 5,      // Base stats
      resilience: 5,
      charisma: 5,
      health: 5,
      efficiency: 5,
      serendipity: 5
    };

    if (!backgroundDeclaration) return stats;

    // Analyze learning subjects
    if (backgroundDeclaration.subjects && backgroundDeclaration.subjects.length > 0) {
      backgroundDeclaration.subjects.forEach(subject => {
        switch (subject.toLowerCase()) {
          case 'programming':
          case 'computer science':
            stats.adaptability += 2;
            stats.efficiency += 1;
            break;
          case 'mathematics':
          case 'physics':
            stats.adaptability += 1;
            stats.efficiency += 2;
            break;
          case 'art':
          case 'design':
            stats.serendipity += 2;
            stats.charisma += 1;
            break;
          case 'sports':
          case 'fitness':
            stats.health += 2;
            stats.resilience += 1;
            break;
          case 'psychology':
          case 'sociology':
            stats.charisma += 2;
            stats.serendipity += 1;
            break;
        }
      });
    }

    // Analyze career goals
    if (backgroundDeclaration.careerGoals && backgroundDeclaration.careerGoals.length > 0) {
      backgroundDeclaration.careerGoals.forEach(career => {
        switch (career.toLowerCase()) {
          case 'software engineer':
          case 'developer':
            stats.adaptability += 1;
            stats.efficiency += 1;
            break;
          case 'teacher':
          case 'educator':
            stats.charisma += 1;
            stats.resilience += 1;
            break;
          case 'entrepreneur':
          case 'business owner':
            stats.charisma += 1;
            stats.serendipity += 1;
            break;
          case 'researcher':
          case 'scientist':
            stats.adaptability += 1;
            stats.efficiency += 1;
            break;
        }
      });
    }

    // Analyze current activities
    if (backgroundDeclaration.currentActivities && backgroundDeclaration.currentActivities.length > 0) {
      backgroundDeclaration.currentActivities.forEach(activity => {
        if (activity.toLowerCase().includes('study')) {
          stats.efficiency += 1;
        }
        if (activity.toLowerCase().includes('exercise')) {
          stats.health += 1;
        }
        if (activity.toLowerCase().includes('social')) {
          stats.charisma += 1;
        }
        if (activity.toLowerCase().includes('creative')) {
          stats.serendipity += 1;
        }
      });
    }

    return stats;
  }

  // Get leaderboard data
  static async getLeaderboard(limit = 10) {
    const db = await getDB();
    
    try {
      const [rows] = await db.execute(`
        SELECT id, username, level, experience, selected_class, regression_count
        FROM users 
        ORDER BY level DESC, experience DESC 
        LIMIT ?
      `, [limit]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update class selection
  async selectClass(className) {
    this.selectedClass = className;
    this.classUnlockedAt = new Date();
    await this.save();
  }

  // Add experience and handle level up
  async addExperience(expGain) {
    this.experience += expGain;
    
    // Check for level up (100 exp per level)
    const newLevel = Math.floor(this.experience / 100) + 1;
    if (newLevel > this.level) {
      const levelsGained = newLevel - this.level;
      this.level = newLevel;
      
      // Award stat points (2 points per level)
      const statPoints = levelsGained * 2;
      this.distributeStatPoints(statPoints);
      
      await this.save();
      return { leveledUp: true, newLevel: this.level, statPoints };
    }
    
    await this.save();
    return { leveledUp: false };
  }

  // Distribute stat points based on class and background
  distributeStatPoints(points) {
    // Simple distribution for now - can be made more sophisticated
    const statNames = ['agility', 'resilience', 'charisma', 'health', 'efficiency', 'serendipity'];
    
    for (let i = 0; i < points; i++) {
      const randomStat = statNames[Math.floor(Math.random() * statNames.length)];
      this[randomStat] += 1;
    }
  }

  // Convert to safe JSON (without sensitive data)
  toJSON() {
    const { password, ...safeData } = this;
    return safeData;
  }
}

module.exports = User;