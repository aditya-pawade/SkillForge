// Database setup script for SkillForge
const mysql = require('mysql2/promise');

async function setupDatabase() {
  console.log('🔧 Setting up SkillForge database...');
  
  try {
    // Connect as root to create database and user
    // Set your MySQL root password here
    const rootPassword = process.env.MYSQL_ROOT_PASSWORD || 'your_root_password_here';
    
    const rootConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: rootPassword,
      port: 3306
    });

    console.log('✅ Connected to MySQL as root');

    // Create database
    await rootConnection.execute('CREATE DATABASE IF NOT EXISTS skillforge');
    console.log('✅ Database "skillforge" created');

    // Create user (skip if exists)
    try {
      await rootConnection.execute("CREATE USER 'skillforge_user'@'localhost' IDENTIFIED BY 'skillforge_password_2024'");
      console.log('✅ User "skillforge_user" created');
    } catch (err) {
      if (err.code === 'ER_CANNOT_USER') {
        console.log('⚠️  User "skillforge_user" already exists');
      } else {
        throw err;
      }
    }

    // Grant privileges
    await rootConnection.execute("GRANT ALL PRIVILEGES ON skillforge.* TO 'skillforge_user'@'localhost'");
    await rootConnection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges granted');

    await rootConnection.end();

    // Now connect as the new user to create tables
    const userConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'skillforge_user',
      password: 'skillforge_password_2024',
      database: 'skillforge'
    });

    console.log('✅ Connected as skillforge_user');

    // Create users table
    await userConnection.execute(`
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `);
    console.log('✅ Users table created');

    // Create other tables
    await userConnection.execute(`
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
        FOREIGN KEY (leader_id) REFERENCES users(id)
      )
    `);
    console.log('✅ Guilds table created');

    await userConnection.execute(`
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

    await userConnection.execute(`
      CREATE TABLE IF NOT EXISTS user_quests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        quest_id INT NOT NULL,
        status ENUM('active', 'completed', 'failed') DEFAULT 'active',
        progress TEXT,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (quest_id) REFERENCES quests(id)
      )
    `);
    console.log('✅ User quests table created');

    await userConnection.end();
    
    console.log('🎉 Database setup completed successfully!');
    console.log('📊 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Please check your MySQL root password');
    }
    process.exit(1);
  }
}

// Run the setup
setupDatabase();