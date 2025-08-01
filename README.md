# SafeSpace - Anonymous Student Help Portal

SafeSpace is a comprehensive web platform designed to provide safe, anonymous, and judgment-free support for students facing academic, emotional, social, or personal challenges.

## 🌟 Features

### 🔒 Anonymous Help Submission
- Submit concerns without revealing identity
- Categories: Emotional, Social, Academic, Family, Financial, Other
- Automatic resource suggestions based on concern type
- Secure and confidential

### 👥 Peer Support System
- Study buddy matching
- Anonymous group chats
- Topic-based chat rooms (Anxiety, Study Stress, Social Issues, General)
- Emotional support groups

### 📚 Resource Library
- Study guides and academic resources
- Mental health and wellness materials
- Career guidance and planning tools
- Quick links to campus services

### 🚨 Crisis Support
- 24/7 emergency contact information
- Crisis hotlines and text support
- Campus counseling and security contacts
- Immediate help resources

### 💪 Success Stories
- Anonymous testimonials from students
- Inspiring stories of overcoming challenges
- Community building through shared experiences

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript
- **Backend**: Node.js, Express.js
- **Storage**: JSON files (file-based storage for simplicity)
- **Libraries**: 
  - Swiper.js for image carousels
  - CORS for cross-origin requests
  - Crypto for anonymous ID generation

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14.0.0 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project files**
   ```bash
   # If you have the files in a directory, navigate to it
   cd safespace-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # For development with auto-restart
   npm run dev
   
   # Or for production
   npm start
   ```

4. **Access the application**
   - Open your browser and go to: `http://localhost:3000`
   - The server will automatically serve the HTML file and handle API requests

## 📋 API Endpoints

### Help Submissions
- `POST /api/submit-help` - Submit anonymous help request
- `GET /api/admin/stats` - Get submission statistics (admin)

### Success Stories
- `POST /api/submit-story` - Submit anonymous success story
- `GET /api/success-stories` - Get approved success stories

### Chat System
- `POST /api/chat/join` - Join a chat room anonymously
- `GET /api/chat/:roomName/messages` - Get chat messages
- `POST /api/chat/:roomName/send` - Send chat message

### Resources
- `GET /api/crisis-resources` - Get crisis support resources

## 🏗 Project Structure

```
safespace-portal/
├── index.html              # Main frontend file
├── server.js               # Backend server
├── package.json            # Node.js dependencies
├── README.md              # Project documentation
├── help_submissions.json   # Stored help requests (auto-generated)
└── success_stories.json   # Stored success stories (auto-generated)
```

## 🔧 Configuration

### Environment Variables
You can set these environment variables:
- `PORT` - Server port (default: 3000)

### Data Storage
- Help submissions are stored in `help_submissions.json`
- Success stories are stored in `success_stories.json`
- Chat messages are stored in memory (for demo purposes)

## 🛡 Privacy & Security Features

1. **Anonymous IDs**: All interactions use randomly generated anonymous IDs
2. **No Personal Data**: No names, emails, or identifying information required
3. **Secure Submissions**: All form data is validated and sanitized
4. **Confidential Storage**: Sensitive content is stored securely
5. **Crisis Detection**: Automatic resource suggestions for different concern types

## 🎨 User Interface Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Tab-based interface for easy access to features
- **Accessibility**: Keyboard navigation and screen reader friendly
- **Visual Feedback**: Loading states and success confirmations
- **Modern Design**: Clean, calming color scheme with smooth animations

## 📱 Available Tabs/Sections

1. **Anonymous Help** - Submit concerns anonymously
2. **Peer Support** - Connect with other students
3. **Resources** - Access helpful materials and links
4. **Crisis Help** - Emergency contacts and immediate support
5. **Success Stories** - Read inspiring anonymous testimonials

## 🚀 Deployment Options

### Local Development
```bash
npm run dev
```

### Production Deployment
1. **Heroku**:
   ```bash
   # Install Heroku CLI, then:
   heroku create your-safespace-app
   git push heroku main
   ```

2. **Vercel**:
   ```bash
   npx vercel --prod
   ```

3. **Traditional Server**:
   ```bash
   npm install --production
   npm start
   ```

## 🔮 Future Enhancements

- Real-time chat with WebSockets
- Database integration (MongoDB/PostgreSQL)
- User authentication for counselors/admins
- Mobile app development
- AI-powered resource recommendations
- Integration with campus systems
- Multi-language support
- Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support & Contact

For technical issues or questions about the platform:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Mental health professionals who provided guidance on best practices
- Student focus groups for feature feedback
- Open source community for tools and libraries
- Campus counseling services for resource recommendations

---

**Remember**: If you or someone you know is in crisis, please reach out for help immediately. Use the Crisis Help tab in the application or contact emergency services.

**SafeSpace - Where every student can find support, anonymously and without judgment.**