import './App.css';
import RequestForm from './RequestForm';
import RunnerDashboard from './RunnerDashboard';
import TrackRequest from './TrackRequest';

function App() {
  return (
    <div className="app-container">
      <h1>CampusRun</h1>
      <RequestForm />
      <TrackRequest />
      <RunnerDashboard />
    </div>
  );
}

export default App;
