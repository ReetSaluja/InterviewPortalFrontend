import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login/login';         
import AddInterview from './Components/AddInterview'; 
import { isLoggedIn } from './Components/Login/login'; 
import type { JSX } from 'react';
import Header from './Components/Header/Header';
import DashboardHeader from './Components/Header/DashboardHeader';
import Footer from './Components/Footer/Footer';
import Dashboard from './Components/Dashboard';




const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // If user is not logged in → redirect to Login
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// --------------------- APP ROUTES ---------------------
function App() {
  return (
    <Router>
      <div className="App-Layout">
        {/* Common Header */}
        <Header />

        <div className="App-Content">
          <Routes>
            {/* Login Page */}
            <Route path="/" element={<Login />} />

            {/* Dashboard (Protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute> 
                  <>
                    <DashboardHeader title="Interview Dashboard" />
                    <Dashboard />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Add Interview Page (Protected) */}
            <Route
              path="/add-interview"
              element={
                <ProtectedRoute>
                  <AddInterview />
                </ProtectedRoute>
              }
            />
            {/* Forgot Password Page */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<VerificationPage />} />
            <Route path="/code" element={<VerificationCode />} />
          </Routes>
      
        </div>

        {/* Common Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
