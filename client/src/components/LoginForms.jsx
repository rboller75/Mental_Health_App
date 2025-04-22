import { useState } from 'react';

function LoginForms({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Simulate login logic
    console.log('Logging in with:', email, password);
    onLogin(); // Notify parent
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit" className="primary-button">Log In</button>
    </form>
  );
}

export default LoginForms;
