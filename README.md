# SkillForge 🛠️✨

A Solo Leveling and Max-Level Player's 100th Regression inspired RPG system that gamifies real-world career progression. Transform your professional journey into an epic adventure with unique System Runes, ARCHES personality stats, and class-based skill trees.

## 🎮 Features

### Core RPG Mechanics
- **System Rune Generation**: Unique procedurally generated runes with F-EX ranking system
- **ARCHES Stat System**: Personality-based stats (Adaptability, Resilience, Charisma, Health, Efficiency, Serendipity)
- **Career Class System**: 7 base classes with branching specializations
- **Level-Based Progression**: Real-world achievement tracking
- **Background Declaration**: AI-powered initial stat calculation based on user goals

### Career Classes
1. **Engineer** 🔧 - Builders and problem solvers
2. **Artist** 🎨 - Creative visionaries and designers
3. **Writer** ✍️ - Content creators and communicators
4. **Business** 💼 - Leaders and entrepreneurs
5. **Scientist** 🔬 - Researchers and innovators
6. **Teacher** 📚 - Educators and mentors
7. **Healthcare** ⚕️ - Healers and caregivers

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Authentication**: JWT-based user authentication
- **Database**: MySQL with comprehensive user management
- **Real-time Features**: Socket.io for multiplayer functionality
- **API Design**: RESTful endpoints for all game systems
- **Security**: bcrypt password hashing, input validation

### Frontend (React)
- **Modern UI**: Responsive design with CSS3 animations
- **Real-time Updates**: Socket.io client integration
- **Component Architecture**: Modular React components
- **Routing**: React Router for navigation

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

### Backend Setup
```bash
cd backend
npm install
# Edit .env with your database credentials
node create-tables.js
node src/server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Database Configuration
Update .env file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=skillforge
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_here
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration with System Rune generation
- `POST /api/auth/login` - User authentication

### User Endpoints
- `GET /api/users/profile` - Get user profile with stats
- `PUT /api/users/profile` - Update user profile

### Class System Endpoints
- `GET /api/classes` - Available classes and branches

## 🎯 System Features

### System Rune Generation
Each new user receives a unique System Rune with:
- **Rank**: F (30%) to EX (0.05%) rarity
- **Category**: Combat, Social, Mental, Support, Defensive, Utility
- **Evolution Path**: Upgradeable abilities
- **Unique Abilities**: Procedurally generated powers

### ARCHES Personality Framework
- **A**daptability: Flexibility and learning speed
- **R**esilience: Mental toughness and recovery
- **C**harisma: Social influence and networking
- **H**ealth: Physical and mental wellbeing
- **E**fficiency: Productivity and optimization
- **S**erendipity: Luck and opportunity discovery

## 🔧 Development

### Project Structure
```
SkillForge/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── data/            # Class system and game data
│   │   ├── middleware/      # Authentication middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   └── services/        # Business logic services
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── styles/          # CSS and animations
│   └── package.json
└── database/
    └── setup_database.sql   # Database schema
```

## 🚧 Current Status

### ✅ Completed Features
- User registration and authentication system
- System Rune generation with procedural abilities
- ARCHES stat system implementation
- MySQL database integration
- JWT authentication middleware
- Class system framework
- Background declaration processing

### 🔄 In Progress
- Frontend React components
- Complete API endpoint testing
- Real-time Socket.io features

### ⏳ Planned
- Quest system implementation
- Guild system with team progression
- Advanced class skill trees
- Mobile app development

## 🎨 Inspiration

This project draws inspiration from:
- **Solo Leveling**: System-based progression and unique abilities
- **Max-Level Player's 100th Regression**: Advanced mechanics and strategic depth
- **Real RPG Systems**: D&D-style class progression and stat systems

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Solo Leveling manhwa by Chugong
- Max-Level Player's 100th Regression concept
- Modern RPG mechanics and gamification principles

---

**Transform your career journey into an epic adventure! 🚀**