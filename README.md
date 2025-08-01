# SafeSpace - Anonymous Student Help Portal

A comprehensive, anonymous support platform designed to provide safe, non-judgmental assistance to students facing academic, emotional, social, or personal challenges.

## 🌟 Features

### For Students
- **Anonymous Help Requests**: Submit concerns without revealing identity
- **Multiple Support Categories**: Academic, emotional, social, financial, and career guidance
- **Real-time Anonymous Chat**: Instant support from trained counselors
- **Community Support**: Share and read success stories anonymously
- **Wellness Tracking**: Daily mood check-ins and wellness resources
- **Resource Library**: Comprehensive help resources and links
- **Mobile-Responsive Design**: Access from any device

### For Counselors
- **Admin Dashboard**: Manage and respond to help requests
- **Real-time Notifications**: Instant alerts for new requests
- **Priority Management**: Crisis requests highlighted and prioritized
- **Response Tracking**: Monitor response rates and analytics
- **Student Mood Analytics**: Aggregate wellness trends
- **Content Moderation**: Approve and manage success stories

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.0.0 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/safespace-portal.git
   cd safespace-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/safespace
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Start MongoDB**
   ```bash
   # Using homebrew on macOS
   brew services start mongodb-community
   
   # Using systemctl on Linux
   sudo systemctl start mongod
   
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Student Portal: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin

## 📋 API Documentation

### Student Endpoints

#### Submit Help Request
```http
POST /api/submit-help-request
Content-Type: application/json

{
  "category": "emotional",
  "urgency": "medium",
  "message": "I'm feeling overwhelmed with school work and need someone to talk to."
}
```

#### Get Recent Responses
```http
GET /api/recent-responses
```

#### Submit Success Story
```http
POST /api/submit-success-story
Content-Type: application/json

{
  "story": "I overcame my anxiety by joining study groups and making new friends."
}
```

#### Log Mood
```http
POST /api/log-mood
Content-Type: application/json

{
  "mood": "good",
  "sessionId": "optional-session-id"
}
```

### Counselor Endpoints

#### Get Pending Requests
```http
GET /api/counselor/pending-requests
```

#### Submit Response
```http
POST /api/counselor/respond
Content-Type: application/json

{
  "requestId": "request-uuid",
  "response": "Thank you for reaching out. Here are some resources that might help...",
  "counselorId": "counselor-id",
  "isPublic": false
}
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time Communication**: Socket.IO
- **Security**: Helmet, CORS, Rate Limiting
- **UI Framework**: Tailwind CSS with custom components

### Database Schema

#### Help Requests
```javascript
{
  id: String (UUID),
  category: String (enum),
  urgency: String (enum),
  message: String,
  status: String (enum),
  responses: [{
    counselorId: String,
    message: String,
    timestamp: Date,
    isPublic: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Success Stories
```javascript
{
  id: String (UUID),
  story: String,
  isApproved: Boolean,
  createdAt: Date
}
```

#### Mood Logs
```javascript
{
  id: String (UUID),
  mood: String (enum),
  sessionId: String,
  createdAt: Date
}
```

## 🔒 Security Features

- **Anonymous by Design**: No personal information collected
- **Rate Limiting**: Prevents spam and abuse
- **Input Validation**: Sanitizes all user inputs
- **Content Security Policy**: Prevents XSS attacks
- **HTTPS Enforcement**: Secure data transmission
- **Session Management**: Secure anonymous sessions

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Accessibility**: WCAG 2.1 AA compliant
- **Dark/Light Mode**: User preference support
- **Intuitive Navigation**: Tab-based interface
- **Visual Feedback**: Loading states and notifications
- **Emoji Integration**: Friendly mood tracking

## 📊 Analytics Dashboard

The admin dashboard provides insights into:
- Total help requests and response rates
- Student mood trends over time
- Category distribution of requests
- Urgency level statistics
- Counselor performance metrics

## 🚨 Crisis Management

- **Priority System**: Crisis requests are highlighted
- **Immediate Alerts**: Real-time notifications for urgent cases
- **Escalation Procedures**: Built-in crisis hotline integration
- **Response Time Tracking**: Monitor critical response times

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | localhost:27017 |
| `JWT_SECRET` | JWT signing secret | - |
| `NODE_ENV` | Environment mode | development |

### Rate Limiting
- General API: 100 requests per 15 minutes
- Submissions: 5 submissions per hour per IP
- Crisis requests: Bypass rate limiting

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 📦 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t safespace-portal .

# Run with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. Set `NODE_ENV=production`
2. Configure production MongoDB
3. Set up SSL certificates
4. Configure reverse proxy (nginx)
5. Set up process manager (PM2)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For technical support or questions:
- Create an issue on GitHub
- Email: support@safespace.edu
- Documentation: [Wiki](https://github.com/your-username/safespace-portal/wiki)

## 🏥 Crisis Resources

If you or someone you know is in immediate danger:
- **Emergency**: 911
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 988
- **Crisis Chat**: [suicidepreventionlifeline.org](https://suicidepreventionlifeline.org)

## 🙏 Acknowledgments

- Mental health professionals who provided guidance
- Student beta testers for valuable feedback
- Open source community for excellent tools and libraries
- Educational institutions supporting student wellness

---

**Remember**: This platform is designed to supplement, not replace, professional mental health services. Always encourage students to seek professional help when needed.