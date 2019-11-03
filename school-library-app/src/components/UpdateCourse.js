import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export default class UpdateCourse extends Component {

  state = {
    course: [],
    title: '',
    id: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
  }

  componentDidMount(){
    //match params grabs params from url through destructuring
    const {context, match: {params}} = this.props;
    this.setState({id: params.id});
    context.actions.getCourseByPk(params.id)
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
        course
          } = this.state;

      return(
        <div className="bounds course--detail">
          <h1>Update Course</h1>
          <div>
            <form>
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." defaultValue={course.title} onChange={this.change}/></div>
                  <p>By {course.userId}</p>
                </div>
                <div className="course--description">
                  <div><textarea id="description" name="description" className placeholder="Course description..." defaultValue={course.description} onChange={this.change}/></div>
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
              <div className="grid-100 pad-bottom"><button className="button" type="submit" onSubmit={this.submit}>Update Course</button><Link to='/'><button className="button button-secondary">Cancel</button></Link></div>
            </form>
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
         const {context} = this.props;
         const {
            title,
            id,
            description,
            estimatedTime,
            materialsNeeded,
          } = this.state;
        // update payload
        const update = {
          title,
          description,
          estimatedTime,
          materialsNeeded,
        }
        context.actions.updateCourse(id, update);

      }

  }
