import { AppLoading } from 'expo';
import React from 'react';
import Navigation from './navigation/index';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  }

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync = { async () => console.log('Loading app...') }
          onError = { error => console.warn(error) }
          onFinish = { () => this.setState({ ...this.state, isLoadingComplete: true })}
        />
      )
    }

    return (
        <Navigation/>
    )
  }
}


