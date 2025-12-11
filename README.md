# Interview Portal

A comprehensive interview management system built with React, TypeScript, and Vite. This application facilitates candidate management, interview scheduling, and feedback collection for both Admin and Interviewer roles.

## 🚀 Features

### Authentication & User Management
- **Role-based Authentication**: Supports Admin and Interviewer roles
- **Secure Login**: Email and password authentication with validation
- **Password Recovery**: Complete forgot password flow with email verification
- **Session Management**: Secure session storage for user data

### Candidate Management
- **Dashboard**: View all candidates in a paginated, sortable, and filterable table
- **Add Candidates**: Create new candidate profiles with complete information
- **Edit Candidates**: Update candidate details (Admin) or add feedback (Interviewer)
- **Candidate Fields**:
  - Candidate Name
  - Total Experience (e.g., "3 Years")
  - Skill Set
  - Current Organization
  - Notice Period
  - Client Name
  - Client Manager Name
  - Interviewer Assignment
  - Feedback & Remarks

### Role-Based Access Control
- **Admin Role**:
  - Full access to all candidate fields
  - Can add, edit, and manage candidates
  - Can assign interviewers
  - Can view all candidate information

- **Interviewer Role**:
  - Can view candidate information
  - Can add/edit feedback and remarks
  - Read-only access to candidate details (displayed with gray background)

### User Interface
- **Responsive Design**: Mobile-friendly layout
- **Data Tables**: AG Grid integration for efficient data display
- **Form Validation**: Real-time validation with error messages
- **Toast Notifications**: User-friendly success/error notifications
- **Visual Feedback**: Clear distinction between editable and non-editable fields

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Backend API** running on `http://127.0.0.1:8000`

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Front
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📜 Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🏗️ Project Structure

```
Front/
├── src/
│   ├── Components/
│   │   ├── Login/              # Login component
│   │   ├── Dashboard.tsx      # Main dashboard with candidate table
│   │   ├── AddInterview.tsx    # Add/Edit candidate form
│   │   ├── Header/             # Header components
│   │   ├── Footer/             # Footer component
│   │   └── ForgotPassword/    # Password recovery flow
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx               # Application entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
└── vite.config.ts             # Vite configuration
```

## 🔌 API Integration

The application communicates with a backend API running on `http://127.0.0.1:8000`. Key endpoints include:

### Authentication
- `POST /auth/login` - User login
- `GET /auth/users?role={role}` - Get users by role
- `GET /auth/check-email?email={email}` - Check if email exists

### Candidates
- `GET /candidates/paginated?skip={skip}&limit={limit}` - Get paginated candidates
- `GET /candidates/` - Get all candidates
- `POST /candidates/` - Create new candidate
- `PUT /candidates/{id}` - Update candidate

### Interviewers
- `GET /interviewers/` - Get list of interviewers

## 🎨 Key Components

### Login (`/`)
- Email and password authentication
- Role-based access control
- Form validation and error handling

### Dashboard (`/dashboard`)
- Displays candidates in a paginated table
- Role-based column visibility
- Edit functionality for Admin and Interviewer
- Custom pagination controls

### Add/Edit Candidate (`/add-interview`)
- Form for creating or editing candidates
- Role-based field editing permissions
- Visual distinction for non-editable fields (gray background)
- Validation and error handling

### Forgot Password (`/forgot-password`)
- Email verification flow
- OTP code verification
- Password reset functionality

## 🔒 Security Features

- Protected routes requiring authentication
- Session-based authentication
- Role-based access control
- Input validation and sanitization
- Secure password handling

## 🎯 Usage

### Admin Workflow
1. Login with admin credentials
2. View dashboard with all candidates
3. Click "Add Candidate" to create new candidate
4. Click "Edit" on any candidate to modify details
5. Assign interviewers and manage client information

### Interviewer Workflow
1. Login with interviewer credentials
2. View dashboard with assigned candidates
3. Click "Edit" to add feedback and remarks
4. Candidate details are read-only (gray background)
5. Only Feedback and Remarks fields are editable

## 🛡️ Protected Routes

The following routes require authentication:
- `/dashboard` - Candidate dashboard
- `/add-interview` - Add/Edit candidate form

Unauthenticated users are automatically redirected to the login page.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🧪 Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **AG Grid React** - Data tables
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

## 📝 Environment Variables

Currently, API endpoints are hardcoded. To use environment variables:

1. Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

2. Update API calls to use `import.meta.env.VITE_API_BASE_URL`

## 🐛 Troubleshooting

### Common Issues

**API Connection Errors**
- Ensure the backend API is running on `http://127.0.0.1:8000`
- Check CORS settings on the backend
- Verify network connectivity

**Build Errors**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

**Routing Issues**
- Ensure you're using the correct route paths
- Check browser console for errors

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For contributions or issues, please contact the project maintainers.

## 📞 Support

For support or questions, please contact the development team.

---

**Built with ❤️ using React, TypeScript, and Vite**
