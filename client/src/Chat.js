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
        setMessage("");
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
                placeholder="Message" />
            <button onClick={sendMessage} disabled={!props.connected} className="style-button">
                Send Message
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
    // In props now
    // const [group, setGroup] = useState("");

    // Sets up receiving message
    useEffect(() => {
        // Sets up signalr callback
        const receiveMessage = (user, message, id) => {
            const newMessages = messages.slice();
            newMessages.push({user: user, message: message, id: id});
            setMessages(newMessages);
        };    

        if (props.connected) {
            props.connection.on(`ReceiveMessage${props.group}`, receiveMessage);
        }

        // prevent multiple calls to event handler
        return function cleanup() {
            props.connection.off(`ReceiveMessage${props.group}`, receiveMessage);
        }
    }, [props.group, messages, props.connected, props.connection]);

    const messageComponents = messages.map((value) => {
        return (
            <Message key={value.id} user={value.user} message={value.message} />
        )
    });

    return (
        <div className="chat-group">
            <SendMessage connection={props.connection} connected={props.connected} group={props.group} />
            {messageComponents}
        </div>
    )
}

export default Chat;
