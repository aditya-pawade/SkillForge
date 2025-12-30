-- SkillForge Database Setup Script
-- Run this in your MySQL command line as root user

-- Create the database
CREATE DATABASE IF NOT EXISTS skillforge;

-- Create a dedicated user for the application
CREATE USER IF NOT EXISTS 'skillforge_user'@'localhost' IDENTIFIED BY 'skillforge_password_2024';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON skillforge.* TO 'skillforge_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Use the new database
USE skillforge;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Basic Info
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    currentClass VARCHAR(50) DEFAULT NULL,
    
    -- Background Declaration (JSON stored as TEXT)
    background_declaration TEXT,
    
    -- ARCHES Stats
    adaptability INT DEFAULT 50,
    resilience INT DEFAULT 50,
    charisma INT DEFAULT 50,
    health INT DEFAULT 50,
    efficiency INT DEFAULT 50,
    serendipity INT DEFAULT 50,
    
    -- System Rune (JSON stored as TEXT)
    system_rune TEXT,
    
    -- Guild Info
    guild_id INT DEFAULT NULL,
    guild_role VARCHAR(20) DEFAULT 'member',
    
    -- Regression System
    regression_count INT DEFAULT 0,
    original_timeline_data TEXT,
    
    -- Available Classes (JSON array stored as TEXT)
    available_classes TEXT,
    class_unlock_level INT DEFAULT 10,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_guild ON users(guild_id);

-- Create quests table
CREATE TABLE IF NOT EXISTS quests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('daily', 'weekly', 'special', 'story') DEFAULT 'daily',
    difficulty ENUM('easy', 'medium', 'hard', 'nightmare') DEFAULT 'easy',
    experience_reward INT DEFAULT 100,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_quests table (for tracking user quest progress)
CREATE TABLE IF NOT EXISTS user_quests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quest_id INT NOT NULL,
    status ENUM('assigned', 'in_progress', 'completed', 'failed') DEFAULT 'assigned',
    progress_data TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

-- Create guilds table
CREATE TABLE IF NOT EXISTS guilds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    member_limit INT DEFAULT 50,
    leader_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create raids table
CREATE TABLE IF NOT EXISTS raids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty ENUM('normal', 'hard', 'nightmare', 'chaos') DEFAULT 'normal',
    min_level INT DEFAULT 1,
    max_participants INT DEFAULT 8,
    status ENUM('scheduled', 'active', 'completed', 'cancelled') DEFAULT 'scheduled',
    start_time DATETIME,
    end_time DATETIME,
    rewards TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create raid_participants table
CREATE TABLE IF NOT EXISTS raid_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    raid_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('leader', 'member') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (raid_id) REFERENCES raids(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert some sample data
INSERT INTO quests (title, description, type, difficulty, experience_reward) VALUES
('Learn a New Skill', 'Dedicate 30 minutes to learning something new in your field', 'daily', 'easy', 100),
('Complete a Project Task', 'Finish one significant task in your current project', 'daily', 'medium', 200),
('Network Connection', 'Make one new professional connection', 'weekly', 'medium', 300),
('Skill Assessment', 'Take a practice test or assessment in your domain', 'weekly', 'hard', 500);

SHOW TABLES;
SELECT 'Database setup completed successfully!' as Status;