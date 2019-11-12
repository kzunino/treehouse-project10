import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignIn extends Component {

  state = {
    username: '',
    password: '',
    errors: [],
  }

  render(){
    const {
      username,
      password,
      errors,
    } = this.state;

  return(
    <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={this.change}
                  placeholder="User Name" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.change}
                  placeholder="Password" />
              </React.Fragment>
            )} />
          <p>
            Don't have a user account? <Link to="/signup">Click here</Link> to sign up!
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
  const {username, password, errors} = this.state;
  const { from } = this.props.location.state || { from : { pathname: '/' }}

  //resets errors state to empty if previous rendered errors exist * stops duplicates
  if(errors){
    this.setState({errors: []})
  }

  //client side !empty validations
  //prevState stops overwriting errors
  if(username === ""){
    this.setState(prevState => ({
      errors: [...prevState.errors, "Please fill out User Name field"]
    }));
  }

  if(password === ""){
    this.setState(prevState => ({
      errors: [...prevState.errors, "Please fill out Password field"]
    }));
  }

  context.actions.signIn(username, password)
    .then( user => {
      if(user.errors){
        this.setState(prevState => ({
          errors: [...prevState.errors, Object.values(user.errors)]
        }))

      } else if (user === 500) {
          this.props.history.push('/error');

      } else {
        this.props.history.push(from);
        console.log(`SUCCESS! ${username} is now signed in!`);
      }
    })
    .catch( err => {
      console.log(err);
    })
}

cancel = () => {
  this.props.history.push('/');
  }
}
