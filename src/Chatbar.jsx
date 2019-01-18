import React, { Component } from 'react';

export default class Chatbar extends Component {

  constructor(props) {
    super()
    this.state = {username: props.currentUser.name, content: ''}

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    // this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleNameChange = (event) => {
    // event.preventDefault()
    this.setState({username: event.target.value});
  }

  handleNameSubmit = (event) => {
    // event.preventDefault()
    if(event.key === "Enter") {
      this.props.currentUser(this.state);
      this.setState({username: event.target.value});
    }
  }

  handleContentChange = (event) => {
    this.setState({content: event.target.value});
  }

  handleSubmit = (event) => {
    if(event.key === "Enter") {
      // console.log(this.state)
      this.props.handleInsertMessage({
        content: this.state.content,
        username: this.state.username
      });
      this.setState({content:''})
    }
  }
  // handleChange (e) {
  //   this.setState({ message: e.target.value });

  // }


  // handleSubmit (e) {
  //   if (e.keyCode === 13) {
  //       e.preventDefault()
  //       this.props.sendMessage( this.state.message )
  //       this.setState({ message: '' })
  //     }
  // }


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