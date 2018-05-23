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
    const { data, updateUser, addUpdateListener } = this.props;
    return (
      <ul className="user-list">
        {data.length < 1 ? <div className="spinner" /> : null}
        {data &&
          data.sort((a, b) => a.date < b.date).map(user => (
            <li key={user.id}>
              <button
                className={`apply-changes ${
                  this.state[user.id] ? '' : 'hidden'
                }`}
                onClick={({ target }) => {
                  target.disabled = true;
                  updateUser(user.id, this.state[user.id]);
                  // this function will be called after the next update from the socket
                  addUpdateListener(() => {
                    this.setState({ [user.id]: null });
                    target.disabled = false;
                  });
                }}
              >
                Save
              </button>
              <img src={getImageUrl(user.avatar)} alt="" />
              <h2>
                {user.name}, {user.age}
              </h2>
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
              <textarea
                className="biography"
                value={
                  (this.state[user.id] && this.state[user.id].biography) ||
                  user.biography
                }
                onChange={({ target }) => {
                  this.setState({
                    [user.id]: {
                      ...this.state[user.id],
                      biography: target.value
                    }
                  });
                }}
              />
              {/* <span className="biography">{user.biography}</span> */}
            </li>
          ))}
      </ul>
    );
  }
}
