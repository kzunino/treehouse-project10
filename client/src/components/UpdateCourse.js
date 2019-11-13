import React, {Component} from 'react';
import Form from './Form';

export default class UpdateCourse extends Component {

  state = {
    user: [],
    course: [],
    title: '',
    id: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: [],
  }

  async componentDidMount(){
    //match params grabs params from url through destructuring
    const {context, match: {params}} = this.props;
    this.setState({id: params.id});
    const authenticatedUserId = context.authenticatedUser.id;

    await context.actions.getCourseByPk(params.id)
      .then(course => {

        if (course === 404){
          this.props.history.push('/notFound');

        } else if (course === 500) {
          this.props.history.push('/error');

        } else {
          this.setState({
            user: course.User,
            course: course,
            title: course.title,
            id: course.id,
            description: course.description,
            estimatedTime: course.estimatedTime,
            materialsNeeded: course.materialsNeeded,
          })
        }
      }).catch(err => {
        console.log(err);
      });
    //if userId and courseId do not match render forbidden.
    const courseUserId = this.state.course.userId;
    if (courseUserId){
    if (authenticatedUserId !== courseUserId){
        this.props.history.push('/forbidden')
    }
  }
  }

    render(){

      let {
        user,
        course,
        errors
          } = this.state;

      return(
        <div className="bounds course--update">
          <h1>Update Course</h1>
          <div>
            <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Update Course"
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
                       defaultValue={course.title}
                       onChange={this.change}/>
                   </div>
                  <p>By {user.firstName + ' ' + user.lastName}</p>
                </div>
                <div className="course--description">
                  <div>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Course Description..."
                      defaultValue={course.description}
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
                          defaultValue={course.estimatedTime}
                          onChange={this.change}/>
                      </div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div>
                        <textarea
                          id="materialsNeeded"
                          name="materialsNeeded"
                          className="course--materials--input"
                          placeholder="List materials..."
                          defaultValue={course.materialsNeeded}
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
            id,
            description,
            estimatedTime,
            materialsNeeded,
            errors,
          } = this.state;

          // update payload
          const update = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
          }
          //resets errors state to empty if previous rendered errors exist * stops duplicates
          if(errors){
            this.setState({errors: []})
          }

        /* The Object.values() method returns an array of a given object's own
           enumerable property values MDN-Docs */

        //updateCourse either returns empty array or validation errors
        await context.actions.updateCourse(id, update, username, password)
          .then(errors => {
            if (errors === 204) {
              this.props.history.push('/courses/' + id);

            } else if (errors === 500) {
              this.props.history.push('/error');

            //if errors exist <Form /> renders error display
            } else if (errors){
              this.setState({
                errors: Object.values(errors.errors)
              })
            }
          }).catch(err => {
            console.log(err);
          });
  }

      cancel = () => {
        const {id} = this.state;
        this.props.history.push(`/courses/` + id);
        }

  }
