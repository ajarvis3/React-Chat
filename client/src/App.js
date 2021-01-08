import './App.css';
import connect from './MySignalR.js';
import Chat from "./Chat.js";
import React, {useState, useEffect, useCallback} from 'react';

/**
 * Contains logic for adding a group
 * @param {*} props 
 */
function AddGroup(props) 
{
  const [group, setGroup] = useState("");

  function deleteChat(name)
  {
    const index = props.chats.findIndex((elem) => {
      return elem.key === name;
    });
    const newChats = props.chats.splice(index, 1);
    props.setChats(newChats);
    props.connection.send("UnsubscribeChat", name);
  }

  const handleButton = () => {
    if (props.connected)
    {
        props.connection.send("SubscribeToChat", group);   
        const newChats = props.chats.slice();
        newChats.push(<Chat 
                        key={group}
                        connected={props.connected}
                        connection={props.connection}
                        group={group} 
                        delete={(name) => deleteChat(name)}/>);
        props.setChats(newChats);
        setGroup("");    
    }
  }

  const handleChange = useCallback((event) => {
      if (props.connected)
      {
          setGroup(event.target.value);
      }
  }, [props.connected]);

  return (
    <div className="add-group">
            <textarea 
                className="style-ta" 
                value={group} 
                onChange={handleChange} 
                placeholder="Group Name"/>
            <button onClick={handleButton} disabled={!props.connected} className="style-button">
                Join Group
            </button>
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
