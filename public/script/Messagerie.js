const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    console.log('WebSocket connection established');
};

const storedUserData = localStorage.getItem('user');

if (storedUserData) {
const userData = JSON.parse(storedUserData);
console.log(userData); // Now you can access the user object properties
var userID = userData.id;
}
else {
console.log('No user data found in localStorage');
}

ws.onmessage = (event) => {
    json = JSON.parse(event.data);
    const msg = json.MessageValue;
    
    const chat = document.getElementById('ChatBox');
    const div = document.createElement('div');

    div.classList.add('message');
    if(json.userID == userID){
        div.classList.add('sent'); //message send or message recieved
    }
    else{
        div.classList.add('received');
    }

    const paragraph = document.createElement('p');

    paragraph.classList.add('message-text');
    paragraph.textContent = msg;

    /*const time = document.createElement('span');
    time.classList.add('message-time');
    time.textContent = date;*/

    chat.appendChild(div);
    div.appendChild(paragraph);
    //div.appendChild(time);
}

async function getConvOfUser(userID){
    const response = await fetch (`/getAllConvbyUser/${userID}`);
    const data = await response.json();
    return data;
}
document.addEventListener("DOMContentLoaded",async function() {
    let Convs = await getConvOfUser(userID);
    console.log(Convs);
})

const Form = document.getElementById("Input");
Form.addEventListener("submit", (event) => {
    event.preventDefault();

    const Message = document.getElementById("Message");
    let MessageValue = Message.value;

    let Recipient = 1; //Change!!!!!

    if(Message){
        ws.send(JSON.stringify({MessageValue,userID,Recipient}));
        console.log(MessageValue);
        Message.value = "";
    }
    //const storedUserData = localStorage.getItem('user');
    /*CookieidUser = 0; //A changer

    RecivingUser = 1; //A changer

    IdConv = 0; //A changer

    data = [IdConv,Message,CookieidUser,RecivingUser];

    console.log(data);

    console.log(JSON.stringify(data));

    try {
        const response = await fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }
    catch{
        console.log('Erreur');
    }*/
});

//import { io } from "socket.io-client";