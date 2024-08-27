// In your Express route file
router.get('/latest-messages', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const latestMessages = await Chat.aggregate([
        { $match: { participants: userId } },
        { $unwind: "$messages" },
        { $sort: { "messages.createdAt": -1 } },
        { $group: {
            _id: "$_id",
            userId: { $first: "$participants" },
            content: { $first: "$messages.content" },
            type: { $first: "$messages.type" },
            createdAt: { $first: "$messages.createdAt" }
          }
        },
        { $project: {
            _id: 0,
            userId: { $arrayElemAt: [{ $setDifference: ["$userId", [userId]] }, 0] },
            content: 1,
            type: 1,
            createdAt: 1
          }
        }
      ]);
  
      res.json(latestMessages);
    } catch (error) {
      console.error('Error fetching latest messages:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });