import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login/login';         
import AddInterview from './Components/AddInterview'; 
import { isLoggedIn } from './Components/Login/login'; 
import type { JSX } from 'react';
import Header from './Components/Header/Header';
import Footer from "./Components/Footer/Footer";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // NOTE: isLoggedIn should ideally be managed via React State/Context
  // to trigger re-renders, but keeping the original structure for now.
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ... (imports)

function App() {
  return (
    <Router>
      {/* This is the main wrapper. We will use CSS to make its child (the content)
        grow to fill the space between the Header and the Footer.
      */}
      <div className="App-Layout"> 
        
        <Header />
        
        {/* The main content area */}
        <main className="App-Content"> 
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
          </Routes>
        </main>
        
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;