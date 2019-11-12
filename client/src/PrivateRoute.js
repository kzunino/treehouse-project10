import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

export default ({ component: Component, ...rest }) => {
  //if redirected the original pathname is saved to state and passed to sign-in component
  // after sign in is authenitcated, {from} is used to redirect user to original page
  return (
    <Consumer>
      { context => (
        <Route
          {...rest}
          render={props => context.authenticatedUser ? (
              <Component {...props} />
            ) : (
              <Redirect to={{
                pathname: '/signin',
                state: { from: props.location }
              }} />
            )
          }
        />
      )}
    </Consumer>
  );
};
