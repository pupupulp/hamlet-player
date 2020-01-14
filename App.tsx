import { AppLoading } from 'expo';
import React from 'react';
import { Asset } from 'expo-asset';
import Navigation from './navigation/index';
import Player from './screens/Player';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  }

  handleResourcesAsync = async () => {
    new Promise((resolve, reject) => {
      try {
        const cacheImages = images.map(image => {
          return Asset.fromModule(image).downloadAsync();
        });
  
        resolve(Promise.all(cacheImages));
      } catch (err) {
        reject(err);
      }
    });
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync = {this.handleResourcesAsync}
          onError = {error => console.warn(error)}
          onFinish = {() => this.setState({ ...this.state, isLoadingComplete: true })}
        />
      )
    }

    return (
      <Player/>
    )
  }
}

const images = [
  require('./assets/images/default-album-art.png'),
];

