import React from 'react';
import { Redirect } from 'react-router-dom';

export default () => {
  //context.actions.signOut();

  return (
    <Redirect to="/" />
  );
}
