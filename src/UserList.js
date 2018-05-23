import React, { Component } from 'react';
import env from './env';

const getPublicUrl = filename =>
  `https://storage.googleapis.com/${env.index.storageBucket}/${filename}`;

const getImageUrl = avatar => {
  if (!avatar) return '';
  if (typeof avatar === 'string') return getPublicUrl(avatar);
  else return URL.createObjectURL(avatar);
};

export default class UserList extends Component {
  constructor(props) {
    super(props);
    // state will be filled with changed fields
    this.state = {};
  }

  render() {
    const { data, updateUser } = this.props;

    return (
      <ul className="user-list">
        {data &&
          data.sort((a, b) => a.date < b.date).map(user => (
            <li key={user.id}>
              <button
                className={`${this.state[user.id] ? '' : 'hidden'}`}
                onClick={() => {
                  updateUser(user.id, this.state[user.id]);
                }}
              >
                apply
              </button>
              <img src={getImageUrl(user.avatar)} alt="" />
              <h3>{user.name}</h3>
              <textarea
                className="username"
                value={
                  (this.state[user.id] && this.state[user.id].username) ||
                  user.username
                }
                onChange={({ target }) => {
                  this.setState({
                    [user.id]: {
                      ...this.state[user.id],
                      username: target.value
                    }
                  });
                }}
              />
              <textarea
                className="email"
                value={
                  (this.state[user.id] && this.state[user.id].email) ||
                  user.email
                }
                onChange={({ target }) => {
                  this.setState({
                    [user.id]: {
                      ...this.state[user.id],
                      email: target.value
                    }
                  });
                }}
              />
              <span className="age">{user.age}</span>
              <span className="biography">{user.biography}</span>
              <span className="date">{user.date}</span>
            </li>
          ))}
      </ul>
    );
  }
}
