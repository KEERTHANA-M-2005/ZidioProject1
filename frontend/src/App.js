import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-blue-500 flex justify-center items-center">
      <header className="App-header text-white">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="text-xl">
          Edit <code className="text-yellow-400">src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link text-white hover:text-yellow-300"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
