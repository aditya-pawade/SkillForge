# SkillForge - Solo Leveling RPG System

A web-based RPG system inspired by **Solo Leveling** and **Max-Level Player's 100th Regression**, featuring real-world career progression, regression mechanics, advanced raids, and strategic multiplayer gameplay.

![SkillForge Banner](https://via.placeholder.com/800x200/4CAF50/FFFFFF?text=SkillForge+-+Regress%2C+Master%2C+Transcend)

## 🎮 Core Features

### 🔄 Regression System (Inspired by Max-Level Player)
- **Voluntary Regression**: Reset to Level 1 while retaining knowledge and skills
- **Prestige Points**: Earned from each regression cycle for permanent bonuses  
- **Retained Knowledge**: Carry over experience to accelerate future progress
- **Skill Mastery**: Skills evolve and gain power through multiple cycles
- **Cycle Bonuses**: Each regression unlocks new abilities and multipliers
- **Special Unlocks**: Access EX-rank content after multiple regressions

### ⚔️ Advanced RPG Mechanics
- **Dynamic Stats**: HP, Mana, Stamina with regression-based bonuses
- **Skill Evolution**: Skills can transform into legendary variants
- **Mastery Ranks**: From Novice to Legendary skill mastery levels
- **Strategic Combat**: Plan raids using retained knowledge from past cycles
- **Predictive Abilities**: Foresee quest outcomes with regression experience

### 🏛️ Raid System
- **Rank-based Difficulty**: F to EX-rank raids with scaling rewards
- **Phase-based Combat**: Multi-stage encounters requiring strategy
- **Knowledge Checks**: Use retained knowledge for special mechanics
- **Team Coordination**: Real-time raid planning and execution
- **Boss Patterns**: Learn and exploit enemy behaviors across cycles

### 🏢 Real-World Career Classes
- **Base Classes**: Engineer, Artist, Writer, Business, Scientist, Teacher, Healthcare
- **Career Progression**: Realistic advancement paths (Junior → Senior → Lead → Principal)
- **Skill Synergies**: Combine technical and soft skills for powerful effects
- **Legendary Abilities**: Unlock transcendent career skills through regression

### Multiplayer Features
- **Advanced Guilds**: Raid teams with specialized roles and strategies
- **Regression Guilds**: Teams focused on cycle optimization and knowledge sharing  
- **Global Leaderboards**: Compete in level, regression cycles, and raid rankings
- **Real-time Coordination**: Voice/text chat with tactical overlays
- **Knowledge Banks**: Share regression insights with guild members
- **Competitive Seasons**: Monthly tournaments with exclusive rewards

### Strategic Gameplay
- **Raid Planning**: Analyze boss patterns using regression knowledge
- **Resource Management**: Balance progression vs regression timing
- **Skill Combinations**: Chain abilities for devastating combo attacks
- **Team Synergy**: Coordinate class abilities for maximum effectiveness
- **Time Management**: Optimize daily activities for cycle efficiency

## 🚀 What Makes This Special

### 🧠 Strategic Depth
Unlike simple clicker games, SkillForge requires **strategic thinking**:
- Plan your regression cycles for maximum knowledge retention
- Coordinate with guild members for complex raid mechanics  
- Balance short-term progress vs long-term cycle optimization
- Master skill combinations and synergy effects

### 💼 Professional Relevance  
The career progression system mirrors real professional growth:
- **Realistic Skill Trees**: Based on actual job requirements and career paths
- **Soft Skills Matter**: Communication and leadership unlock advanced classes
- **Industry Knowledge**: Learn real concepts while progressing through the game
- **Portfolio Building**: Document your virtual achievements alongside real ones

### 🎯 Regression Innovation
The regression system adds unprecedented depth:
- **Knowledge Retention**: Previous experience accelerates future learning
- **Skill Evolution**: Abilities transform and strengthen across cycles
- **Strategic Planning**: Decide optimal regression timing for maximum benefit  
- **Prestige System**: Permanent bonuses reward dedicated progression

### 🏆 Competitive Edge
Perfect portfolio project showcasing:
- **Complex Database Design**: Multi-cycle data retention and optimization
- **Real-time Systems**: Live raid coordination and guild communication
- **Advanced Algorithms**: Skill synergy calculations and progression balancing
- **Strategic Game Design**: Balancing depth with accessibility

## 🛠️ Tech Stack

- **Frontend**: React.js, CSS3 Animations, Socket.io Client
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for chat and notifications
- **Deployment**: Docker containerization ready

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/skillforge.git
cd skillforge
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Setup environment variables**
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend environment  
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

4. **Start the development servers**
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Class System Guide](./docs/CLASSES.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🎯 Project Structure

```
SkillForge/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React context providers
│   │   ├── utils/           # Helper functions
│   │   └── styles/          # CSS and styling
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── config/              # Configuration files
│   └── package.json
│
├── database/                # Database related files
│   ├── seeds/               # Sample data
│   └── migrations/          # Database migrations
│
├── docs/                    # Documentation
└── docker-compose.yml       # Docker configuration
```

## 🏆 Career Classes System

### Base Classes
- **Engineer** → Software Engineer → Senior Developer → Tech Lead
- **Artist** → Graphic Designer → Creative Director → Art Director
- **Writer** → Content Writer → Senior Writer → Editor-in-Chief
- **Business** → Analyst → Manager → Director → VP

### Skill Progression
Each class has unique skill trees that unlock as you level up:
- **Technical Skills**: Programming, design, analysis
- **Soft Skills**: Leadership, communication, project management
- **Specialized Skills**: Class-specific advanced abilities

## 🎮 Quest System

### Daily Quests
- Complete work tasks (+50 XP)
- Learn something new (+30 XP)
- Exercise or stay healthy (+25 XP)

### Weekly Challenges
- Complete a project (+200 XP)
- Learn a new skill (+150 XP)
- Help a teammate (+100 XP)

### Boss Fights
- Pass a certification exam (+500 XP)
- Complete a major project (+1000 XP)
- Get a promotion (+2000 XP)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Solo Leveling manhwa/novel
- Built with modern web technologies
- Designed for real-world skill development

## 📞 Contact

- **Project Link**: [https://github.com/yourusername/skillforge](https://github.com/yourusername/skillforge)
- **Live Demo**: [https://skillforge-demo.vercel.app](https://skillforge-demo.vercel.app)
- **LinkedIn**: [Your LinkedIn Profile]

---

⭐ **Star this repository if you found it helpful!**