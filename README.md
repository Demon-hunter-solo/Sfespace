# SafeSpace Student Help Portal

A safe, anonymous, and supportive web platform designed to help students seek assistance for academic, emotional, social, and personal challenges without fear of judgment or exposure.

## 🌟 Features

### For Students
- **Anonymous Help Requests**: Submit concerns completely anonymously with categorization and urgency levels
- **Resource Center**: Access mental health resources, academic support, financial aid information, and crisis hotlines
- **Community Board**: Share and read supportive messages from fellow students anonymously
- **Emergency Support**: Immediate access to crisis hotlines and emergency resources
- **Mobile-Responsive Design**: Access from any device with a beautiful, modern interface

### For Administrators
- **Admin Dashboard**: Monitor pending requests, track response metrics, and manage submissions
- **Response System**: Provide supportive responses to student submissions with follow-up action tracking
- **Real-time Updates**: Dashboard automatically refreshes to show new submissions
- **Analytics**: View submission statistics by category and urgency level

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14.0.0 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd safespace-student-portal
   
   # Or download and extract the files to a folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # For production
   npm start
   
   # For development (with auto-restart)
   npm run dev
   ```

4. **Access the portal**
   - Open your browser and go to `http://localhost:3000`
   - The portal is now ready to use!

## 📱 How to Use

### For Students

1. **Submit Anonymous Help Request**
   - Navigate to the "Anonymous Help" tab (default)
   - Select your concern category (Emotional, Social, Academic, Financial, Family, Other)
   - Choose urgency level (Low, Medium, High)
   - Write your message describing your situation
   - Click "Submit Anonymously" - no personal information is stored

2. **Browse Resources**
   - Go to "Resource Center" tab
   - Explore different support categories:
     - Study Resources & Academic Help
     - Mental Health & Counseling Services
     - Peer Support Groups
     - Financial Aid Information
     - Crisis Hotlines & Emergency Support
     - Campus Resources Directory

3. **Community Support**
   - Visit "Community Board" tab
   - Read supportive messages from other students
   - Share your own words of encouragement anonymously

4. **Emergency Situations**
   - Access "Emergency Support" tab for immediate help
   - Find crisis hotlines, emergency contacts, and warning signs
   - Call 988 (Suicide Prevention Lifeline) for immediate crisis support

### For Administrators

1. **Access Admin Portal**
   - Click on "Admin Portal" tab
   - View dashboard with pending requests and daily statistics

2. **Review Submissions**
   - See all pending submissions sorted by urgency (High → Medium → Low)
   - Each submission shows:
     - Unique ID for reference
     - Category and urgency level
     - Anonymous message content
     - Timestamp
     - Current status

3. **Respond to Requests**
   - Use the Response Form at the bottom of the admin panel
   - Enter the Submission ID from the request you want to respond to
   - Write a supportive, helpful response
   - Select appropriate follow-up action:
     - No follow-up needed
     - Refer to counseling
     - Academic support referral
     - Emergency intervention required
   - Submit response

## 🗂 Project Structure

```
safespace-student-portal/
├── index.html          # Main frontend application
├── server.js           # Backend Express server
├── package.json        # Dependencies and scripts
├── README.md          # This file
└── data/              # Data storage (created automatically)
    ├── submissions.json      # Anonymous help requests
    ├── community_messages.json # Community board messages
    └── responses.json        # Admin responses
```

## 🔒 Privacy & Security

- **Complete Anonymity**: No personal information, IP addresses, or identifying data is stored
- **Secure Data Handling**: All submissions are stored locally in JSON files
- **No User Accounts**: No registration or login required for students
- **Admin Access**: Admin portal is available to authorized personnel only
- **Data Retention**: Consider implementing data retention policies for privacy compliance

## 🌐 API Endpoints

The backend provides the following API endpoints:

- `POST /api/submit-help` - Submit anonymous help request
- `POST /api/community-message` - Post community board message
- `GET /api/community-messages` - Retrieve community messages
- `GET /api/admin-data` - Get admin dashboard data
- `POST /api/admin-response` - Submit admin response
- `GET /api/stats` - Get submission statistics
- `GET /api/health` - Health check endpoint

## 🎨 Customization

### Styling
- The portal uses Tailwind CSS for styling
- Modify the `<style>` section in `index.html` for custom styling
- Colors, fonts, and layout can be easily customized

### Categories & Options
- Edit the category options in the dropdown menus
- Modify urgency levels and follow-up actions
- Add new resource cards in the Resource Center

### Content
- Update crisis hotline numbers for your region
- Modify campus-specific information
- Add local resources and support services

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 3000)

### Data Storage
- Data is stored in JSON files in the `./data` directory
- For production, consider using a proper database (MongoDB, PostgreSQL, etc.)
- Implement backup strategies for data protection

## 📊 Monitoring & Analytics

Access real-time statistics at:
- `http://localhost:3000/api/stats` - Submission statistics
- `http://localhost:3000/api/health` - Server health status

## 🆘 Crisis Resources

**If you or someone you know is in immediate danger:**
- **Call 911** for emergency services
- **Call 988** for Suicide & Crisis Lifeline
- **Text HOME to 741741** for Crisis Text Line

## 🤝 Contributing

This portal is designed to be easily extensible. Consider adding:
- Email notifications for urgent submissions
- Multi-language support
- Advanced filtering and search
- Integration with campus systems
- Mobile app version
- Chat support features

## 📝 License

This project is licensed under the MIT License - see the package.json file for details.

## 💡 Support

For technical support or questions about implementation:
1. Check the server logs for error messages
2. Ensure all dependencies are installed correctly
3. Verify the server is running on the correct port
4. Check that the data directory has proper write permissions

---

**Remember: This portal is designed to provide support and connect students with resources. It should complement, not replace, professional mental health services and emergency response systems.**