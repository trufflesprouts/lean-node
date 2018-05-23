import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import Form from './Form';
import UserList from './UserList';

const socket = socketIOClient('http://localhost:8080');

export default class App extends Component {
  state = {
    error: null,
    users: []
  };

  componentDidMount() {
    socket.on('users', data => {
      if (data) this.setState({ users: data });
    });
  }

  addUser = user => {
    this.setState({ users: [...this.state.users, user] });
  };

  removeUser = id => {
    this.setState({ users: this.state.users.filter(user => user.id !== id) });
  };

  updateUser = (id, options) => {
    socket.emit('update', { id, ...options });
  };

  setError = error => {
    this.setState({ error });
  };

  render() {
    return (
      <div className="App">
        {this.state.error ? (
          <div className="error-message">
            <span>{this.state.error}</span>
          </div>
        ) : null}
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Form
          addUser={this.addUser}
          removeUser={this.removeUser}
          setError={this.setError}
        />
        <UserList data={this.state.users} updateUser={this.updateUser} />
      </div>
    );
  }
}
