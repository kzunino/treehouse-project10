import React from 'react';
import { Redirect } from 'react-router-dom';

//not a class component must pass in {context} as props
export default ({context}) => {
  context.actions.signOut();

  return (
    <Redirect to="/" />
  );
}
