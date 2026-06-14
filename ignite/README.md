# Ignite - Running Lifestyle App 🏃‍♂️

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.x-green)](https://www.djangoproject.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A modern, feature-rich web application empowering runners to track their fitness journey, set goals, and connect with fellow runners.

## 🚀 Key Features

- **Smart Run Tracking**: GPS-based run tracking with real-time stats
- **Social Integration**: Share achievements, join challenges
- **Personalized Training**: AI-powered training recommendations
- **Achievement System**: Unlock badges and rewards
- **Interactive Maps**: Discover popular running routes

## Technologies Used

### Frontend
- React.js with TailwindCSS
- State Management: Context API
- Authentication: JWT
- Styling: Tailwind CSS with Dark Mode
- Icons: Lucide React
- Animations: Custom CSS transitions

### Backend
- Django REST Framework
- PostgreSQL Database
- JWT Authentication
- CORS Support
- Environment Variables

<!-- ## 📁 Project Structure

### Frontend Structure
```
frontend/
├── public/                 # Public static files
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication related components
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── dashboard/     # Dashboard components
│   │   │   ├── Stats.js
│   │   │   └── Profile.js
│   │   ├── common/        # Reusable components
│   │   │   ├── Button.js
│   │   │   └── Input.js
│   │   └── layout/        # Layout components
│   │       ├── Header.js
│   │       └── Footer.js
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.js
│   ├── services/         # API service integration
│   │   ├── api.js
│   │   └── auth.js
│   ├── utils/           # Helper functions
│   │   └── validators.js
│   ├── styles/          # Global styles
│   │   └── globals.css
│   └── App.js
└── package.json
```

### Backend Structure
```
backend/
├── apps/
│   ├── users/            # User management app
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── runs/             # Run tracking app
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── challenges/       # Challenge system app
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
├── core/                # Core project settings
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── utils/              # Utility functions
│   └── helpers.py
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
├── manage.py
└── README.md
``` -->

## ✨ Features

<!-- ### User Experience
- Intuitive dashboard with run statistics
- Real-time run tracking with GPS integration
- Community features (followers, groups, challenges)
- Achievement badges and reward system
- Customizable user profiles
- Multi-language support -->

<!-- ### Technical Features
- Progressive Web App (PWA) support
- Offline functionality
- Push notifications
- Data synchronization
- Performance optimization
- Security features -->

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v17 or higher)
- Python (v3.12 or higher)
- PostgreSQL (v17 or higher)

Clone the repository:
 ```bash
git clone https://github.com/xecanto/ignite.git
```

### Frontend
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment variables:
    - Copy `.env.example` to `.env`
    - Update the variables as needed

3. Start the development server:
```bash
npm start
```

### Backend
1. Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

2. Install dependencies:
cd backend
pip install -r requirements.txt

3. Configure environment variables:
    - Copy `.env.example` to `.env`
    - Update the variables as needed

4. Run migrations:
python manage.py makemigrations
python manage.py migrate

5. Start server
python manage.py runserver

## 🔧 Development

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Follow PEP 8 for Python code

### Testing
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
python manage.py test
```

## 📚 API Documentation

API documentation is available at `/api/docs` after starting the server.

### Main Endpoints
- `/api/auth/` - Authentication endpoints
- `/api/runs/` - Run tracking endpoints
- `/api/users/` - User management
- `/api/challenges/` - Challenge system

<!-- ## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request -->

## 🐛 Troubleshooting

Common issues and solutions:
- Database connection issues: Check PostgreSQL service
- npm install fails: Clear npm cache
- Migration errors: Reset migrations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Project Link: [GitHub Repository](https://github.com/xencanto/ignite)
- Report bugs: [Issue Tracker](https://github.com/xencanto/ignite/issues)

---
Made with ❤️ by the Ignite Team