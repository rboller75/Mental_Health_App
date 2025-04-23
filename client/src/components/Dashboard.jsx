import { useState, useEffect } from 'react';

function Dashboard({ onLogout }) {
  const [goals, setGoals] = useState([]);
  const [goalInput, setGoalInput] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [quote, setQuote] = useState('');
  const [mood, setMood] = useState('Happy'); // Default mood

  // Load journal entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    fetchRandomQuote(); // Fetch a random quote when the user logs in
  }, []);

  // Save journal entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random'); // Fetch a random quote
      const data = await response.json();
      setQuote(data.content); // Set the quote text
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote('Stay positive and keep moving forward!'); // Fallback quote
    }
  };

  const addGoal = () => {
    if (goalInput.trim() !== '') {
      setGoals([...goals, goalInput]);
      setGoalInput('');
    }
  };

  const addJournalEntry = () => {
    if (journalEntry.trim() !== '') {
      setEntries([{ text: journalEntry, date: new Date().toLocaleDateString(), mood }, ...entries]);
      setJournalEntry('');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Your Mental Health Dashboard</h2>

      {/* Mood of the Day Section */}
      <div className="section mood">
        <h3>Mood of the Day</h3>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="mood-select"
        >
          <option value="Happy">Happy</option>
          <option value="Calm">Calm</option>
          <option value="Motivated">Motivated</option>
          <option value="Anxious">Anxious</option>
          <option value="Sad">Sad</option>
        </select>
        <p>Your current mood: <strong>{mood}</strong></p>
      </div>

      {/* Motivational Quote Section */}
      <div className="section quote">
        <h3>Motivational Quote</h3>
        <p>{quote}</p>
        <button className="primary-button" onClick={fetchRandomQuote}>
          Generate New Quote
        </button>
      </div>

      {/* Daily Goals Section */}
      <div className="section goals">
        <h3>Daily Goals</h3>
        <input
          type="text"
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          placeholder="Enter a new goal"
        />
        <button className="primary-button" onClick={addGoal}>Add Goal</button>
        <ul>
          {goals.map((goal, index) => (
            <li key={index}>✅ {goal}</li>
          ))}
        </ul>
      </div>

      {/* Journal Entry Section */}
      <div className="section journal">
        <h3>Journal Entry</h3>
        <textarea
          rows="4"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your thoughts here..."
        />
        <button className="primary-button" onClick={addJournalEntry}>Save Entry</button>
        <h4>Past Journal Entries</h4>
        {entries.map((entry, index) => (
          <div key={index} className="journal-entry">
            <strong>{entry.date} - Mood: {entry.mood}</strong>
            <p>{entry.text}</p>
          </div>
        ))}
      </div>

      <button className="primary-button" onClick={onLogout} style={{ marginTop: '2rem' }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
