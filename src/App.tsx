import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login/login';         
import AddInterview from './Components/AddInterview'; 
import { isLoggedIn } from './Components/Login/login'; 
import type { JSX } from 'react';
import Blankpage from './Components/blankpage';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // NOTE: isLoggedIn should ideally be managed via React State/Context
  // to trigger re-renders, but keeping the original structure for now.
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        
        {/* HEADER: Placed outside of Routes so it appears on all pages */}
        <Header />
        
        <Routes>
          {/* 1. Login route - always accessible */}
          <Route path="/" element={<Login />} />
          
          {/* 2. Protected route - requires user to be logged in */}
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
      <Footer /> 
    </Router>
  );
}

export default App;