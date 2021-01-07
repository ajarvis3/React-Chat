import logo from './logo.svg';
import './App.css';
import connect from './MySignalR.js';
import Chat from "./Chat.js";
import React, {useState, useEffect} from 'react';

function App() {
  const [connected, setConnected] = useState(false);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const url = 'https://localhost:5001/chathub';
    setConnection(connect(url));
    if (connection !== null) {
      connection.on('OnConnected', () => {
        setConnected(true);
      });        
    }
  }, [connection])

  return (
    <div className="App">
      <Chat connection={connection} connected={connected} />
    </div>
  );
}

export default App;
