import { useState, useEffect } from 'react';

const sampleQuotes = [
  "You are stronger than you think.",
  "Every day is a fresh start.",
  "Be kind to your mind.",
  "Your feelings are valid.",
  "Small steps every day."
];

function Dashboard({ onLogout }) {
  const [goals, setGoals] = useState([]);
  const [goalInput, setGoalInput] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const random = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
    setQuote(random);
  }, []);

  const addGoal = () => {
    if (goalInput.trim() !== '') {
      setGoals([...goals, goalInput]);
      setGoalInput('');
    }
  };

  const addJournalEntry = () => {
    if (journalEntry.trim() !== '') {
      setEntries([{ text: journalEntry, date: new Date().toLocaleDateString() }, ...entries]);
      setJournalEntry('');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Your Mental Health Dashboard</h2>

      <div className="section quote">
        <h3>Motivational Quote</h3>
        <p>{quote}</p>
      </div>

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

      <div className="section journal">
        <h3>Journal Entry</h3>
        <textarea
          rows="4"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your thoughts here..."
        />
        <button className="primary-button" onClick={addJournalEntry}>Save Entry</button>
        {entries.map((entry, index) => (
          <div key={index} className="journal-entry">
            <strong>{entry.date}</strong>
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
