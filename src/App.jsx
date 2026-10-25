import { useState } from 'react';
import './App.css';

// Define the API URL based on environment (Vite uses import.meta.env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);
    setLoading(true);

    try {
      // Use the dynamic API_URL variable here
      const response = await fetch(`${API_URL}/api/url/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container">
      <h1 className="title">URL Shortener</h1>
      <p className="subtitle">Paste your long URL below to create a short, shareable link.</p>

      <form onSubmit={handleSubmit} className="input-group">
        <input
          type="url"
          className="url-input"
          placeholder="https://example.com/very-long-url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <button type="submit" className="shorten-btn" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {error && <div className="error-msg">{error}</div>}

      {shortUrl && (
        <div className="result-card">
          <div className="result-label">Your Shortened Link</div>
          <div className="result-box">
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="short-link">
              {shortUrl}
            </a>
            <button onClick={handleCopy} className="copy-btn">
              {copied ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;