import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [chat, setChat] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:44337/hubs/chat')
            .withAutomaticReconnect()
            .build();

            console.log("newConnection = ", newConnection)

        setConnection(newConnection);
    }, []);

    useEffect(() => {

        console.log("connection = ", connection)

        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected! ', result);

                    connection.on('ReceiveMessage', message => {
                        const updatedChat = [...latestChat.current];
                        updatedChat.push(message);

                        setChat(updatedChat);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async (user, message) => {
        const chatMessage = {
            user: user,
            message: message
        };

        if (connection._connectionStarted) {
            try {
                console.log("connection = ", connection)
                await connection.send('SendMessage', chatMessage);
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            alert('Chưa kêt nối được với máy chủ');
        }
    }

    return (
        <div>
            <ChatInput sendMessage={sendMessage} />
            <hr />
            <ChatWindow chat={chat} />
        </div>
    );
};

export default Chat;