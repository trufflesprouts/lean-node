import React, { Component } from 'react';
import env from './env';

const getPublicUrl = filename =>
  encodeURI(
    `https://storage.googleapis.com/${env.index.storageBucket}/${filename}`
  );

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

    const sortedData = data.slice(0).sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      if (a.date === b.date) return 0;
    });

    return (
      <ul className="user-list">
        {data.length < 1 ? <div className="spinner" /> : null}
        {sortedData.map(user => (
          <li key={user.id}>
            <button
              className={`apply-changes ${this.state[user.id] ? '' : 'hidden'}`}
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
            <div
              className="user-image"
              style={{ backgroundImage: `url(${getImageUrl(user.avatar)})` }}
            />
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
                (this.state[user.id] && this.state[user.id].email) || user.email
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
