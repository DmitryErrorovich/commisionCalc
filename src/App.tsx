import CommissionCalculator from './components/CommissionCalculator';
import inputJson from './data/input.json';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CommissionCalculator data={inputJson} />
      </header>
    </div>
  );
}

export default App;
