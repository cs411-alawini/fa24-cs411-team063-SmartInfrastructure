import React from 'react';
import './styles/AuthForm.css';

interface AuthFormProps {
  onClose: () => void; // Function to close the popup
  isRegistering: boolean;
  setIsRegistering: (isRegistering: boolean) => void;
  onLogin: (username: string, user_id: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onClose, isRegistering, setIsRegistering, onLogin}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isRegistering
      ? 'http://localhost:5000/api/register'
      : 'http://localhost:5000/api/login';

    const payload = isRegistering
      ? { username, email, password }
      : { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.error);

      setMessage(data.message);

      // Updates username for header
      if (isRegistering) {
        // After registration, automatically log in the user
        // Optionally, you can redirect them to the login form
        onLogin(username, data.user_id); // Use the returned user_id
        onClose(); // Close the AuthForm after registration
      } else {
        // After login, use the returned user data
        const loginUsername = data.user.username;
        const loginUserId = data.user.user_id;
        if (loginUsername && loginUserId) {
          onLogin(loginUsername, loginUserId);
          onClose(); // Close the AuthForm after login
        }
      }
    } catch (err: any) {
      const error = err as Error;
      setMessage(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-form-overlay">
      <div className="auth-form-container">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2>{isRegistering ? 'Create Account' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>
        <p>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
        {message && <p className="auth-form-message">{message}</p>}
      </div>
    </div>
  );
};

export default AuthForm;
