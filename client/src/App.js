import './App.css';
// import connect from './MySignalR.js';
import Chat from "./Chat.js";
import React, {useState, useEffect, useCallback} from 'react';
import * as signalR from "@microsoft/signalr";

const connections = {};

function connect(url, setConnected) {
    if (connections[url]) {
        return connections[url];
    }
    const connection = new signalR.HubConnectionBuilder()
                            .withUrl(url)
                            .configureLogging(signalR.LogLevel.Information)
                            .build();
    connection.start();
    connection.on('OnConnected', () => {
        setConnected(true);
    });  
    connections[url] = connection;
    return connection;
}

/**
 * Contains logic for adding a group
 * @param {*} props 
 */
function AddGroup(props) 
{
  const [group, setGroup] = useState("");
  const {chats, connection, setChats} = props;

  const handleButton = useCallback(() => {
    connection.send("SubscribeToChat", group);   
    const newChats = chats.slice();
    newChats.push(group);
    setChats(newChats);
    setGroup("");    
  }, [chats, group, connection, setChats]);

  const handleChange = (event) => {
      setGroup(event.target.value);
  };

  return (
    <div className="add-group">
            <textarea 
                className="style-ta style-text-box" 
                value={group} 
                onChange={handleChange} 
                placeholder="Group Name"/>
            <button onClick={handleButton} className="style-button">
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
  const [connection, setConnection] = useState(null);
  const [connected, setConnected] = useState(false);
  const [chats, setChats] = useState([]);

  const deleteChat = useCallback((name, chats) => {
    const index = chats.findIndex((elem) => {
      return elem === name;
    });
    const newChats = chats.slice(); 
    newChats.splice(index, 1);
    setChats(newChats);
    connection.send("UnsubscribeChat", name);
}, [connection]);

  useEffect(() => {

    const baseUrl = process.env.NODE_ENV === 'development' 
                      ? "https://localhost:5001"
                      : "https://signalr-react-chatapp.azurewebsites.net";
    const url = `${baseUrl}/chathub`;
    setConnection(connect(url, setConnected));
  }, []);

  const chatElems = chats.map((value) => {
    return (<Chat 
    key={value}
    connection={connection}
    group={value} 
    delete={deleteChat} 
    chats={chats} />);
  });

  return (
    <div className="app">
      {connected ? 
        <AddGroup 
          chats={chats} 
          setChats={setChats}
          connection={connection} 
          deleteChat={deleteChat} />
          : "Not Connected"}
      <div className="chats">
        {chatElems}
      </div>
    </div>
  );
}

export default App;
