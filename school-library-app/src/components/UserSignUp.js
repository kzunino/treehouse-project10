import React, {Component} from 'react';
import Form from './Form';
import { Link } from 'react-router-dom';


export default class UserSignUp extends Component {

  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: [],
  }

    render(){

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      errors,
    } = this.state;

      return(
        <div className="bounds">
          <div className="grid-33 centered signin">
            <h1>Sign Up</h1>
            <Form
              cancel={this.cancel}
              errors={errors}
              submit={this.submit}
              submitButtonText="Sign Up"
              elements={() => (
                <React.Fragment>
                  <input
                    id="first-name"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={this.change}
                    placeholder="First Name" />
                  <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    value={lastName}
                    onChange={this.change}
                    placeholder="Last Name" />
                  <input
                    id="email"
                    name="email"
                    type="text"
                    value={email}
                    onChange={this.change}
                    placeholder="Email Address" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={this.change}
                    placeholder="Password" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={confirmPassword}
                    onChange={this.change}
                    placeholder="Confirm Password" />
                </React.Fragment>
              )} />
            <p>
              Already have a user account? <Link to="/signin">Click here</Link> to sign in!
            </p>
          </div>
        </div>
      )
    }

      change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
          return {
            [name]: value
          };
        });
      }

    submit = () => {
      const { context } = this.props;
      const {username, password} = this.state;
      const { from } = this.props.location.state || { from : { pathname: '/' }}

      context.actions.signIn(username, password)
        .then( user => {
          if(user === null){
            this.setState(() => {
              return { errors: [ 'Sign-in was unsuccessful' ]};
            })
          } else {
            this.props.history.push(from);
            console.log(`SUCCESS! ${username} is now signed in!`);
          }
        })
        .catch( err => {
          console.log(err);
          this.props.history.push('/error');
        })
    }

    cancel = () => {
      this.props.history.push('/');
      }
    }
