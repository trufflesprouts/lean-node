import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';

// validation messages
const messages = {
  username:
    'Has to be a combination of letters and numbers and longer than 8 digits',
  email: 'Not a valid email',
  name: "Required, numbers aren't allowed",
  password:
    'Has to contain letters and numbers with at least one Capital letter',
  biography: 'Required, has to have least 10 digits',
  age: 'Required'
};

// check if filed is valid using regex, takes name of field and its value
const isValid = (name, value) => {
  let val = value;
  let regex;
  switch (name) {
    case 'username':
      regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){9,}.*$/;
      break;
    case 'email':
      regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      val = value.toLowerCase();
      break;
    case 'name':
      regex = /^([^0-9]*)$/;
      break;
    case 'password':
      regex = /^.*(?=.*[A-Z])[a-zA-Z0-9]+$/;
      break;
    case 'biography':
      regex = /^((.|\n)*[0-9]){10,}.*$/;
      break;
    case 'age':
      regex = /[^0]+/;
      break;
    default:
      return true;
  }
  return regex.test(val) && value.length > 0;
};

const initialState = {
  name: '',
  username: '',
  email: '',
  password: '',
  age: '0',
  biography: '',
  avatar: null,
  validation: {}
};

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleChange = ({ target }) => {
    // Handle all changes in one function by matching input name with state key
    // Note: Make sure input names match state keys
    if (target.name === 'avatar') this.setState({ avatar: target.files[0] });
    else this.setState({ [target.name]: target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    // validate all form before submission
    if (!this.validate()) return;

    const { validation, ...userInfo } = this.state;
    // create an ew unique id
    const guid = uuidv4();
    // use form data because of the image
    const formData = new FormData();
    // add the id to user data
    formData.append('id', guid);
    // append each field because apparently its the only way
    Object.keys(userInfo).forEach(key => {
      formData.append(key, userInfo[key]);
    });
    // eagerly add user to ui
    this.props.addUser({ ...userInfo, id: guid, date: Date.now() });

    // post form data to the api, check controllers/add.js
    fetch('/add', { method: 'POST', body: formData })
      .then(res => {
        if (!res.ok && res.status !== 422) throw Error(res.statusText);
        return res.json();
      })
      .then(res => {
        // clear form
        this.setState(initialState);
        // clear errors
        this.props.setError(null);
      })
      .catch(({ message }) => {
        // remove the user from ui
        this.props.removeUser(guid);
        // display errors
        this.props.setError(message);
      });
  };

  validate = evt => {
    const fields = {};

    // if there's an event validate its target, otherwise validate whole form (like onSubmit)
    if (evt) {
      const { name, value } = evt.target;
      fields[name] = isValid(name, value);
    } else {
      Object.keys(this.state).forEach(name => {
        fields[name] = isValid(name, this.state[name]);
      });
    }

    // display validation errors
    this.setState({
      validation: {
        ...this.state.validation,
        ...fields
      }
    });

    // return true if all fields are valid
    return Object.keys(fields).every(name => fields[name] === true);
  };

  validationMessage = name => {
    // if (this.state.validation[name] === false) {
    //   return <span className="invalid">{messages[name]}</span>;
    // }
  };

  render() {
    const { validation } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <span>Name</span>
          <input
            name="name"
            className={validation.name === false ? 'invalid' : ''}
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
            onBlur={this.validate}
          />
        </label>
        <label>
          <span>Username</span>
          <input
            name="username"
            className={validation.username === false ? 'invalid' : ''}
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
            onBlur={this.validate}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            className={validation.email === false ? 'invalid' : ''}
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            onBlur={this.validate}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            name="password"
            className={validation.password === false ? 'invalid' : ''}
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            onBlur={this.validate}
          />
        </label>
        <label>
          <span>Biography</span>
          <textarea
            name="biography"
            className={validation.biography === false ? 'invalid' : ''}
            value={this.state.biography}
            onChange={this.handleChange}
            onBlur={this.validate}
          />
        </label>
        <label className="age">
          <span>Age</span>
          <select
            name="age"
            className={validation.age === false ? 'invalid' : ''}
            value={this.state.age}
            onChange={this.handleChange}
            onBlur={this.validate}
          >
            <option value={0} disabled>
              chose
            </option>

            {Array.from({ length: 76 }, (x, i) => i + 10).map(num => (
              <option value={num} key={num}>
                {num}
              </option>
            ))}
          </select>
        </label>
        <label className={`avatar ${this.state.avatar ? 'has-image' : ''}`}>
          {this.state.avatar ? (
            <img src={URL.createObjectURL(this.state.avatar)} alt="" />
          ) : null}
          <span>Choose Image</span>
          <input
            name="avatar"
            type="file"
            accept="image/*"
            onChange={this.handleChange}
          />
        </label>
        <input className="submit" type="submit" value="Add" />
        <div className="suggestions">
          {Object.keys(validation)
            .filter(field => validation[field] === false)
            .map(field => (
              <div key={field}>
                <span>{field}</span>
                {messages[field]}
              </div>
            ))}
        </div>
      </form>
    );
  }
}
