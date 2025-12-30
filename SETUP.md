# SkillForge Development Setup

## Prerequisites
- Node.js 16+ installed
- MongoDB 4.4+ installed and running
- Git

## Quick Development Setup

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd SkillForge

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Environment Setup
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Frontend environment
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your settings
```

### 3. Database Setup
```bash
# Start MongoDB (if not running)
mongod

# Seed database with sample data
cd backend
npm run seed
```

### 4. Start Development Servers
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Project Structure

```
SkillForge/
├── frontend/                 # React.js application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # CSS files
│   └── public/              # Static assets
│
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── data/            # Static data (classes, etc.)
│   │   └── utils/           # Utility functions
│   └── config/              # Configuration files
│
├── database/                # Database related files
│   ├── seeds/               # Sample data
│   └── migrations/          # Database migrations
│
└── docs/                    # Documentation
```

## Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run test` - Run tests
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/verify` - Verify JWT token
- POST `/api/auth/logout` - Logout user

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- POST `/api/users/experience` - Add experience points

### Classes
- GET `/api/classes` - Get all base classes
- GET `/api/classes/:className` - Get specific class details
- GET `/api/classes/:className/branches` - Get class branches

### Quests
- GET `/api/quests` - Get available quests
- POST `/api/quests/:id/start` - Start a quest
- POST `/api/quests/:id/complete` - Complete a quest

### Guilds
- GET `/api/guilds` - Get available guilds
- POST `/api/guilds` - Create new guild
- POST `/api/guilds/:id/join` - Join guild

### Leaderboards
- GET `/api/leaderboards/levels` - Level leaderboard
- GET `/api/leaderboards/guilds` - Guild leaderboard

## Features Implemented

### ✅ Core RPG System
- [x] User registration with class selection
- [x] Level and XP system
- [x] Real-world career class progression
- [x] Stats and skill system
- [x] User authentication with JWT

### ✅ Backend Architecture
- [x] MongoDB database models
- [x] Express.js API server
- [x] Socket.io for real-time features
- [x] Authentication middleware
- [x] Class system data structure

### ✅ Frontend Foundation
- [x] React.js application setup
- [x] Routing with React Router
- [x] Authentication context
- [x] Socket.io client setup
- [x] Responsive UI styling

## Next Development Steps

### Phase 1: Core Features
1. Complete quest system implementation
2. Inventory and items system
3. Skills and progression mechanics
4. User dashboard and profile pages

### Phase 2: Multiplayer Features
1. Guild system implementation
2. Real-time chat functionality
3. Global leaderboards
4. Collaborative quests

### Phase 3: Advanced Features
1. Achievement system
2. Daily/weekly quest generation
3. Admin panel
4. Analytics and statistics

## Database Schema

### Users
- Authentication data
- RPG stats (level, XP, HP, mana, etc.)
- Class progression
- Skills and inventory
- Quest progress
- Guild membership

### Quests
- Quest details and objectives
- Rewards and requirements
- Availability conditions
- Completion tracking

### Guilds
- Guild information
- Member management
- Guild stats and achievements
- Treasury and resources

## Deployment

### Development
```bash
# Using Docker Compose
docker-compose up -d
```

### Production
```bash
# Using Docker Compose with production profile
docker-compose --profile production up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillforge
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in backend/.env

2. **Port Already in Use**
   - Kill processes on ports 3000/5000
   - Or change PORT in environment files

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration

4. **Build Errors**
   - Delete node_modules and reinstall
   - Clear npm cache: `npm cache clean --force`

### Development Tips

1. Use MongoDB Compass for database visualization
2. Install React Developer Tools for debugging
3. Use Postman for API testing
4. Enable browser dev tools for debugging

---

Happy coding! 🚀