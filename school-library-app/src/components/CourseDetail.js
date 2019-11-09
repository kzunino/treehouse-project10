import React, {Component} from 'react';
import { Link } from 'react-router-dom';


export default class CourseDetail extends Component {

  state = {
    course: [],
    user: [],
  }

  async componentDidMount(){
    //match params grabs params from url through destructuring
    const {context, match: {params}} = this.props;
    await context.actions.getCourseByPk(params.id)
      .then(course => {
        //why cant I use 404 here like what data returns?
        if (course === undefined) {
          this.props.history.push('/error');
        } else {
        this.setState({
          course: course,
          user: course.User
        })
      }
    })
  }

  render() {
    const {context} = this.props;
    const {course, user} = this.state;
    let authUser = false;

    if (context.authenticatedUser !== null){
      if(context.authenticatedUser.id === user.id){
        authUser = true;
      } else {
        authUser = false;
      }
    }

    //find a way to delete that first blank bullet point
    let materialItem;
    if (course.materialsNeeded !== null){
      let materials = String(course.materialsNeeded).split('*');
      materialItem = materials.map((material, index) => {
        if (material.length !== 0){
          return <li key={index}>{material}</li>
        } else {
          return <li key={index}></li>
        }
      })
    }

    return (
        <div>
          <div className="actions--bar">
            <div className="bounds">
              <div className="grid-100">
                {authUser
                  ?
                  <span>
                    <Link className="button" to={"/courses/"+ course.id + "/update"}>Update Course</Link>
                    <a className="button" onClick={this.delete}>Delete Course</a>
                  </span>
                  :
                  <span></span>
                }
                <Link className="button button-secondary" to="/">Return to List</Link>
              </div>
            </div>
          </div>
          <div className="bounds course--detail">
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{course.title}</h3>
                <p>{user.firstName + ' ' + user.lastName}</p>
              </div>
              <div className="course--description">
                <p>{course.description}</p>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li key={1} className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <h3>{course.estimatedTime}</h3>
                  </li>
                  <li key={2} className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <ul>
                      {materialItem}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    )
  }

  delete = async () => {
    const {context, match: {params}} = this.props;
    const username = context.authenticatedUser.emailAddress;
    const password = context.authenticatedUserPass;
    const id = params.id;
    await context.actions.deleteCourse(id, username, password)
      .then(response => {
        if(response === 204){
          this.props.history.push('/');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}
