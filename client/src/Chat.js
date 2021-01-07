import "./Chat.css";
import React, {useState, useEffect, useCallback} from 'react';

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
    function sendMessage()
    {
        props.connection.send('SendMessage', 'this user', message, props.group);
    }

    function handleChange(event) {
        setMessage(event.target.value);
    }

    return (
        <div className="new-message">
            <textarea value={message} onChange={handleChange} />
            <button onClick={sendMessage} disabled={!props.connected}>Send Message</button>
        </div>
    )
}

/**
 * Components to make a connection
 * @param {*} props 
 */
function Connect(props)
{
    console.log('rerender', props.messages);

    // TODO add user
    const handleButton = () => {
        if (props.connected)
        {
            console.log('here?');
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
            <textarea value={props.value} onChange={handleChange} />
            <button onClick={handleButton} disabled={!props.connected}>Join Group</button>
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
    const receiveMessage = useCallback((user, message, id) => {
            console.log(id, messages);
            const newMessages = messages.slice();
            newMessages.push({user: user, message: message, id: id});
            console.log(newMessages);
            setMessages(newMessages);
            console.log(messages, newMessages);
    });

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
