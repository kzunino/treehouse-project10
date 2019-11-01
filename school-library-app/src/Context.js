import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext();

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    courses: null,
    course: null,
  };

  constructor() {
    super();
    this.data = new Data();
  }

  render() {
    const {authenticatedUser, courses, course} = this.state;

    const value = {
      authenticatedUser,
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
    if (user !== null){
      this.setState(() =>{
        return {
          authenticatedUser: user,
        };
      });
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
    }
    return user;
  }

  signOut = () => {
    this.setState(() => {
      return {
        authenticatedUser: null,
      };
    });
    Cookies.remove('authenticatedUser');
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
    if (course !== null){
      this.setState(() =>{
        return {
          course: course,
        };
      });
    }
    return course;
  }

  updateCourse = async (id, update) => {
    //returns promise holding courses object
    const course = await this.data.getCourseByPk(id);
    if (course !== null){
      this.setState(() =>{
        return {
          course: course,
        };
      });
    }
    return course;
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
