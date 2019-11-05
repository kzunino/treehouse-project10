import React, {Component} from 'react';
import Form from './Form';

export default class UpdateCourse extends Component {

  state = {
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
    await context.actions.getCourseByPk(params.id)
      .then(course => {
        this.setState({
          course: course,
          title: course.title,
          id: course.id,
          description: course.description,
          estimatedTime: course.estimatedTime,
          materialsNeeded: course.materialsNeeded,
        })
      })
  }

    render(){
      let {
        course,
        errors
          } = this.state;

      return(
        <div className="bounds course--detail">
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
                  <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course Title..." defaultValue={course.title} onChange={this.change}/></div>
                  <p>By {course.userId}</p>
                </div>
                <div className="course--description">
                  <div><textarea id="description" name="description"  placeholder="Course Description..." defaultValue={course.description} onChange={this.change}/></div>
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" defaultValue={course.estimatedTime} onChange={this.change}/></div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." defaultValue={course.materialsNeeded} onChange={this.change}/></div>
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
        //resets errors state to empty if previous errors exist
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
          await context.actions.updateCourse(id, update, username, password)
            .then(errors => {
              if(Object.values(errors).length){
                this.setState({errors: Object.values(errors)})
              } else {
                this.props.history.push('/courses/' + id);

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
