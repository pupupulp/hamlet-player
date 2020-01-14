import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Audio } from 'expo-av';
import { HamletPlaylist } from '../providers';

import theme from '../themes/Amoled';

export default class Player extends Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    currentTrack: 0,
    volume: 1.0,
    isBuffering: false,
    playlist: HamletPlaylist
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
      volume,
      playlist
    } = this.state;

    try {
      const playbackInstance = new Audio.Sound();
      const source = {
        uri: playlist[currentTrack].uri
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
    const { 
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
      currentTrack,
      playlist
    } = this.state;

    if (playbackInstance) {
      await playbackInstance.unloadAsync();

      0 < currentTrack  && currentTrack < playlist.length - 1
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
      currentTrack,
      playlist
    } = this.state;

    if (playbackInstance) {
      await playbackInstance.unloadAsync();

      currentTrack < playlist.length - 1
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
      currentTrack,
      playlist
    } = this.state;

    return playbackInstance
      ? (
        <View style={styles.trackInfo}>
          <Text style={[styles.trackInfoText, styles.largeText]}>
            {playlist[currentTrack].title}
          </Text>
          <Text style={[styles.trackInfoText, styles.smallText]}>
            {playlist[currentTrack].author}
          </Text>
          <Text style={[styles.trackInfoText, styles.regularText]}>
            {playlist[currentTrack].source}
          </Text>
        </View>
      )
      : (
        <View style={styles.trackInfo}>
          <Text style={[styles.trackInfoText, styles.largeText]}>
            Title
          </Text>
          <Text style={[styles.trackInfoText, styles.smallText]}>
            Artist
          </Text>
          <Text style={[styles.trackInfoText, styles.regularText]}>
            Album
          </Text>
        </View>
      );
  }

  render() {
    const {
      playbackInstance,
      currentTrack,
      playlist
    } = this.state;

    return playbackInstance
      ? (
        <View style={styles.container}>
          <Image
            style={styles.albumCover}
            source={{uri: playlist[currentTrack].imageSource}}/>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
              <Ionicons name='ios-skip-backward' size={theme.icon.large} color={theme.color.accent}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
              {this.state.isPlaying 
                ? (<Ionicons name='ios-pause' size={theme.icon.large} color={theme.color.accent}/>)
                : (<Ionicons name='ios-play-circle' size={theme.icon.large} color={theme.color.accent}/>)}
            </TouchableOpacity>
            <TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
              <Ionicons name='ios-skip-forward' size={theme.icon.large} color={theme.color.accent}/>
            </TouchableOpacity>
          </View>
          {this.renderFileInfo()}
        </View>
      )
      : (
        <View style={styles.container}>
          <Image
            style={styles.albumCover}
            source={(require('../assets/images/default-album-art.png'))}/>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.control} onPress={this.handlePreviousTrack}>
              <Ionicons name='ios-skip-backward' size={theme.icon.large} color={theme.color.accent}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.control} onPress={this.handlePlayPause}>
              {this.state.isPlaying 
                ? (<Ionicons name='ios-pause' size={theme.icon.large} color={theme.color.accent}/>)
                : (<Ionicons name='ios-play-circle' size={theme.icon.large} color={theme.color.accent}/>)}
            </TouchableOpacity>
            <TouchableOpacity style={styles.control} onPress={this.handleNextTrack}>
              <Ionicons name='ios-skip-forward' size={theme.icon.large} color={theme.color.accent}/>
            </TouchableOpacity>
          </View>
          {this.renderFileInfo()}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumCover: {
    width: 300,
    height: 300
  },
  trackInfo: {
    padding: 30,
    backgroundColor: theme.color.primary,
  },
  trackInfoText: {
    padding: 2,
    textAlign: 'center',
    flexWrap: 'wrap',
    color: theme.color.onPrimary,
  },
  largeText: {
    fontSize: theme.font.large
  },
  regularText: {
    fontSize: theme.font.regular
  },
  smallText: {
    fontSize: theme.font.small
  },
  controls: {
    paddingTop: 30,
    flexDirection: 'row'
  },
  control: {
    margin: 20
  }
});