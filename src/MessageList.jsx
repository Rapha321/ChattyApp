import React, { Component } from 'react';
import Message from './Message.jsx';
import Notification from './Notification.jsx';

class MessageList extends Component {
  render() {
    return (
      <main className="messages">
        {
          this.props.messages.map(( message, index ) => {
            if (this.props.type === 'incomingNotification') {
              return <Notification key={index}
                                   content={message.content}/>
            }
            else {
              return <Message key={index}
                              username={message.username}
                              content={message.content}/>
            }
          })
        }
      </main>
    );
  }
}

export default MessageList;