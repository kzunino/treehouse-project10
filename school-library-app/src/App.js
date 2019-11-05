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
import NotFound from './components/NotFound';

//Add Context to Routers
const HeaderWithContext = withContext(Header);
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const UpdateCourseWithContext = withContext(UpdateCourse);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const UserSignUpWithContext = withContext(UserSignUp);


export default () => (
  <Router>
    <div>
      <HeaderWithContext />

      <Switch>
          <Route exact path='/' component={CoursesWithContext} />
          <Route path='/courses/create' component={CreateCourse} />
          <Route path='/courses/:id/update' component={UpdateCourseWithContext} />
          <Route path='/courses/:id' component={CourseDetailWithContext} />
          <Route path='/signin' component={UserSignInWithContext} />
          <Route path='/signout' component={UserSignOutWithContext} />
          <Route path='/signup' component={UserSignUpWithContext} />
          <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);
