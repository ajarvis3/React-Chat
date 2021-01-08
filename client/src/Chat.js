import "./Chat.css";
import React, {useState, useEffect} from 'react';

/**
 * Represents a single message
 * @param {*} props 
 */
function Message(props)
{
    return (
        <div className="message">
            <div className="user-tag">
                User: {props.user}
            </div>
            <div className="message-text">
                {props.message}
            </div>
        </div>
        );
}

/**
 * Used for sending a message
 * @param {*} props 
 */
function SendMessage(props)
{
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");

    function sendMessage()
    {
        props.connection.send('SendMessage', name, message, props.group);
    }

    function handleChange(event) {
        setMessage(event.target.value);
    }

    function handleName(event) {
        setName(event.target.value);
    }

    return (
        <div className="new-message">
            New Message:
            <textarea 
                className="style-ta" 
                value={name} 
                onChange={handleName} 
                placeholder="Name" />
            <textarea 
                className="style-ta" 
                value={message} 
                onChange={handleChange} 
                placeholder="Group" />
            <button onClick={sendMessage} disabled={!props.connected} className="style-button">
                Send Message
            </button>
     </div>
    )
}

/**
 * Components to make a connection
 * @param {*} props 
 */
function Connect(props)
{
    const handleButton = () => {
        if (props.connected)
        {
            props.connection.send("SubscribeToChat", props.value);    
        }
    }

    function handleChange(event)
    {
        if (props.connected)
        {
            props.setValue(event.target.value);
        }
    }

    return (
        <div className="group-connection">
            Join Group:
            <textarea 
                className="style-ta" 
                value={props.value} 
                onChange={handleChange} 
                placeholder="Group Name"/>
            <button onClick={handleButton} disabled={!props.connected} className="style-button">
                Join Group
            </button>
        </div>
    )
}

/**
 * Represents a single chat group
 * @param {*} props 
 */
function Chat(props)
{
    const [messages, setMessages] = useState([]);
    const [group, setGroup] = useState("");
    console.log("top", messages);

    // Sets up signalr callback
    const receiveMessage = (user, message, id) => {
            const newMessages = messages.slice();
            newMessages.push({user: user, message: message, id: id});
            setMessages(newMessages);
    };

    // Sets up receiving message
    useEffect(() => {
        if (props.connected) {
            props.connection.on(`ReceiveMessage${group}`, receiveMessage);
        }
    });

    const messageComponents = messages.map((value) => {
        return (
            <Message key={value.id} user={value.user} message={value.message} />
        )
    });

    return (
        <div className="chat-group">
            <Connect 
                value={group} 
                setValue={setGroup}
                connected={props.connected} 
                connection={props.connection}
                messages={messages}
                setMessages={setMessages}
                receiveMessage={receiveMessage}
                />
            <SendMessage connection={props.connection} connected={props.connected} group={group} />
            {messageComponents}
        </div>
    )
}

export default Chat;
