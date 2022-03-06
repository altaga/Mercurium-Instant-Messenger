import React from 'react';
import { useParams } from 'react-router-dom';

export const routerParams = (Component: any) => {
  return (props: any) => {
    return <Component match={
      {
        params:useParams()
      }
    } {...props} />;
  };
};