import React, { Component } from 'react';
import './Form.css';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      email: '',
      password: '',
      age: '0',
      biography: '',
      image: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input
            name="name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Username:
          <input
            name="username"
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Password:
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Age:
          <select
            name="age"
            value={this.state.age}
            onChange={this.handleChange}
          >
            <option value={0} disabled>chose</option>

            {Array.from({ length: 76 }, (x, i) => i + 10).map(num => (
              <option value={num}>{num}</option>
            ))}
          </select>
        </label>
        <label>
          Biography:
          <textarea
            name="biography"
            value={this.state.biography}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Image:
          <input type="file" accept="image/*" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
