const Query = require("../models/Query");
const Document = require("../models/Document");

exports.getAnalytics = async (req, res) => {
  try {
    // Total queries count
    const totalQueries = await Query.countDocuments();

    // Average confidence score
    const avgConfidenceResult = await Query.aggregate([
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: "$confidenceScore" }
        }
      }
    ]);

    const avgConfidence =
      avgConfidenceResult.length > 0
        ? avgConfidenceResult[0].avgConfidence
        : 0;

    // Average response time
    const avgResponseTimeResult = await Query.aggregate([
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: "$responseTimeMs" }
        }
      }
    ]);

    const avgResponseTime =
      avgResponseTimeResult.length > 0
        ? avgResponseTimeResult[0].avgResponseTime
        : 0;

    // Recent queries (last 10)
    const recentQueries = await Query.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("queryText responseText confidenceScore createdAt");

    // Document stats
    const totalDocuments = await Document.countDocuments();

    res.json({
      totalQueries,
      avgConfidence,
      avgResponseTime,
      totalDocuments,
      recentQueries
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
