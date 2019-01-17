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


  sendMessage(message) {
    this.socket.send(JSON.stringify(message));
    console.log('message sent to the server from client');
  }

  handleInsertMessage(message) {
    if(this.state.currentUser.name !== message.username) {
      const newNotification = {type: "postNotification", content: `${this.state.currentUser.name} has changed their name to ${message.username}`}
      this.state.currentUser.name = message.username;
      // console.log('newNotification: ', newNotification);
      this.sendMessage(newNotification);
    }
    // send message to server
    const newMessage = {
      type: "postMessage",
      username: message.username,
      content: message.content};
    this.sendMessage(newMessage);
        console.log('message: ', message);

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
      // console.log('data coming back from server: ', json);
      if(Number.isInteger(json.counter)) {
        this.state.onlineUsers = json.counter;
      }
      else {
        switch(json.type) {
          case "incomingMessage":
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
            this.setState({
              messages: json.messages
            });
            break;
          default:
           //show error in console if message type is unknown
            throw new Error("Unknown event type: " + json.type);
        }
      }
    }

  }




  //   // console.log("componentDidMount <App />");
  //   setTimeout(() => {
  //     console.log("Simulating incoming message");
  //     // Add a new message to the list of messages in the data store
  //     const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
  //     const messages = this.state.messages.concat(newMessage)
  //     // Update the state of the app component.
  //     // Calling setState will trigger a call to render() in App and all child components.
  //     this.setState({messages: messages})
  //   }, 1000);
  // }


  // sendMessage(content) {
  //   const message = {username: this.state.currentUser.name, content: content}
  //   this.setState({
  //     messages: [...this.state.messages, message]
  //
  //   })
  // }

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
        <Chatbar currentUser={this.state.currentUser} handleInsertMessage={this.handleInsertMessage}/>
      </main>

      </div>
    );
  }
}


