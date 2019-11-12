import React, {Component} from 'react';
import Form from './Form';
import { Link } from 'react-router-dom';


export default class UserSignUp extends Component {

  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: [],
  }

    render(){

    const {
      firstName,
      lastName,
      emailAddress,
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
                    id="lastName"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={this.change}
                    placeholder="First Name" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={this.change}
                    placeholder="Last Name" />
                  <input
                    id="emailAddress"
                    name="emailAddress"
                    type="text"
                    value={emailAddress}
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
                    id="confirmPassword"
                    name="confirmPassword"
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

    submit = async () => {
      const { context } = this.props;
      const {
        firstName,
        lastName,
        emailAddress,
        password,
        confirmPassword,
        errors
        } = this.state;

      //resets errors state to empty if previous errors exist
      if(errors){
        this.setState({errors: []})
      }

      //conditonal to check if passwords match
      if (password !== confirmPassword){
        this.setState(prevState => ({
          errors: [...prevState.errors, "Passwords do not match"]
        }));
      }
      //new user payload to create
      const newUser = {
         firstName,
         lastName,
         emailAddress,
         password
         };

       await context.data.createUser(newUser)
        .then( error => {
            //returns error as response object OR status code
            if (error === 500) {
              this.props.history.push('/error');

            } else if (error){
              //renders object containing array of errors from API
              this.setState({
                errors: Object.values(error.errors) 
              })

            } else {
              console.log(`${firstName} has successfully signed up!`);
              context.actions.signIn(emailAddress, password);
              this.props.history.push('/');
            }
          }).catch(err => {
            console.log(err);
          });
   }

    cancel = () => {
      this.props.history.push('/');
      }
    }
