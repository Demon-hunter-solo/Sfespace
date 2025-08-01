const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data storage paths
const DATA_DIR = './data';
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const COMMUNITY_MESSAGES_FILE = path.join(DATA_DIR, 'community_messages.json');
const RESPONSES_FILE = path.join(DATA_DIR, 'responses.json');

// Initialize data directory and files
async function initializeDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize submissions file
    try {
      await fs.access(SUBMISSIONS_FILE);
    } catch {
      await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([]));
    }
    
    // Initialize community messages file
    try {
      await fs.access(COMMUNITY_MESSAGES_FILE);
    } catch {
      await fs.writeFile(COMMUNITY_MESSAGES_FILE, JSON.stringify([
        {
          id: uuidv4(),
          message: "Remember, every storm runs out of rain. You're stronger than you think and you're not alone in this journey.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
          id: uuidv4(),
          message: "To whoever needs to hear this: it's okay to not be okay. Asking for help is a sign of strength, not weakness.",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
        },
        {
          id: uuidv4(),
          message: "Your mental health matters. Take breaks, be kind to yourself, and remember that your worth isn't determined by your grades.",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        }
      ]));
    }
    
    // Initialize responses file
    try {
      await fs.access(RESPONSES_FILE);
    } catch {
      await fs.writeFile(RESPONSES_FILE, JSON.stringify([]));
    }
    
    console.log('Data files initialized successfully');
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

// Helper functions for data operations
async function readDataFile(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

async function writeDataFile(filename, data) {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// Serve static files
app.use(express.static('.'));

// API Routes

// Submit anonymous help request
app.post('/api/submit-help', async (req, res) => {
  try {
    const { category, urgency, message } = req.body;
    
    if (!category || !urgency || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const submission = {
      id: uuidv4(),
      category: category.toLowerCase(),
      urgency: urgency.toLowerCase(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    const submissions = await readDataFile(SUBMISSIONS_FILE);
    submissions.push(submission);
    await writeDataFile(SUBMISSIONS_FILE, submissions);
    
    // Log for monitoring (without personal data)
    console.log(`New ${urgency} priority ${category} submission received`);
    
    res.status(201).json({ 
      success: true, 
      message: 'Submission received successfully',
      id: submission.id 
    });
    
  } catch (error) {
    console.error('Error processing help submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit community message
app.post('/api/community-message', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    if (message.trim().length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 characters)' });
    }
    
    const communityMessage = {
      id: uuidv4(),
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    const messages = await readDataFile(COMMUNITY_MESSAGES_FILE);
    messages.unshift(communityMessage); // Add to beginning
    
    // Keep only the most recent 50 messages
    if (messages.length > 50) {
      messages.splice(50);
    }
    
    await writeDataFile(COMMUNITY_MESSAGES_FILE, messages);
    
    res.status(201).json({ success: true, message: 'Community message posted successfully' });
    
  } catch (error) {
    console.error('Error posting community message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get community messages
app.get('/api/community-messages', async (req, res) => {
  try {
    const messages = await readDataFile(COMMUNITY_MESSAGES_FILE);
    // Return only the 20 most recent messages
    res.json(messages.slice(0, 20));
  } catch (error) {
    console.error('Error fetching community messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get dashboard data
app.get('/api/admin-data', async (req, res) => {
  try {
    const submissions = await readDataFile(SUBMISSIONS_FILE);
    const responses = await readDataFile(RESPONSES_FILE);
    
    const today = new Date().toISOString().split('T')[0];
    
    const pendingCount = submissions.filter(sub => sub.status === 'pending').length;
    const resolvedToday = responses.filter(resp => 
      resp.timestamp.startsWith(today)
    ).length;
    
    // Sort submissions by urgency and timestamp
    const urgencyOrder = { high: 3, medium: 2, low: 1 };
    const sortedSubmissions = submissions
      .sort((a, b) => {
        const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        if (urgencyDiff !== 0) return urgencyDiff;
        return new Date(b.timestamp) - new Date(a.timestamp);
      })
      .slice(0, 10); // Return only the 10 most recent/urgent
    
    res.json({
      pendingCount,
      resolvedToday,
      submissions: sortedSubmissions
    });
    
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Submit response
app.post('/api/admin-response', async (req, res) => {
  try {
    const { submissionId, message, followUp } = req.body;
    
    if (!submissionId || !message) {
      return res.status(400).json({ error: 'Submission ID and message are required' });
    }
    
    const submissions = await readDataFile(SUBMISSIONS_FILE);
    const submissionIndex = submissions.findIndex(sub => sub.id === submissionId);
    
    if (submissionIndex === -1) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    // Update submission status
    submissions[submissionIndex].status = 'responded';
    submissions[submissionIndex].respondedAt = new Date().toISOString();
    
    // Create response record
    const response = {
      id: uuidv4(),
      submissionId,
      message: message.trim(),
      followUp: followUp || 'none',
      timestamp: new Date().toISOString()
    };
    
    const responses = await readDataFile(RESPONSES_FILE);
    responses.push(response);
    
    // Save both files
    await writeDataFile(SUBMISSIONS_FILE, submissions);
    await writeDataFile(RESPONSES_FILE, responses);
    
    console.log(`Response sent for submission ${submissionId}`);
    
    res.json({ success: true, message: 'Response sent successfully' });
    
  } catch (error) {
    console.error('Error sending admin response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get submission statistics (for monitoring)
app.get('/api/stats', async (req, res) => {
  try {
    const submissions = await readDataFile(SUBMISSIONS_FILE);
    const responses = await readDataFile(RESPONSES_FILE);
    
    const stats = {
      totalSubmissions: submissions.length,
      pendingSubmissions: submissions.filter(sub => sub.status === 'pending').length,
      respondedSubmissions: submissions.filter(sub => sub.status === 'responded').length,
      totalResponses: responses.length,
      categoryCounts: {},
      urgencyCounts: {}
    };
    
    // Count by category
    submissions.forEach(sub => {
      stats.categoryCounts[sub.category] = (stats.categoryCounts[sub.category] || 0) + 1;
    });
    
    // Count by urgency
    submissions.forEach(sub => {
      stats.urgencyCounts[sub.urgency] = (stats.urgencyCounts[sub.urgency] || 0) + 1;
    });
    
    res.json(stats);
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize and start server
async function startServer() {
  await initializeDataFiles();
  
  app.listen(PORT, () => {
    console.log(`SafeSpace Student Help Portal server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the portal`);
    console.log(`Admin API available at http://localhost:${PORT}/api/admin-data`);
  });
}

startServer().catch(console.error);

module.exports = app;