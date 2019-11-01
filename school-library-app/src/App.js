import React from 'react';
import './styles/global.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import withContext from './Context';

//Import components
import Header from './components/Header';
import Courses from './components/Courses';
import UserSignOut from './components/UserSignOut';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UpdateCourse from './components/UpdateCourse';

//Add Context to Routers
const HeaderWithContext = withContext(Header);
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const UpdateCourseWithContext = withContext(UpdateCourse);


export default () => (
  <Router>
    <div>
      <HeaderWithContext />

      <Switch>
          <Route exact path='/' component={CoursesWithContext} />
          <Route path='/courses/create' component={CreateCourse} />
          <Route path='/courses/:id/update' component={UpdateCourseWithContext} />
          <Route path='/courses/:id' component={CourseDetailWithContext} />
          <Route path='/signin' component={UserSignIn} />
          <Route path='/signout' component={UserSignOut} />
          <Route path='/signup' component={UserSignUp} />
      </Switch>
    </div>
  </Router>
);
