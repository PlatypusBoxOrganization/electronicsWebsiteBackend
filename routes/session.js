const express = require('express');
const { saveSession, getSession } = require('../controllers/sessionController');

const router = express.Router();

// Route to save or update session data
router.post('/save', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' });
  }

  try {
    const session = await saveSession(userId);
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get session data by userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const session = await getSession(userId);
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
