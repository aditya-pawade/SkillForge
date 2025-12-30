// Create tables for SkillForge database
const mysql = require('mysql2/promise');

async function createTables() {
  console.log('🔧 Creating SkillForge database tables...');
  
  try {
    // Load environment variables
    require('dotenv').config();
    
    // Connect to the skillforge database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'skillforge',
      port: parseInt(process.env.DB_PORT) || 3306
    });

    console.log('✅ Connected to skillforge database');

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        
        level INT DEFAULT 1,
        experience INT DEFAULT 0,
        currentClass VARCHAR(50) DEFAULT NULL,
        
        background_declaration TEXT,
        
        adaptability INT DEFAULT 50,
        resilience INT DEFAULT 50,
        charisma INT DEFAULT 50,
        health INT DEFAULT 50,
        efficiency INT DEFAULT 50,
        serendipity INT DEFAULT 50,
        
        system_rune TEXT,
        
        guild_id INT DEFAULT NULL,
        guild_role VARCHAR(20) DEFAULT 'member',
        
        regression_count INT DEFAULT 0,
        total_experience_gained BIGINT DEFAULT 0,
        peak_level_achieved INT DEFAULT 1,
        classes_unlocked TEXT,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL,
        last_login DATETIME NULL
      )
    `);
    console.log('✅ Users table created');

    // Create guilds table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS guilds (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        leader_id INT,
        level INT DEFAULT 1,
        experience INT DEFAULT 0,
        member_count INT DEFAULT 0,
        max_members INT DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_leader (leader_id)
      )
    `);
    console.log('✅ Guilds table created');

    // Create quests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        difficulty ENUM('E', 'D', 'C', 'B', 'A', 'S') DEFAULT 'E',
        experience_reward INT NOT NULL,
        requirements TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Quests table created');

    // Create user_quests table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_quests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        quest_id INT NOT NULL,
        status ENUM('active', 'completed', 'failed') DEFAULT 'active',
        progress TEXT,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        INDEX idx_user (user_id),
        INDEX idx_quest (quest_id)
      )
    `);
    console.log('✅ User quests table created');

    // Insert some sample quests
    await connection.execute(`
      INSERT IGNORE INTO quests (title, description, difficulty, experience_reward, requirements) VALUES
      ('First Steps', 'Complete your background declaration and unlock your first class', 'E', 100, '{"level": 1}'),
      ('Learning Path', 'Gain 500 experience points in your chosen field', 'D', 250, '{"level": 2}'),
      ('Skill Development', 'Complete 3 learning sessions', 'D', 300, '{"level": 3}'),
      ('Team Player', 'Join or create a guild', 'C', 500, '{"level": 5}'),
      ('Knowledge Seeker', 'Reach level 10 and unlock advanced classes', 'B', 1000, '{"level": 9}')
    `);
    console.log('✅ Sample quests inserted');

    await connection.end();
    
    console.log('🎉 Database tables created successfully!');
    console.log('📊 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Table creation failed:', error.message);
    console.log('💡 Error details:', error);
    process.exit(1);
  }
}

// Run the table creation
createTables();