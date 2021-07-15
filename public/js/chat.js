var loc = window.location.pathname;
var dir = loc.substring(loc.lastIndexOf('/')+1);

const chatForm = document.querySelector('.chat-input');
const chatInput = document.querySelector('.chat-input input');
const sendBtn = document.querySelector('.chat-send');
const chatMsgBody = document.querySelector('.chat-messages-body');

if(dir == 'chat'){
    const socket = io();
    socket.on('connect', ()=>{
        sendConnectMessage(name)

        socket.emit('join-room', id)

        // send message when click on send btn
        chatForm.addEventListener('submit', (e)=> {
            e.preventDefault();
            const data = {
                message: chatInput.value,
                sender: 'You'
            }
            socket.emit('send-message', {...data}, id);  
            displayMsg(data, 'right');
            chatInput.value="";
        })

        // recieve message and display it
        socket.on('recieve-message', (data)=>{
            displayMsg(data, 'left')
        })
    })
}

const sendConnectMessage = (name) => {
    const connectedMsgDiv = document.createElement('div');
    connectedMsgDiv.classList.add('message-info');
    const message = document.createElement('p');
    message.innerText = `You are connected to the chat section with ${name}`;
    connectedMsgDiv.appendChild(message);
    chatMsgBody.appendChild(connectedMsgDiv);
}

const displayMsg = (data, position) => {
    const messageDiv = document.createElement('div');
    const sender = document.createElement('h5');
    const message = document.createElement('p');
    const time = document.createElement('time');
    messageDiv.classList.add("message");
    messageDiv.classList.add(`message-${position}`);
    sender.innerText = data.sender;
    message.innerText = data.message;
    const currentTime = new Date
    time.innerText = currentTime.toLocaleTimeString();
    messageDiv.appendChild(sender);
    messageDiv.appendChild(message);
    messageDiv.appendChild(time);
    chatMsgBody.appendChild(messageDiv);
}