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
  
  static async getInitialProps({ Component, query, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
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