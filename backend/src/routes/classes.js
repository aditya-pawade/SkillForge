const express = require('express');
const { ClassSystemHelper } = require('../data/classSystem');

const router = express.Router();

// Get all available base classes
router.get('/', (req, res) => {
  try {
    const baseClasses = ClassSystemHelper.getBaseClasses();
    
    res.json({
      success: true,
      data: baseClasses
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching classes'
    });
  }
});

// Get specific class details
router.get('/:className', (req, res) => {
  try {
    const { className } = req.params;
    const classData = ClassSystemHelper.getClass(className);
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    res.json({
      success: true,
      data: classData
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching class'
    });
  }
});

// Get branches for a base class
router.get('/:className/branches', (req, res) => {
  try {
    const { className } = req.params;
    const branches = ClassSystemHelper.getBranches(className);
    
    if (!branches) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    res.json({
      success: true,
      data: branches
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching branches'
    });
  }
});

// Get specific branch details
router.get('/:className/branches/:branchName', (req, res) => {
  try {
    const { className, branchName } = req.params;
    const branchData = ClassSystemHelper.getBranchData(className, branchName);
    
    if (!branchData) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }
    
    res.json({
      success: true,
      data: branchData
    });
  } catch (error) {
    console.error('Error fetching branch:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching branch'
    });
  }
});

module.exports = router;