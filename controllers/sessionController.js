const Session = require('../models/sessionModel');

// Save session function (Create or Update)
const saveSession = async (userId) => {
  try {
    const sessionDocument = {
      userId,
      lastLogin: new Date(),
      isActive: true,
    };

    // Upsert (Insert or Update)
    const updatedSession = await Session.findOneAndUpdate(
      { userId }, // Filter by userId
      sessionDocument, // Document to insert/update
      { upsert: true, new: true } // Options: upsert and return the updated document
    );

    console.log('Session data saved to MongoDB', updatedSession);
    return updatedSession;
  } catch (error) {
    console.error('Error saving session:', error.message);
    throw new Error('Failed to save session');
  }
};

// Get session data by userId
const getSession = async (userId) => {
  try {
    const session = await Session.findOne({ userId });

    if (!session) {
      throw new Error('Session not found');
    }

    return session;
  } catch (error) {
    console.error('Error fetching session:', error.message);
    throw new Error('Failed to fetch session');
  }
};

module.exports = { saveSession, getSession };
