import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login/login';         
import AddInterview from './Components/AddInterview'; 
import { isLoggedIn } from './Components/Login/login'; 
import type { JSX } from 'react';
import Blankpage from './Components/blankpage';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 1. Login route - always accessible */}
          <Route path="/" element={<Login />} />
          
          {/* 2. Protected route - checks session before rendering AddInterview */}
          <Route 
            path="/add-interview" 
            element={
              <ProtectedRoute>
                <AddInterview />
              </ProtectedRoute>
            } 
          />

          <Route path="/blank" element={<Blankpage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;