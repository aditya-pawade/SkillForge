// Career Class System Data
const classSystem = {
  // Base Classes with their branching paths
  Engineer: {
    name: "Engineer",
    description: "Builders and problem solvers who create solutions",
    icon: "🔧",
    baseStats: {
      strength: 8,
      agility: 7,
      intelligence: 15,
      vitality: 10,
      luck: 10
    },
    branches: {
      "Software Engineer": {
        name: "Software Engineer",
        minLevel: 5,
        description: "Code wizards who build digital worlds",
        icon: "💻",
        statBonuses: { intelligence: 5, agility: 3 },
        skills: [
          { name: "Programming", category: "technical", maxLevel: 10 },
          { name: "Problem Solving", category: "soft", maxLevel: 8 },
          { name: "Version Control", category: "technical", maxLevel: 5 },
          { name: "Testing", category: "technical", maxLevel: 7 }
        ],
        advancement: {
          "Senior Developer": {
            name: "Senior Developer",
            minLevel: 15,
            description: "Experienced developer who mentors others",
            icon: "👨‍💻",
            statBonuses: { intelligence: 8, vitality: 3, luck: 2 },
            skills: [
              { name: "Code Architecture", category: "technical", maxLevel: 10 },
              { name: "Mentoring", category: "soft", maxLevel: 8 },
              { name: "Code Review", category: "technical", maxLevel: 9 },
              { name: "System Design", category: "technical", maxLevel: 10 }
            ],
            
            // Advanced regression features
            regressionBonuses: {
              knowledgeMultiplier: 1.5, // Extra knowledge gain from previous cycles
              skillEvolution: ["Advanced Debugging", "Predictive Coding"], // Skills that can evolve
              uniqueAbilities: ["Time-Efficient Development", "Bug Foresight"]
            },
            
            advancement: {
              "Tech Lead": {
                name: "Tech Lead",
                minLevel: 25,
                description: "Technical leader guiding development teams",
                icon: "🚀",
                statBonuses: { intelligence: 10, vitality: 5, luck: 3 },
                skills: [
                  { name: "Technical Leadership", category: "soft", maxLevel: 10 },
                  { name: "System Design", category: "technical", maxLevel: 10 },
                  { name: "Team Management", category: "soft", maxLevel: 8 },
                  { name: "Strategic Planning", category: "specialized", maxLevel: 9 }
                ],
                regressionBonuses: {
                  knowledgeMultiplier: 2.0,
                  skillEvolution: ["Visionary Leadership", "Technical Prophet"],
                  uniqueAbilities: ["Future Tech Prediction", "Team Synergy Mastery"]
                }
              },
              "Principal Engineer": {
                name: "Principal Engineer",
                minLevel: 30,
                description: "Technical visionary shaping engineering culture",
                icon: "⭐",
                statBonuses: { intelligence: 12, vitality: 6, luck: 5 },
                skills: [
                  { name: "Technical Strategy", category: "specialized", maxLevel: 10 },
                  { name: "Innovation", category: "specialized", maxLevel: 10 },
                  { name: "Cross-team Collaboration", category: "soft", maxLevel: 9 },
                  { name: "Industry Influence", category: "legendary", maxLevel: 5 }
                ],
                regressionBonuses: {
                  knowledgeMultiplier: 3.0,
                  skillEvolution: ["Technological Oracle", "Innovation Catalyst"],
                  uniqueAbilities: ["Industry Trend Foresight", "Legendary Code Mastery"],
                  prestigeUnlocks: ["Access to EX-Rank Technical Challenges"]
                }
              }
            }
          }
        }
      },
      "Mechanical Engineer": {
        name: "Mechanical Engineer",
        minLevel: 5,
        description: "Masters of physical systems and mechanics",
        icon: "⚙️",
        statBonuses: { strength: 5, intelligence: 4, vitality: 3 },
        skills: [
          { name: "CAD Design", category: "technical", maxLevel: 10 },
          { name: "Materials Science", category: "technical", maxLevel: 8 },
          { name: "Project Management", category: "soft", maxLevel: 7 }
        ],
        advancement: {
          "Senior Mechanical Engineer": {
            name: "Senior Mechanical Engineer",
            minLevel: 15,
            description: "Expert in mechanical design and analysis",
            icon: "🔩",
            statBonuses: { strength: 7, intelligence: 6, vitality: 4 },
            skills: [
              { name: "Advanced Analysis", category: "technical", maxLevel: 10 },
              { name: "Team Leadership", category: "soft", maxLevel: 8 }
            ]
          }
        }
      }
    }
  },

  Artist: {
    name: "Artist",
    description: "Creative visionaries who bring beauty to the world",
    icon: "🎨",
    baseStats: {
      strength: 7,
      agility: 12,
      intelligence: 11,
      vitality: 8,
      luck: 12
    },
    branches: {
      "Graphic Designer": {
        name: "Graphic Designer",
        minLevel: 5,
        description: "Visual communicators who create stunning designs",
        icon: "🖌️",
        statBonuses: { agility: 5, intelligence: 3, luck: 3 },
        skills: [
          { name: "Design Software", category: "technical", maxLevel: 10 },
          { name: "Typography", category: "technical", maxLevel: 8 },
          { name: "Color Theory", category: "technical", maxLevel: 7 },
          { name: "Creative Thinking", category: "soft", maxLevel: 9 }
        ],
        advancement: {
          "Senior Designer": {
            name: "Senior Designer",
            minLevel: 15,
            description: "Design expert leading creative projects",
            icon: "🎭",
            statBonuses: { agility: 8, intelligence: 5, luck: 5 },
            skills: [
              { name: "Brand Strategy", category: "specialized", maxLevel: 10 },
              { name: "Client Management", category: "soft", maxLevel: 8 }
            ],
            advancement: {
              "Creative Director": {
                name: "Creative Director",
                minLevel: 25,
                description: "Visionary leader of creative teams",
                icon: "👑",
                statBonuses: { agility: 10, intelligence: 7, luck: 8 },
                skills: [
                  { name: "Creative Leadership", category: "soft", maxLevel: 10 },
                  { name: "Strategic Vision", category: "specialized", maxLevel: 10 }
                ]
              }
            }
          }
        }
      },
      "Digital Artist": {
        name: "Digital Artist",
        minLevel: 5,
        description: "Masters of digital creation and illustration",
        icon: "🖥️",
        statBonuses: { agility: 6, intelligence: 2, luck: 4 },
        skills: [
          { name: "Digital Painting", category: "technical", maxLevel: 10 },
          { name: "3D Modeling", category: "technical", maxLevel: 8 },
          { name: "Animation", category: "technical", maxLevel: 9 }
        ]
      }
    }
  },

  Writer: {
    name: "Writer",
    description: "Wordsmiths who craft stories and communicate ideas",
    icon: "✍️",
    baseStats: {
      strength: 6,
      agility: 9,
      intelligence: 14,
      vitality: 9,
      luck: 12
    },
    branches: {
      "Content Writer": {
        name: "Content Writer",
        minLevel: 5,
        description: "Creators of engaging content across platforms",
        icon: "📝",
        statBonuses: { intelligence: 4, agility: 3, luck: 2 },
        skills: [
          { name: "SEO Writing", category: "technical", maxLevel: 8 },
          { name: "Research", category: "soft", maxLevel: 9 },
          { name: "Storytelling", category: "soft", maxLevel: 10 }
        ],
        advancement: {
          "Senior Writer": {
            name: "Senior Writer",
            minLevel: 15,
            description: "Expert writer with specialized knowledge",
            icon: "📚",
            statBonuses: { intelligence: 7, luck: 4 },
            advancement: {
              "Editor-in-Chief": {
                name: "Editor-in-Chief",
                minLevel: 25,
                description: "Editorial leader overseeing content strategy",
                icon: "📖",
                statBonuses: { intelligence: 10, vitality: 5, luck: 6 }
              }
            }
          }
        }
      }
    }
  },

  Business: {
    name: "Business",
    description: "Strategic minds who drive organizations forward",
    icon: "💼",
    baseStats: {
      strength: 8,
      agility: 10,
      intelligence: 12,
      vitality: 12,
      luck: 8
    },
    branches: {
      "Business Analyst": {
        name: "Business Analyst",
        minLevel: 5,
        description: "Analytical thinkers who optimize business processes",
        icon: "📊",
        statBonuses: { intelligence: 5, vitality: 3, agility: 2 },
        skills: [
          { name: "Data Analysis", category: "technical", maxLevel: 9 },
          { name: "Process Optimization", category: "technical", maxLevel: 8 },
          { name: "Stakeholder Management", category: "soft", maxLevel: 8 }
        ],
        advancement: {
          "Senior Analyst": {
            name: "Senior Analyst",
            minLevel: 15,
            description: "Expert analyst leading strategic initiatives",
            icon: "📈",
            advancement: {
              "Manager": {
                name: "Manager",
                minLevel: 20,
                description: "People leader managing teams and projects",
                icon: "👨‍💼",
                advancement: {
                  "Director": {
                    name: "Director",
                    minLevel: 30,
                    description: "Strategic leader overseeing departments",
                    icon: "🏢",
                    advancement: {
                      "Vice President": {
                        name: "Vice President",
                        minLevel: 40,
                        description: "Executive leader shaping company direction",
                        icon: "🤵"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  Scientist: {
    name: "Scientist",
    description: "Researchers and innovators pushing the boundaries of knowledge",
    icon: "🔬",
    baseStats: {
      strength: 7,
      agility: 8,
      intelligence: 16,
      vitality: 9,
      luck: 10
    },
    branches: {
      "Research Scientist": {
        name: "Research Scientist",
        minLevel: 5,
        description: "Dedicated researchers expanding human knowledge",
        icon: "🧪",
        statBonuses: { intelligence: 6, vitality: 2, luck: 2 },
        skills: [
          { name: "Research Methods", category: "technical", maxLevel: 10 },
          { name: "Data Analysis", category: "technical", maxLevel: 9 },
          { name: "Scientific Writing", category: "soft", maxLevel: 8 }
        ]
      }
    }
  },

  Teacher: {
    name: "Teacher",
    description: "Educators who shape minds and inspire learning",
    icon: "🎓",
    baseStats: {
      strength: 8,
      agility: 9,
      intelligence: 13,
      vitality: 11,
      luck: 9
    },
    branches: {
      "Elementary Teacher": {
        name: "Elementary Teacher",
        minLevel: 5,
        description: "Foundation builders for young minds",
        icon: "👩‍🏫",
        statBonuses: { intelligence: 4, vitality: 4, luck: 2 },
        skills: [
          { name: "Lesson Planning", category: "soft", maxLevel: 9 },
          { name: "Classroom Management", category: "soft", maxLevel: 8 },
          { name: "Child Psychology", category: "technical", maxLevel: 7 }
        ]
      },
      "High School Teacher": {
        name: "High School Teacher",
        minLevel: 5,
        description: "Subject matter experts preparing students for the future",
        icon: "👨‍🏫",
        statBonuses: { intelligence: 5, vitality: 3, strength: 2 }
      }
    }
  },

  Healthcare: {
    name: "Healthcare",
    description: "Healers and caregivers dedicated to helping others",
    icon: "🏥",
    baseStats: {
      strength: 9,
      agility: 11,
      intelligence: 13,
      vitality: 14,
      luck: 3
    },
    branches: {
      "Nurse": {
        name: "Nurse",
        minLevel: 5,
        description: "Compassionate caregivers on the front lines of healthcare",
        icon: "👩‍⚕️",
        statBonuses: { vitality: 5, agility: 3, intelligence: 2 },
        skills: [
          { name: "Patient Care", category: "soft", maxLevel: 10 },
          { name: "Medical Knowledge", category: "technical", maxLevel: 9 },
          { name: "Critical Thinking", category: "soft", maxLevel: 8 }
        ],
        advancement: {
          "Nurse Practitioner": {
            name: "Nurse Practitioner",
            minLevel: 20,
            description: "Advanced practice nurse with specialized skills",
            icon: "👨‍⚕️",
            statBonuses: { vitality: 8, intelligence: 6, agility: 4 }
          }
        }
      }
    }
  }
};

// Helper functions for class system
const ClassSystemHelper = {
  // Get all available base classes
  getBaseClasses() {
    return Object.keys(classSystem).map(className => ({
      name: className,
      ...classSystem[className],
      branches: Object.keys(classSystem[className].branches)
    }));
  },

  // Get class data by name
  getClass(className) {
    return classSystem[className];
  },

  // Get available branches for a base class
  getBranches(baseClass) {
    return classSystem[baseClass]?.branches || {};
  },

  // Get specific branch data
  getBranchData(baseClass, branchName) {
    return classSystem[baseClass]?.branches[branchName];
  },

  // Check if user can advance to a specific class
  canAdvanceTo(user, baseClass, branchName) {
    const branch = this.getBranchData(baseClass, branchName);
    if (!branch) return false;
    
    return user.level >= branch.minLevel;
  },

  // Get next available advancement for current class
  getNextAdvancement(user) {
    const currentBranch = this.getBranchData(user.class.baseClass, user.class.currentClass);
    if (!currentBranch?.advancement) return null;

    for (const [advancementName, advancement] of Object.entries(currentBranch.advancement)) {
      if (user.level >= advancement.minLevel) {
        return {
          name: advancementName,
          ...advancement
        };
      }
    }
    return null;
  },

  // Calculate total stat bonuses for current class path
  calculateClassStats(user) {
    const baseClass = this.getClass(user.class.baseClass);
    const currentBranch = this.getBranchData(user.class.baseClass, user.class.currentClass);
    
    const stats = { ...baseClass.baseStats };
    
    if (currentBranch?.statBonuses) {
      for (const [stat, bonus] of Object.entries(currentBranch.statBonuses)) {
        stats[stat] = (stats[stat] || 0) + bonus;
      }
    }
    
    return stats;
  },

  // Get all skills available to current class
  getAvailableSkills(user) {
    const currentBranch = this.getBranchData(user.class.baseClass, user.class.currentClass);
    return currentBranch?.skills || [];
  }
};

module.exports = {
  classSystem,
  ClassSystemHelper
};