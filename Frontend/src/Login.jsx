import { auth, googleProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import "./Login.css";
import logo from "./assets/blacklogo.png";

export default function Login({ onLogin }) {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed! Try again.");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-brand">
          <img src={logo} alt="logo" />
          <span>AlphaAI</span>
        </div>
        <p className="login-built">Built by Akash & Anand</p>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-card">
          <img src={logo} alt="AlphaAI" className="login-card-logo" />
          <h1>Welcome to AlphaAI</h1>
          <p>Sign in with your Google account to continue</p>

          <button className="google-btn" onClick={handleGoogleLogin}>
            <img src="https://www.google.com/favicon.ico" alt="G" />
            Continue with Google
          </button>

          <small>Only the real users are allowed</small>
        </div>

        <p className="login-footer">AlphaAI can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}