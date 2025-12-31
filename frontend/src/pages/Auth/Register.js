import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    baseClass: '',
  });
  const { register, isLoading, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!formData.baseClass) {
      toast.error('Please select a base class');
      return;
    }

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      baseClass: formData.baseClass,
    });
    
    if (result.success) {
      toast.success('Welcome to SkillForge! Account created successfully!');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-particles"></div>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Join SkillForge</h1>
          <p className="auth-subtitle">Begin Your Journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose your username"
              pattern="[a-zA-Z0-9_]+"
              title="Username can only contain letters, numbers, and underscores"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (6+ characters)"
              minLength="6"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              minLength="6"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="baseClass">Starting Class</label>
            <select
              id="baseClass"
              name="baseClass"
              value={formData.baseClass}
              onChange={handleChange}
              className="select-input"
              required
            >
              <option value="">Select your starting class...</option>
              <option value="Engineer">Engineer - Builders and problem solvers</option>
              <option value="Scientist">Scientist - Researchers and innovators</option>
              <option value="Business">Business - Strategic minds driving organizations</option>
              <option value="Teacher">Teacher - Educators shaping minds</option>
              <option value="Healthcare">Healthcare - Healers and caregivers</option>
              <option value="Artist">Artist - Creative visionaries</option>
              <option value="Writer">Writer - Wordsmiths crafting stories</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="button-spinner"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;