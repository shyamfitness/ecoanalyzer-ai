import express from 'express';
import User from '../models/User.js';
import Analysis from '../models/Analysis.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('analytics');
    
    // Get recent analyses for trends
    const recentAnalyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('environmentalScore grade createdAt');

    // Calculate trends
    const gradeDistribution = {};
    const scoreTrend = [];
    
    recentAnalyses.forEach(analysis => {
      gradeDistribution[analysis.grade] = (gradeDistribution[analysis.grade] || 0) + 1;
      scoreTrend.push({
        score: analysis.environmentalScore,
        date: analysis.createdAt
      });
    });

    res.json({
      success: true,
      analytics: {
        ...user.analytics,
        gradeDistribution,
        scoreTrend,
        recentAnalyses: recentAnalyses.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const totalAnalyses = await Analysis.countDocuments({ user: req.user._id });
    
    const avgScore = await Analysis.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, average: { $avg: '$environmentalScore' } } }
    ]);

    const gradeStats = await Analysis.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$grade', count: { $sum: 1 } } }
    ]);

    const categoryStats = await Analysis.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$product.category', count: { $sum: 1 } } }
    ]);

    const monthlyStats = await Analysis.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$environmentalScore' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      stats: {
        totalAnalyses,
        averageScore: avgScore[0]?.average || 0,
        gradeDistribution: gradeStats,
        categoryDistribution: categoryStats,
        monthlyTrends: monthlyStats
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        analytics: user.analytics,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    // Delete all user's analyses
    await Analysis.deleteMany({ user: req.user._id });
    
    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
