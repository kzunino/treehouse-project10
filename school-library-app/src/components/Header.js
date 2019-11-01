import React from 'react';
//import { Link } from 'react-router-dom';

export default class Header extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <div className="header">
          <div className="bounds">
            <h1 className="header--logo">Courses</h1>
            <nav><a className="signup" href="/usersignup">Sign Up</a><a className="/signin" href="/usersignin">Sign In</a></nav>
          </div>
        </div>
        <hr></hr>
      </React.Fragment>
    );
  }
};
