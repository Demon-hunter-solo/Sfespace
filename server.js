const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// In-memory storage for demo purposes
// In production, use a proper database
let helpSubmissions = [];
let successStories = [];
let chatRooms = {
  'anxiety-support': [],
  'study-stress': [],
  'social-issues': [],
  'general-chat': []
};

// Helper function to generate anonymous ID
function generateAnonymousId() {
  return crypto.randomBytes(4).toString('hex');
}

// Helper function to save data to file (for persistence)
async function saveDataToFile(filename, data) {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error saving to ${filename}:`, error);
  }
}

// Helper function to load data from file
async function loadDataFromFile(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(`No existing ${filename} found, starting fresh`);
    return [];
  }
}

// Initialize data on server start
async function initializeData() {
  helpSubmissions = await loadDataFromFile('help_submissions.json');
  successStories = await loadDataFromFile('success_stories.json');
  
  // Add some sample success stories if none exist
  if (successStories.length === 0) {
    successStories = [
      {
        id: generateAnonymousId(),
        story: "I was struggling with severe anxiety and couldn't talk to anyone about it. The anonymous submission feature helped me reach out without fear. Within days, I was connected to resources that changed my life.",
        category: "emotional",
        major: "Psychology Major",
        timestamp: new Date().toISOString()
      },
      {
        id: generateAnonymousId(),
        story: "Finding a study buddy through the peer support system not only improved my grades but also gave me a friend who understood what I was going through. We still study together!",
        category: "academic",
        major: "Engineering",
        timestamp: new Date().toISOString()
      },
      {
        id: generateAnonymousId(),
        story: "I was dealing with family issues that were affecting my studies. The anonymous chat rooms helped me realize I wasn't alone, and the resources section guided me to financial aid I didn't know existed.",
        category: "family",
        major: "Business",
        timestamp: new Date().toISOString()
      }
    ];
    await saveDataToFile('success_stories.json', successStories);
  }
}

// Routes

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the admin dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Submit anonymous help request
app.post('/api/submit-help', async (req, res) => {
  try {
    const { category, message } = req.body;
    
    if (!category || !message || message.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Category and message are required' 
      });
    }

    const submission = {
      id: generateAnonymousId(),
      category,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: 'received',
      responses: []
    };

    helpSubmissions.push(submission);
    await saveDataToFile('help_submissions.json', helpSubmissions);

    // Simulate automatic resource suggestions based on category
    const resourceSuggestions = getResourceSuggestions(category);
    
    res.json({
      success: true,
      message: 'Your message has been submitted anonymously',
      submissionId: submission.id,
      suggestedResources: resourceSuggestions
    });

    // Log for admin purposes (remove sensitive info)
    console.log(`New help submission: ${category} - ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('Error submitting help request:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get resource suggestions based on category
function getResourceSuggestions(category) {
  const resources = {
    emotional: [
      { title: "Campus Counseling Services", link: "/resources/counseling" },
      { title: "Mental Health First Aid", link: "/resources/mental-health" },
      { title: "Stress Management Techniques", link: "/resources/stress-management" }
    ],
    social: [
      { title: "Social Skills Workshops", link: "/resources/social-skills" },
      { title: "Student Organizations", link: "/resources/organizations" },
      { title: "Peer Mentoring Programs", link: "/resources/peer-mentoring" }
    ],
    academic: [
      { title: "Tutoring Services", link: "/resources/tutoring" },
      { title: "Study Groups", link: "/resources/study-groups" },
      { title: "Academic Coaching", link: "/resources/academic-coaching" }
    ],
    family: [
      { title: "Family Counseling Resources", link: "/resources/family-counseling" },
      { title: "Financial Aid Information", link: "/resources/financial-aid" },
      { title: "Emergency Support Fund", link: "/resources/emergency-fund" }
    ],
    financial: [
      { title: "Financial Aid Office", link: "/resources/financial-aid" },
      { title: "Emergency Grants", link: "/resources/emergency-grants" },
      { title: "Student Employment", link: "/resources/student-jobs" }
    ],
    other: [
      { title: "General Counseling", link: "/resources/general-counseling" },
      { title: "Student Support Services", link: "/resources/student-support" },
      { title: "Campus Resources Directory", link: "/resources/directory" }
    ]
  };
  
  return resources[category] || resources.other;
}

// Submit success story
app.post('/api/submit-story', async (req, res) => {
  try {
    const { story, category, major } = req.body;
    
    if (!story || story.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Story content is required' 
      });
    }

    const newStory = {
      id: generateAnonymousId(),
      story: story.trim(),
      category: category || 'other',
      major: major || 'Anonymous Student',
      timestamp: new Date().toISOString(),
      approved: false // Stories need approval before showing
    };

    successStories.push(newStory);
    await saveDataToFile('success_stories.json', successStories);

    res.json({
      success: true,
      message: 'Your story has been submitted for review. Thank you for sharing!'
    });

  } catch (error) {
    console.error('Error submitting success story:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get approved success stories
app.get('/api/success-stories', (req, res) => {
  const approvedStories = successStories
    .filter(story => story.approved !== false) // Show stories that aren't explicitly unapproved
    .slice(-10) // Get latest 10 stories
    .reverse(); // Most recent first
  
  res.json({
    success: true,
    stories: approvedStories
  });
});

// Join chat room
app.post('/api/chat/join', (req, res) => {
  const { roomName } = req.body;
  
  if (!chatRooms[roomName]) {
    return res.status(400).json({
      success: false,
      error: 'Chat room not found'
    });
  }

  const anonymousId = generateAnonymousId();
  
  res.json({
    success: true,
    anonymousId,
    roomName,
    message: `Joined ${roomName} chat room anonymously`
  });
});

// Get chat room messages (for demo - in production use WebSockets)
app.get('/api/chat/:roomName/messages', (req, res) => {
  const { roomName } = req.params;
  
  if (!chatRooms[roomName]) {
    return res.status(400).json({
      success: false,
      error: 'Chat room not found'
    });
  }

  res.json({
    success: true,
    messages: chatRooms[roomName].slice(-50) // Last 50 messages
  });
});

// Send chat message
app.post('/api/chat/:roomName/send', (req, res) => {
  const { roomName } = req.params;
  const { message, anonymousId } = req.body;
  
  if (!chatRooms[roomName]) {
    return res.status(400).json({
      success: false,
      error: 'Chat room not found'
    });
  }

  if (!message || message.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Message content is required'
    });
  }

  const chatMessage = {
    id: generateAnonymousId(),
    anonymousId: anonymousId || generateAnonymousId(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
    roomName
  };

  chatRooms[roomName].push(chatMessage);
  
  // Keep only last 100 messages per room
  if (chatRooms[roomName].length > 100) {
    chatRooms[roomName] = chatRooms[roomName].slice(-100);
  }

  res.json({
    success: true,
    message: 'Message sent successfully'
  });
});

// Get statistics (for admin dashboard)
app.get('/api/admin/stats', (req, res) => {
  const stats = {
    totalSubmissions: helpSubmissions.length,
    submissionsByCategory: {},
    recentSubmissions: helpSubmissions.slice(-5).map(s => ({
      id: s.id,
      category: s.category,
      timestamp: s.timestamp,
      status: s.status
    })),
    successStoriesCount: successStories.length,
    activeChatRooms: Object.keys(chatRooms).length
  };

  // Count submissions by category
  helpSubmissions.forEach(submission => {
    stats.submissionsByCategory[submission.category] = 
      (stats.submissionsByCategory[submission.category] || 0) + 1;
  });

  res.json({
    success: true,
    stats
  });
});

// Crisis resources endpoint
app.get('/api/crisis-resources', (req, res) => {
  const resources = {
    emergency: [
      {
        name: "National Suicide Prevention Lifeline",
        number: "988",
        description: "24/7 crisis support",
        available: "24/7"
      },
      {
        name: "Crisis Text Line",
        number: "741741",
        description: "Text HOME for immediate support",
        available: "24/7"
      }
    ],
    campus: [
      {
        name: "Campus Counseling Center",
        number: "(555) 123-4567",
        description: "Professional counseling services",
        available: "Monday-Friday 8AM-5PM"
      },
      {
        name: "Campus Security",
        number: "(555) 123-4568",
        description: "Campus emergency response",
        available: "24/7"
      }
    ],
    online: [
      {
        name: "Anonymous Crisis Chat",
        link: "/crisis-chat",
        description: "Anonymous online crisis support",
        available: "24/7"
      }
    ]
  };

  res.json({
    success: true,
    resources
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
async function startServer() {
  await initializeData();
  
  app.listen(PORT, () => {
    console.log(`SafeSpace Server running on port ${PORT}`);
    console.log(`Access the website at: http://localhost:${PORT}`);
    console.log(`API endpoints available at: http://localhost:${PORT}/api/`);
  });
}

startServer().catch(console.error);

module.exports = app;