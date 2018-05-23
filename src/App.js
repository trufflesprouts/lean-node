import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import Form from './Form';
import UserList from './UserList';

const socket = socketIOClient('http://localhost:8080');

export default class App extends Component {
  updateListeners = [];
  state = {
    error: null,
    users: [],
    updated: null
  };

  componentDidMount() {
    // start socket
    socket.on('users', data => {
      // when user data arrives set state
      if (data) this.setState({ users: data, updated: Date.now() });
    });
  }

  addUser = user => {
    // manually add users to the ui
    this.setState({ users: [...this.state.users, user] });
  };

  removeUser = id => {
    // remove from ui
    this.setState({ users: this.state.users.filter(user => user.id !== id) });
  };

  updateUser = (id, options) => {
    // send to socket message to the server to update user data
    socket.emit('update', { id, ...options });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.updated !== this.state.updated) {
      this.updateListeners.forEach(fn => {
        fn();
      });
      this.updateListeners = [];
    }
  }

  // called after socket update
  addUpdateListener = cb => {
    this.updateListeners.push(cb);
  };

  setError = error => {
    this.setState({ error });
  };

  render() {
    return (
      <div className="App">
        <div className={`error-message ${this.state.error ? 'visiable' : ''}`}>
          <span>{this.state.error}</span>
          <button
            onClick={() => {
              this.setError(null);
            }}
          >
            x
          </button>
        </div>
        <div className="flex">
          <Form
            addUser={this.addUser}
            removeUser={this.removeUser}
            setError={this.setError}
          />
          <UserList
            data={this.state.users}
            updated={this.state.updated}
            updateUser={this.updateUser}
            addUpdateListener={this.addUpdateListener}
          />
        </div>
      </div>
    );
  }
}
