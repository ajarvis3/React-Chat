import './App.css';
import connect from './MySignalR.js';
import Chat from "./Chat.js";
import React, {useState, useEffect} from 'react';

/**
 * Contains logic for adding a group
 * @param {*} props 
 */
function AddGroup(props) 
{

  function handleClick()
  {
    const newChats = props.chats.slice();
    newChats.push(<Chat 
                    key={newChats.length}
                    connected={props.connected}
                    connection={props.connection} />);
    props.setChats(newChats);
  }

  return (
    <div className="add-group">
      <button className="style-button" onClick={handleClick}>Add a Chat</button>
    </div>
  );

}

/**
 * Top-level component
 */
function App() 
{
  const [connected, setConnected] = useState(false);
  const [connection, setConnection] = useState(null);
  const [chats, setChats] = useState([]);

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
    <div className="app">
      <AddGroup 
        chats={chats} 
        setChats={setChats}
        connected={connected}
        connection={connection} />
        <div className="chats">
          {chats}
        </div>
    </div>
  );
}

export default App;
