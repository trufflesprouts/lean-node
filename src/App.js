import React, { Component } from 'react';
import Form from './Form';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Form />
      </div>
    );
  }
}
