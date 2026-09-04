import './App.css';
import RequestForm from './RequestForm';
import RunnerDashboard from './RunnerDashboard';

function App() {
  return (
    <div className="app-container">
      <h1>CampusRun</h1>
      <RequestForm />
      <RunnerDashboard />
    </div>
  );
}

export default App;
