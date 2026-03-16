const googleClient = require('../config/googleAuth');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const allowedDomain = (process.env.ALLOWED_GOOGLE_DOMAIN || 'vitapstudent.ac.in').toLowerCase();

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profilePicture: user.profilePicture,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getGoogleAuthErrorMessage = (error) => {
  const message = error?.message || '';

  if (message.includes('Wrong recipient')) {
    return 'Google client ID mismatch. Make sure the frontend and backend use the same Google OAuth client.';
  }

  if (message.includes('Token used too late')) {
    return 'Google sign-in expired. Please try signing in again.';
  }

  if (message.includes('Invalid token signature')) {
    return 'Google token verification failed. Please try again.';
  }

  return 'Unable to authenticate with Google.';
};

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required.',
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();

    if (!payload || !payload.email_verified || !email) {
      return res.status(401).json({
        success: false,
        message: 'Google account could not be verified.',
      });
    }

    if (!email.endsWith(`@${allowedDomain}`)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only @${allowedDomain} Google accounts are allowed.`,
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      user.googleId = payload.sub;
      user.name = payload.name || user.name;
      user.profilePicture = payload.picture || user.profilePicture;
    } else {
      user = new User({
        googleId: payload.sub,
        name: payload.name,
        email,
        profilePicture: payload.picture || '',
      });
    }

    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Google login successful.',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(401).json({
      success: false,
      message: getGoogleAuthErrorMessage(error),
    });
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  });
};

module.exports = {
  googleLogin,
  getCurrentUser,
};
