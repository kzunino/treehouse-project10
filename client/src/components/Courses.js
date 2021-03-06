import React, {Component} from 'react';

export default class Courses extends Component {

//gets list of courses from api
  async componentDidMount(){
    const {context} = this.props;
    await context.actions.getCourses()
    .then(response => {

    if (response === 500) {
      this.props.history.push('/error');
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    const {context} = this.props;
    let courseList = context.courses
    let courses;

    //creates divs for each course in the database 
    if (courseList !== null) {
      if (courseList.length > 0) {
       courses = courseList.map((course, index) => {
        return <div key={index} className="grid-33">
                  <a className="course--module course--link" href={'/courses/' + course.id}>
                    <h4 className="course--label">Course</h4>
                    <h3 className="course--title">{course.title}</h3>
                  </a>
              </div>
      })
    }
  }

    return (
    <React.Fragment>
      <hr />
      <div className="bounds">
        {courses}
        <div className="grid-33">
          <a className="course--module course--add--module" href="/courses/create">
            <h3 className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 " />
              </svg>New Course</h3>
          </a>
        </div>
      </div>
    </React.Fragment>
  )
}
}
