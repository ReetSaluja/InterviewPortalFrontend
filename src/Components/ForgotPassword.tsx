import { useNavigate } from 'react-router-dom';
import './Login/login.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="content-wrapper">
        <header className="hero">
          <h1 className="hero-title page-column">Forgot Password</h1>
        </header>
        <section className="form-area">
          <div className="login-card page-column">
            <p>Forgot Password functionality coming soon...</p>
            <button 
              type="button" 
              className="sign-in-button" 
              onClick={() => navigate('/')}
            >
              Back to Login
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ForgotPassword;

