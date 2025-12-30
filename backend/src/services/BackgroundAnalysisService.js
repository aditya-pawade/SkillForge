// Background Analysis Service for SkillForge
// Analyzes user's Level 1 background declaration to determine Level 10 class options

class BackgroundAnalysisService {
  static analyzeForClassUnlock(user) {
    if (!user.backgroundDeclaration) {
      throw new Error('Background declaration is required for class analysis');
    }

    const analysis = this.performComprehensiveAnalysis(user);
    const availableClasses = this.generateAvailableClasses(analysis, user);
    const recommendations = this.generateRecommendations(availableClasses, analysis);

    return {
      analysis,
      availableClasses,
      recommendations,
      unlockEligible: availableClasses.length > 0,
      canUnlockAt: user.level >= 10 && availableClasses.length > 0
    };
  }

  static performComprehensiveAnalysis(user) {
    const declaration = user.backgroundDeclaration;
    
    const subjectAnalysis = this.analyzeSubjects(declaration.subjects);
    const careerAnalysis = this.analyzeCareers(declaration.careerGoals);
    const roleAnalysis = this.analyzeRoles(declaration.currentRole);
    const statAnalysis = this.analyzeStatDistribution(user.stats.arches);
    const runeAnalysis = this.analyzeSystemRune(user.systemRune);
    const activityPatternAnalysis = this.analyzeActivityPattern(declaration);

    return {
      dominantDomains: this.identifyDominantDomains(subjectAnalysis, careerAnalysis, roleAnalysis),
      statProfile: this.createStatProfile(statAnalysis),
      runeAlignment: this.determineRuneAlignment(runeAnalysis),
      activityPattern: activityPatternAnalysis,
      overallCompatibility: this.calculateOverallCompatibility(subjectAnalysis, careerAnalysis, roleAnalysis, statAnalysis)
    };
  }

  static analyzeSubjects(subjects) {
    if (!subjects || !Array.isArray(subjects)) return {};
    
    const domainCounts = {};
    subjects.forEach(subject => {
      const domain = this.mapSubjectToDomain(subject);
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });

    return {
      domains: domainCounts,
      primary: Object.keys(domainCounts).sort((a, b) => domainCounts[b] - domainCounts[a])[0]
    };
  }

  static analyzeCareers(careerGoals) {
    if (!careerGoals || !Array.isArray(careerGoals)) return {};
    
    const domainCounts = {};
    careerGoals.forEach(career => {
      const domain = this.mapCareerToDomain(career);
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });

    return {
      domains: domainCounts,
      primary: Object.keys(domainCounts).sort((a, b) => domainCounts[b] - domainCounts[a])[0]
    };
  }

  static analyzeRoles(currentRole) {
    if (!currentRole) return {};
    
    const domain = this.mapRoleToDomain(currentRole);
    return {
      domain,
      weight: 1.5
    };
  }

  static analyzeStatDistribution(archesStats) {
    const stats = ['agility', 'resilience', 'charisma', 'health', 'endurance', 'serendipity'];
    const sortedStats = stats.map(stat => ({
      name: stat,
      value: archesStats[stat]
    })).sort((a, b) => b.value - a.value);

    return {
      dominant: sortedStats.slice(0, 2).map(s => s.name),
      distribution: sortedStats,
      isBalanced: sortedStats[0].value - sortedStats[5].value < 15
    };
  }

  static analyzeSystemRune(systemRune) {
    if (!systemRune) return { alignment: [], influence: 'none' };
    
    const runeClassMap = {
      'Learning': ['Teacher', 'Scientist'],
      'Creation': ['Engineer', 'Artist'],
      'Analysis': ['Scientist', 'Business'],
      'Communication': ['Teacher', 'Business'],
      'Innovation': ['Engineer', 'Artist'],
      'Leadership': ['Business', 'Teacher']
    };

    const alignment = [];
    if (systemRune.effects && Array.isArray(systemRune.effects)) {
      systemRune.effects.forEach(effect => {
        if (runeClassMap[effect.name]) {
          alignment.push(...runeClassMap[effect.name]);
        }
      });
    }

    return {
      alignment: [...new Set(alignment)],
      influence: systemRune.rank || 'F'
    };
  }

  static analyzeActivityPattern(declaration) {
    const subjects = declaration.subjects || [];
    const goals = declaration.careerGoals || [];
    const activities = declaration.activities || [];

    let patternType = 'balanced';
    
    if (subjects.length <= 2 && goals.length <= 1) {
      patternType = 'specialist';
    } else if (subjects.length >= 5 || goals.length >= 3) {
      patternType = 'generalist';
    } else if (activities.some(activity => activity.toLowerCase().includes('research'))) {
      patternType = 'researcher';
    }

    return {
      type: patternType,
      focus: subjects.length > 0 ? subjects[0] : 'general',
      diversity: subjects.length + goals.length
    };
  }

  static identifyDominantDomains(subjectAnalysis, careerAnalysis, roleAnalysis) {
    const domainScores = {};
    
    Object.entries(subjectAnalysis.domains || {}).forEach(([domain, count]) => {
      domainScores[domain] = (domainScores[domain] || 0) + count;
    });

    Object.entries(careerAnalysis.domains || {}).forEach(([domain, count]) => {
      domainScores[domain] = (domainScores[domain] || 0) + (count * 2);
    });

    if (roleAnalysis.domain) {
      domainScores[roleAnalysis.domain] = (domainScores[roleAnalysis.domain] || 0) + 3;
    }

    return Object.keys(domainScores)
      .sort((a, b) => domainScores[b] - domainScores[a])
      .slice(0, 3);
  }

  static createStatProfile(statAnalysis) {
    const profile = this.getStatProfile(statAnalysis.dominant);
    
    return {
      profile,
      dominantStats: statAnalysis.dominant,
      isBalanced: statAnalysis.isBalanced,
      alignedClasses: profile.alignedClasses
    };
  }

  static determineRuneAlignment(runeAnalysis) {
    return runeAnalysis.alignment;
  }

  static calculateOverallCompatibility(subjectAnalysis, careerAnalysis, roleAnalysis, statAnalysis) {
    const scores = {
      academic: Object.values(subjectAnalysis.domains || {}).reduce((a, b) => a + b, 0),
      career: Object.values(careerAnalysis.domains || {}).reduce((a, b) => a + b, 0) * 2,
      experience: roleAnalysis.weight || 0,
      aptitude: statAnalysis.dominant.length * 2
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    
    return {
      scores,
      total: totalScore,
      level: totalScore > 15 ? 'high' : totalScore > 8 ? 'medium' : 'low'
    };
  }

  static generateAvailableClasses(analysis, user) {
    const availableClasses = [];
    
    const baseClasses = ['Engineer', 'Scientist', 'Business', 'Teacher', 'Healthcare', 'Artist', 'Writer'];
    const baseScores = {};
    
    baseClasses.forEach(cls => {
      baseScores[cls] = 0;
    });

    analysis.dominantDomains.forEach((domain, index) => {
      const weight = 3 - index;
      const alignedClasses = this.getDomainClasses(domain);
      alignedClasses.forEach(cls => {
        baseScores[cls] += weight;
      });
    });

    analysis.statProfile.alignedClasses.forEach(cls => {
      baseScores[cls] += 3;
    });

    analysis.runeAlignment.forEach(cls => {
      baseScores[cls] += 2;
    });

    const patternBonus = this.getPatternClassBonus(analysis.activityPattern.type);
    Object.entries(patternBonus).forEach(([className, bonus]) => {
      baseScores[className] += bonus;
    });
    
    Object.entries(baseScores)
      .filter(([, score]) => score >= 10)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .forEach(([baseClass, score]) => {
        const specificClasses = this.getSpecificClasses(baseClass, user.backgroundDeclaration);
        
        specificClasses.forEach(specificClass => {
          availableClasses.push({
            baseClass,
            specificClass: specificClass.name,
            eligibilityScore: score + specificClass.bonus,
            requirements: specificClass.requirements,
            recommendationReason: this.generateRecommendationReason(analysis, baseClass, specificClass)
          });
        });
      });
    
    return availableClasses.sort((a, b) => b.eligibilityScore - a.eligibilityScore);
  }
  
  static mapSubjectToDomain(subject) {
    const domainMap = {
      'Programming': 'technology',
      'Computer Science': 'technology',
      'Mathematics': 'analytical',
      'Physics': 'scientific',
      'Chemistry': 'scientific',
      'Biology': 'scientific',
      'Economics': 'business',
      'Finance': 'business',
      'Art': 'creative',
      'Design': 'creative',
      'Literature': 'creative',
      'Psychology': 'social',
      'Medicine': 'healthcare',
      'Education': 'teaching'
    };
    
    return domainMap[subject] || 'general';
  }
  
  static mapCareerToDomain(career) {
    const careerMap = {
      'Software Engineer': 'technology',
      'Data Scientist': 'analytical',
      'Research Scientist': 'scientific',
      'Teacher': 'teaching',
      'Doctor': 'healthcare',
      'Artist': 'creative',
      'Writer': 'creative',
      'Manager': 'business',
      'Entrepreneur': 'business'
    };
    
    return careerMap[career] || 'general';
  }
  
  static mapRoleToDomain(role) {
    return this.mapCareerToDomain(role);
  }
  
  static getDomainClasses(domain) {
    const domainClasses = {
      'technology': ['Engineer'],
      'scientific': ['Scientist', 'Engineer'],
      'analytical': ['Scientist', 'Business'],
      'business': ['Business'],
      'creative': ['Artist', 'Writer'],
      'social': ['Teacher', 'Business'],
      'healthcare': ['Healthcare'],
      'teaching': ['Teacher']
    };
    
    return domainClasses[domain] || [];
  }
  
  static getStatProfile(dominantStats) {
    const profiles = {
      'agility,resilience': { name: 'Analytical Learner', alignedClasses: ['Engineer', 'Scientist'] },
      'charisma,resilience': { name: 'Natural Leader', alignedClasses: ['Business', 'Teacher'] },
      'resilience,serendipity': { name: 'Creative Thinker', alignedClasses: ['Artist', 'Writer'] },
      'health,resilience': { name: 'Dedicated Worker', alignedClasses: ['Healthcare', 'Engineer'] },
      'charisma,serendipity': { name: 'People Person', alignedClasses: ['Business', 'Teacher'] }
    };
    
    const key = dominantStats.sort().join(',');
    return profiles[key] || { name: 'Balanced', alignedClasses: ['Business', 'Teacher'] };
  }
  
  static getPatternClassBonus(pattern) {
    const bonuses = {
      'specialist': { 'Scientist': 6, 'Engineer': 4 },
      'generalist': { 'Business': 6, 'Teacher': 4 },
      'researcher': { 'Scientist': 8, 'Writer': 3 },
      'balanced': { 'Business': 3, 'Teacher': 3, 'Engineer': 2 }
    };
    
    return bonuses[pattern] || {};
  }
  
  static getSpecificClasses(baseClass, backgroundDeclaration) {
    const specificClassMap = {
      'Engineer': [
        { name: 'Software Engineer', bonus: 5, requirements: ['Programming background'] },
        { name: 'Mechanical Engineer', bonus: 3, requirements: ['Physics/Math background'] },
        { name: 'Civil Engineer', bonus: 2, requirements: ['Math background'] }
      ],
      'Scientist': [
        { name: 'Research Scientist', bonus: 5, requirements: ['Science background'] },
        { name: 'Data Scientist', bonus: 4, requirements: ['Math/Programming background'] },
        { name: 'Lab Technician', bonus: 2, requirements: ['Science interest'] }
      ],
      'Business': [
        { name: 'Business Analyst', bonus: 4, requirements: ['Analytical thinking'] },
        { name: 'Project Manager', bonus: 3, requirements: ['Organization skills'] },
        { name: 'Sales Representative', bonus: 2, requirements: ['Communication skills'] }
      ],
      'Teacher': [
        { name: 'Subject Teacher', bonus: 4, requirements: ['Subject expertise'] },
        { name: 'Training Coordinator', bonus: 3, requirements: ['Communication skills'] }
      ],
      'Healthcare': [
        { name: 'Medical Assistant', bonus: 3, requirements: ['Biology background'] },
        { name: 'Nurse', bonus: 4, requirements: ['Healthcare interest'] }
      ],
      'Artist': [
        { name: 'Graphic Designer', bonus: 4, requirements: ['Design background'] },
        { name: 'Digital Artist', bonus: 3, requirements: ['Art background'] }
      ],
      'Writer': [
        { name: 'Content Writer', bonus: 4, requirements: ['Writing skills'] },
        { name: 'Technical Writer', bonus: 3, requirements: ['Technical background'] }
      ]
    };
    
    return specificClassMap[baseClass] || [];
  }
  
  static generateRecommendationReason(analysis, baseClass, specificClass) {
    const reasons = [];
    
    if (analysis.dominantDomains[0] === this.getClassDomain(baseClass)) {
      reasons.push('Strong match with your learning focus');
    }
    
    if (analysis.statProfile.alignedClasses.includes(baseClass)) {
      reasons.push('Aligned with your natural abilities');
    }
    
    if (analysis.runeAlignment.includes(baseClass)) {
      reasons.push('Synergizes with your System Rune');
    }
    
    return reasons.join(', ') || 'Good overall fit based on your background';
  }
  
  static getClassDomain(className) {
    const classDomains = {
      'Engineer': 'technology',
      'Scientist': 'scientific',
      'Business': 'business',
      'Teacher': 'teaching',
      'Healthcare': 'healthcare',
      'Artist': 'creative',
      'Writer': 'creative'
    };
    
    return classDomains[className];
  }
  
  static generateRecommendations(availableClasses, analysis) {
    const top3 = availableClasses.slice(0, 3);
    
    return {
      primary: {
        class: top3[0],
        reason: `Best overall match based on your ${analysis.dominantDomains[0]} focus and ${analysis.statProfile.profile.name} profile`
      },
      alternatives: top3.slice(1).map(cls => ({
        class: cls,
        reason: `Strong alternative that leverages your ${analysis.activityPattern.type} approach`
      })),
      considerLater: {
        message: 'These paths may become available through skill development or class advancement',
        classes: availableClasses.slice(6)
      }
    };
  }
}

module.exports = BackgroundAnalysisService;