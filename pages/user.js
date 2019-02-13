import React, { Component } from "react";
import Head from '../src/components/head'
import Nav from '../src/components/nav'

const User = ({ query }) => {
  const userProfile = query.userProfile && JSON.parse(query.userProfile);
  return (
    <div>
      <Head title="User" />
      <Nav isLoggedIn={!!query.user} />

      <div className="hero">
        <h1 className="title">This is a secured route!</h1>
        <div className="user-info">
          <img className='user-pic' src={userProfile.picture} />
          <p>Display Name: {userProfile.displayName}</p>
          <p>Email: {userProfile.emails[0].value}</p>
        </div>
      </div>
      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%;
          padding-top: 80px;
          line-height: 1.15;
          font-size: 48px;
          text-align: center;
        }
        .user-pic {
          max-width: 50px;
          max-height: 50px;
        }
      `}</style>
    </div>
  );
};

User.getInitialProps = ({query}) => {
  return { query };
}

export default User;