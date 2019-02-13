import App, { Container } from 'next/app';
import React from 'react';

class MyApp extends App {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      isLoading: true
    };
  }

  static async getInitialProps({ Component, ctx }) {
    const { store, isServer, query, req } = ctx;
    let pageProps = {};

    if (isServer) {
      console.log(req.cookies);
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { isServer, pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} isLoading={this.state.isLoading}/>
      </Container>
    );
  }
}

  export default MyApp;