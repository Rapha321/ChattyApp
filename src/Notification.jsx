import React, { Component } from 'react';

export default class Notification extends Component {
  render() {
    return (
      <div className="message system">
        {this.props.content}
        console.log("Notification: ", content)
      </div>
    );
  }
}