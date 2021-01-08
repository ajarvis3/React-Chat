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
 * Components to make a connection
 * @param {*} props 
 */
function Connect(props)
{
    const [desc, setDesc] = useState("Join Group:");
    const [text, setText] = useState("");

    const handleButton = () => {
        if (props.connected)
        {
            props.connection.send("SubscribeToChat", text);   
            setDesc(text);
            props.setValue(text);
        }
    }

    const handleChange = useCallback((event) => {
        if (props.connected)
        {
            setText(event.target.value);
            // props.setValue(event.target.value);
        }
    }, [props.connected]);

    return (
        <div className="group-connection">
            {desc}
            <textarea 
                className="style-ta" 
                value={text} 
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

    // Sets up receiving message
    useEffect(() => {
        // Sets up signalr callback
        const receiveMessage = (user, message, id) => {
            const newMessages = messages.slice();
            newMessages.push({user: user, message: message, id: id});
            setMessages(newMessages);
        };    

        if (props.connected) {
            props.connection.on(`ReceiveMessage${group}`, receiveMessage);
        }

        // prevent multiple calls to event handler
        return function cleanup() {
            props.connection.off(`ReceiveMessage${group}`, receiveMessage);
        }
    }, [group, messages, props.connected, props.connection]);

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
            />
            <SendMessage connection={props.connection} connected={props.connected} group={group} />
            {messageComponents}
        </div>
    )
}

export default Chat;
