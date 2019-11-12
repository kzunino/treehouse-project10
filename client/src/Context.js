import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext();

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    authenticatedUserPass: Cookies.get('authenticatedUserPass') || null,
    courses: null,
    course: null,
  };

  constructor() {
    super();
    this.data = new Data();
  }

  async componentDidMount(){
    await this.getCourses()
      .then(courses => {
        this.setState({
          courses: courses
        })
      })
  }

  render() {
    const {authenticatedUser, authenticatedUserPass, courses, course} = this.state;

    const value = {
      authenticatedUser,
      authenticatedUserPass,
      courses,
      course,
      data: this.data,
      //stores any handlers or actions to perform on data passed through contect
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        getCourses: this.getCourses,
        getCourseByPk: this.getCourseByPk,
        updateCourse: this.updateCourse,
        createCourse: this.createCourse,
        deleteCourse: this.deleteCourse,
      },
    };

    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>
    );
  }


  signIn = async (username, password) => {
    //returns promis holding object with name and username
    const user = await this.data.getUser(username, password);
    if (user.errors !== undefined){
      return user;

    } else if (user !== null){
      this.setState(() =>{
        return {
          authenticatedUser: user,
          authenticatedUserPass: password,
        };
      });
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
      Cookies.set('authenticatedUserPass', password, { expires: 1 });
    }
    return user;
  }

  signOut = () => {
    this.setState(() => {
      return {
        authenticatedUser: null,
        authenticatedUserPass: null,
      };
    });
    Cookies.remove('authenticatedUser');
    Cookies.remove('authenticatedUserPass');
  }

  getCourses = async () => {
    //returns promise holding courses object
    const courses = await this.data.getCourses();
    if (courses !== null){
      this.setState(() =>{
        return {
          courses: courses,
        };
      });
    }
    return courses;
  }

  getCourseByPk = async (id) => {
    //returns promise holding courses object
    const course = await this.data.getCourseByPk(id);
    if (course !== null || course !== 404){
      this.setState(() =>{
        return {
          course: course,
        };
      });
    }
    return course;
  }

  updateCourse = async (id, update, username, password) => {
    //returns promise holding courses object
    const updatedCourse = await this.data.updateCourse(id, update, username, password);
    if (updatedCourse){
      return updatedCourse;
    };
  }

  createCourse = async (courseInfo, username, password) => {
    //returns promise holding courses object
    const newCourse = await this.data.createCourse(courseInfo, username, password);
    if (newCourse){
      return newCourse;
    };
  }

  deleteCourse = async (id, username, password) => {
    const courseDelete = await this.data.deleteCourse(id, username, password);
      if(courseDelete === 204){
        return 204;
    } else {
      return courseDelete;
    }
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}
