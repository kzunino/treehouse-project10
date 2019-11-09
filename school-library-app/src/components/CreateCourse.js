import React, {Component} from 'react';
import Form from './Form';


export default class CreateCourse extends Component {

  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: [],
  }

    render(){

    let {context} = this.props;
    let user = context.authenticatedUser.firstName + ' ' + context.authenticatedUser.lastName;
    let { errors  } = this.state;

      return(
        <div className="bounds course--create">
          <h1>Create Course</h1>
          <div>
            <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Create New Course"
            elements={() =>(
              <React.Fragment>
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div>
                    <input
                       id="title"
                       name="title"
                       type="text"
                       className="input-title course--title--input"
                       placeholder="Course Title..."
                       defaultValue={""}
                       onChange={this.change}/>
                   </div>
                  <p>By {user}</p>
                </div>
                <div className="course--description">
                  <div>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Course Description..."
                      defaultValue={""}
                      onChange={this.change}/>
                  </div>
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <div>
                        <input
                          id="estimatedTime"
                          name="estimatedTime"
                          type="text"
                          className="course--time--input"
                          placeholder="Hours"
                          defaultValue={""}
                          onChange={this.change}/>
                      </div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div>
                        <textarea
                          id="materialsNeeded"
                          name="materialsNeeded"
                          className=""
                          placeholder="List materials..."
                          defaultValue={""}
                          onChange={this.change}/>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              </React.Fragment>
              )}
            />
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
         const {context} = this.props;
         const username = context.authenticatedUser.emailAddress;
         const password = context.authenticatedUserPass;
         const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors,
          } = this.state;

          // update payload
          const courseInfo = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
          }
          //resets errors state to empty if previous rendered errors exist * stops duplicates
          if(errors){
            this.setState({errors: []})
          }
          //checks to see if the title is blank and updates the state.
          //spread operator keeps array items as one array instead of adding multiple arrays
          if (title === ''){
            this.setState(prevState => ({
              errors: [...prevState.errors, "Please provide a value for Course Title"]
            }));
          }
          if (description === '') {
            this.setState(prevState => ({
              errors: [...prevState.errors, "Please provide a value for Course Description"]
            }));
          }


        /* The Object.values() method returns an array of a given object's own
           enumerable property values MDN-Docs */

        //Create Course either returns empty array or validation errors
        await context.actions.createCourse(courseInfo, username, password)
        //if 201 response then return to courses
          .then(response => {
              if(response.status === 201){
                console.log(response)
                this.props.history.push("/");
              };
          }).catch(err => {
            console.log(err);
          });
      }

      cancel = () => {
        this.props.history.push("/");
        }
  }
