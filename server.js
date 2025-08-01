const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safespace';

// Database connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Database Schemas
const helpRequestSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  category: { 
    type: String, 
    required: true,
    enum: ['academic', 'emotional', 'social', 'financial', 'career', 'other']
  },
  urgency: { 
    type: String, 
    required: true,
    enum: ['low', 'medium', 'high', 'crisis']
  },
  message: { type: String, required: true, maxlength: 2000 },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'in_progress', 'responded', 'closed']
  },
  responses: [{
    counselorId: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const successStorySchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  story: { type: String, required: true, maxlength: 1000 },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const feedbackSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  feedback: { type: String, required: true, maxlength: 1000 },
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const moodLogSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  mood: { 
    type: String, 
    required: true,
    enum: ['great', 'good', 'okay', 'stressed', 'sad']
  },
  sessionId: String, // Anonymous session tracking
  createdAt: { type: Date, default: Date.now }
});

const counselorSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  isActive: { type: Boolean, default: true },
  specializations: [String],
  createdAt: { type: Date, default: Date.now }
});

// Models
const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
const SuccessStory = mongoose.model('SuccessStory', successStorySchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const MoodLog = mongoose.model('MoodLog', moodLogSchema);
const Counselor = mongoose.model('Counselor', counselorSchema);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://psdchallenge.psd.gov.sg", "https://varthana.com"],
      connectSrc: ["'self'", "ws:", "wss:"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"]
    }
  }
}));

app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 submissions per hour
  message: 'Too many submissions from this IP, please try again later.',
});

app.use(generalLimiter);

// Serve static files
app.use(express.static(path.join(__dirname)));

// API Routes

// Submit help request
app.post('/api/submit-help-request', submissionLimiter, async (req, res) => {
  try {
    const { category, urgency, message } = req.body;

    if (!category || !urgency || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long' });
    }

    const helpRequest = new HelpRequest({
      category,
      urgency,
      message: message.trim()
    });

    await helpRequest.save();

    // Emit to counselors for real-time notifications
    io.to('counselors').emit('newHelpRequest', {
      id: helpRequest.id,
      category: helpRequest.category,
      urgency: helpRequest.urgency,
      timestamp: helpRequest.createdAt
    });

    res.status(201).json({ 
      success: true, 
      message: 'Help request submitted successfully',
      requestId: helpRequest.id
    });
  } catch (error) {
    console.error('Error submitting help request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent anonymous responses (public ones)
app.get('/api/recent-responses', async (req, res) => {
  try {
    const recentResponses = await HelpRequest.find({
      'responses.isPublic': true,
      status: 'responded'
    })
    .sort({ updatedAt: -1 })
    .limit(10)
    .select('category responses.message responses.timestamp')
    .lean();

    const formattedResponses = recentResponses.map(request => ({
      category: request.category,
      response: request.responses.find(r => r.isPublic)?.message || '',
      timestamp: request.responses.find(r => r.isPublic)?.timestamp || request.updatedAt
    }));

    res.json(formattedResponses);
  } catch (error) {
    console.error('Error fetching recent responses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit success story
app.post('/api/submit-success-story', submissionLimiter, async (req, res) => {
  try {
    const { story } = req.body;

    if (!story || story.trim().length === 0) {
      return res.status(400).json({ error: 'Story is required' });
    }

    if (story.length > 1000) {
      return res.status(400).json({ error: 'Story too long' });
    }

    const successStory = new SuccessStory({
      story: story.trim()
    });

    await successStory.save();

    res.status(201).json({ 
      success: true, 
      message: 'Success story submitted for review' 
    });
  } catch (error) {
    console.error('Error submitting success story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get approved success stories
app.get('/api/success-stories', async (req, res) => {
  try {
    const stories = await SuccessStory.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('story createdAt')
      .lean();

    res.json(stories);
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit feedback
app.post('/api/submit-feedback', submissionLimiter, async (req, res) => {
  try {
    const { feedback, rating } = req.body;

    if (!feedback || feedback.trim().length === 0) {
      return res.status(400).json({ error: 'Feedback is required' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const feedbackDoc = new Feedback({
      feedback: feedback.trim(),
      rating: rating ? parseInt(rating) : null
    });

    await feedbackDoc.save();

    res.status(201).json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log mood
app.post('/api/log-mood', submissionLimiter, async (req, res) => {
  try {
    const { mood, sessionId } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const moodLog = new MoodLog({
      mood,
      sessionId: sessionId || uuidv4()
    });

    await moodLog.save();

    res.status(201).json({ 
      success: true, 
      message: 'Mood logged successfully' 
    });
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mood analytics (aggregated, anonymous)
app.get('/api/mood-analytics', async (req, res) => {
  try {
    const moodStats = await MoodLog.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
        }
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(moodStats);
  } catch (error) {
    console.error('Error fetching mood analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Counselor Dashboard Routes (simplified for demo)
app.get('/api/counselor/pending-requests', async (req, res) => {
  try {
    const pendingRequests = await HelpRequest.find({
      status: { $in: ['pending', 'in_progress'] }
    })
    .sort({ createdAt: -1, urgency: -1 })
    .select('id category urgency message createdAt status')
    .lean();

    res.json(pendingRequests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit counselor response
app.post('/api/counselor/respond', async (req, res) => {
  try {
    const { requestId, response, counselorId, isPublic } = req.body;

    if (!requestId || !response || !counselorId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const helpRequest = await HelpRequest.findOne({ id: requestId });
    if (!helpRequest) {
      return res.status(404).json({ error: 'Help request not found' });
    }

    helpRequest.responses.push({
      counselorId,
      message: response.trim(),
      isPublic: isPublic || false
    });
    helpRequest.status = 'responded';
    helpRequest.updatedAt = new Date();

    await helpRequest.save();

    res.json({ 
      success: true, 
      message: 'Response submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Socket.IO for real-time chat
const counselorSockets = new Map();
const studentSockets = new Map();

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // Join counselor room
  socket.on('join-counselor', (counselorId) => {
    socket.join('counselors');
    counselorSockets.set(socket.id, counselorId);
    console.log(`Counselor ${counselorId} joined`);
  });

  // Join student chat
  socket.on('join-student-chat', () => {
    const studentId = uuidv4();
    socket.join(`student-${studentId}`);
    studentSockets.set(socket.id, studentId);
    
    // Auto-assign to available counselor
    setTimeout(() => {
      socket.emit('counselor-joined', {
        message: 'A counselor has joined the chat. How can we help you today?'
      });
    }, 2000);
  });

  // Handle student messages
  socket.on('student-message', (data) => {
    const studentId = studentSockets.get(socket.id);
    if (studentId) {
      // Broadcast to counselors
      io.to('counselors').emit('student-message', {
        studentId,
        message: data.message,
        timestamp: new Date()
      });

      // Simulate counselor response
      setTimeout(() => {
        const responses = [
          "I understand this is difficult. Can you tell me more about what's troubling you?",
          "Thank you for sharing that with me. Your feelings are completely valid.",
          "That sounds really challenging. You're very brave for reaching out for help.",
          "Let's work through this step by step. What would be most helpful for you right now?",
          "I'm here to listen and support you. Take your time to share what's on your mind."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        socket.emit('counselor-message', {
          message: randomResponse,
          timestamp: new Date()
        });
      }, 1000 + Math.random() * 3000);
    }
  });

  socket.on('disconnect', () => {
    counselorSockets.delete(socket.id);
    studentSockets.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });
});

// Admin Dashboard Route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Default route - serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 SafeSpace server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`👥 Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;