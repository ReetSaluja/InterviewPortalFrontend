import { useNavigate } from 'react-router-dom';
import './Login/login.css';

const VerificationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="content-wrapper">
        <header className="hero">
          <h1 className="hero-title page-column">Verification</h1>
        </header>
        <section className="form-area">
          <div className="login-card page-column">
            <p>Verification page coming soon...</p>
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

export default VerificationPage;

