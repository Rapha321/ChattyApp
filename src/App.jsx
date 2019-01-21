import React, { Component } from 'react';
import Chatbar from './Chatbar.jsx';
import MessageList from './MessageList.jsx';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Anonymous"},
      messages: [],
      content: ''
    }

    this.handleInsertMessage = this.handleInsertMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }


  //if user change name, send notification to main + message content
  handleInsertMessage(message) {
    const newMessage = {
      type: "postMessage",
      username: message.username,
      content: message.content
    };
    if(this.state.currentUser.name !== message.username) {
      const newNotification = {
        type: "postNotification",
        content: `${this.state.currentUser.name} has changed his name to ${message.username}`
      }
      this.state.currentUser.name = message.username;
      this.sendMessage(newNotification);
      this.sendMessage(newMessage);
    }
    else {
      this.sendMessage(newMessage);
    }
  }

  sendMessage(message) {
    this.socket.send(JSON.stringify(message));
    // document.location.reload();
    console.log('message sent to the server from client');
  }


  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");
    // This event listener is fired when the socket is opened (i.e. connected)
    this.socket.onopen = () => {
      console.log('Client connected');
    };

    this.socket.onmessage = payload => {
      // let serverData = JSON.parse(e.data);
      const json = JSON.parse(payload.data)

      if(Number.isInteger(json.counter)) {
        this.state.onlineUsers = json.counter;
      }
      else {
        console.log(payload);
        switch(json.type) {
          case "incomingMessage":
            console.log("incomingMessage: ", json)
            this.setState({
              messages: [...this.state.messages, json]
            });
            break;
          case "incomingNotification":
            this.setState({
              messages: [...this.state.messages, json]
            });
            break;
          case 'initial-messages':
            console.log('initial-messages: ', json)
            this.setState({
              messages: json.messages
            });
            break;
          default:

        }
      }
    }
  }


  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
            {
              this.state.onlineUsers ? <a className="navbar-counter"> {this.state.onlineUsers} users online</a> : <a className="navbar-counter"> 0 users online</a>
            }
        </nav>

      <main className="messages" >
        <MessageList messages={this.state.messages} />
        <Chatbar currentUser={this.state.currentUser} handleInsertMessage={this.handleInsertMessage} sendMessage={this.sendMessage}/>
      </main>

      </div>
    );
  }
}

