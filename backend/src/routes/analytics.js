import express from 'express';
import QueryModel from '../models/Query.js'; // make sure this is also ESM

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalQueries = await QueryModel.countDocuments();

    const allQueries = await QueryModel.find({});

    const avgConfidence =
      allQueries.reduce((acc, q) => acc + (q.confidence || 0), 0) /
      (allQueries.length || 1);

    const avgResponseTime =
      allQueries.reduce((acc, q) => acc + (q.responseTime || 0), 0) /
      (allQueries.length || 1);

    const recentQueries = await QueryModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('query intent priority');

    res.json({
      totalQueries,
      avgConfidence,
      avgResponseTime,
      recentQueries,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
