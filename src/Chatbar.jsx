import React, { Component } from 'react';

export default class Chatbar extends Component {

  constructor(props) {
    super()
    this.state = {username: props.currentUser.name, content: ''}

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleNameChange = (event) => {
    this.setState({username: event.target.value});
  }

  handleNameSubmit = (event) => {
    if(event.key === "Enter") {
      // this.props.currentUser(this.state);
      this.setState({username: event.target.value});
    }
  }

  handleContentChange = (event) => {
    this.setState({content: event.target.value});
  }

  handleSubmit = (event) => {
    if(event.key === "Enter") {
      this.props.handleInsertMessage({
        username: this.state.username,
        content: this.state.content
      });
      this.setState({content:''})
    }
  }

  render() {
    return (
      <form className="chatbar">
        <input
          className="chatbar-username"
          type="text"
          placeholder="Your Name (Optional)"
          value={this.state.username}
          onChange={this.handleNameChange}
          onKeyPress={this.handleNameSubmit}/>
        <input
          className="chatbar-message"
          type="text"
          onChange={this.handleContentChange}
          onKeyPress={this.handleSubmit}
          value={this.state.content}
          placeholder="Type a message and hit ENTER"/>
      </form>
    )
  }
}