import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Audio } from 'expo-av';
import { HamletPlaylist } from '../providers';

import { Amoled } from '../themes';

export default class Player extends Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    currentTrack: 0,
    volume: 1.0,
    isBuffering: false
  }

  async componentDidMount() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true
      });

      this.loadAudio();
    } catch(e) {
      console.log(e);
    }
  }

  async loadAudio() {
    const {
      currentTrack,
      isPlaying,
      volume
    } = this.state;

    try {
      const playbackInstance = new Audio.Sound();
      const source = {
        uri: HamletPlaylist[currentTrack].uri
      };

      const status = {
        shouldPlay: isPlaying,
        volume
      };

      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      await playbackInstance.loadAsync(source, status, false);

      this.setState({ ...this.state, playbackInstance });
    } catch(e) {
      console.log(e);
    }
  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      ...this.state,
      isBuffering: status.isBuffering
    });
  }

  handlePlayPause = async () => {
    let { 
      isPlaying, 
      playbackInstance 
    } = this.state;

    isPlaying
      ? await playbackInstance.pauseAsync()
      : await playbackInstance.playAsync();

    this.setState({
      ...this.state,
      isPlaying: !isPlaying
    });
  }

  handlePreviousTrack = async () => {
    let {
      playbackInstance,
      currentTrack
    } = this.state;

    if (playbackInstance) {
      await playbackInstance.unloadAsync();

      currentTrack > 0
        ? currentTrack -= 1
        : currentTrack = 0;
      
      this.setState({
        ...this.state,
        currentTrack
      });

      this.loadAudio();
    }
  }

  handleNextTrack = async () => {
    let {
      playbackInstance,
      currentTrack
    } = this.state;

    if (playbackInstance) {
      await playbackInstance.unloadAsync();

      currentTrack < HamletPlaylist.length - 1
        ? currentTrack += 1
        : currentTrack = 0;
      
      this.setState({
        ...this.state,
        currentTrack
      });

      this.loadAudio();
    }
  }

  renderFileInfo() {
    const {
      playbackInstance,
      currentTrack
    } = this.state;

    return playbackInstance
      ? (
        <View style={styles.trackInfo}>
          <Text style={[styles.trackInfoText, styles.largeText]}>
            {HamletPlaylist[currentTrack].title}
          </Text>
          <Text style={[styles.trackInfoText, styles.smallText]}>
            {HamletPlaylist[currentTrack].author}
          </Text>
          <Text style={[styles.trackInfoText, styles.smallText]}>
            {HamletPlaylist[currentTrack].source}
          </Text>
        </View>
      )
      : null;
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.albumCover}
          source={{uri: '../assets/images/default-album-art.png'}}/>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
            <Ionicons name='ios-skip-backward' size={Amoled.icon.large} color={Amoled.color.accent}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
            {this.state.isPlaying 
              ? (<Ionicons name='ios-pause' size={Amoled.icon.large} color={Amoled.color.accent}/>)
              : (<Ionicons name='ios-play-circle' size={Amoled.icon.large} color={Amoled.color.accent}/>)}
          </TouchableOpacity>
          <TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
            <Ionicons name='ios-skip-forward' size={Amoled.icon.large} color={Amoled.color.accent}/>
          </TouchableOpacity>
        </View>
        {this.renderFileInfo()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Amoled.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumCover: {
    width: 250,
    height: 250
  },
  trackInfo: {
    padding: 30,
    backgroundColor: Amoled.color.primary,
  },
  trackInfoText: {
    textAlign: 'center',
    flexWrap: 'wrap',
    color: Amoled.color.onPrimary,
  },
  largeText: {
    fontSize: Amoled.font.large
  },
  smallText: {
    fontSize: Amoled.font.regular
  },
  controls: {
    padding: 10,
    flexDirection: 'row'
  },
  control: {
    margin: 20
  }
});