import React, {Component} from 'react';

export default class UserSignIn extends Component {
    render(){
      return(
        <div className="bounds">
          <div className="grid-33 centered signin">
            <h1>Sign In</h1>
            <div>
              <form>
                <div><input id="emailAddress" name="emailAddress" type="text" className placeholder="Email Address" defaultValue /></div>
                <div><input id="password" name="password" type="password" className placeholder="Password" defaultValue /></div>
                <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign In</button><button className="button button-secondary" onclick="event.preventDefault(); location.href='index.html';">Cancel</button></div>
              </form>
            </div>
            <p>&nbsp;</p>
            <p>Don't have a user account? <a href="/usersignup">Click here</a> to sign up!</p>
          </div>
        </div>
      )
    }
  }
