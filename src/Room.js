import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const dimensions = {
  previewWidth: windowWidth / 4,
  previewHeight: windowWidth / 4,
  previewMarginRight: windowWidth / 15,
  previewMarginBottom: windowWidth / 15,
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    height: dimensions.previewHeight,
    width: dimensions.previewWidth,
    position: 'absolute',
    right: dimensions.previewMarginRight,
    bottom: dimensions.previewMarginBottom,
  },
});

export default class Room extends Component {

  constructor(props) {
    super(props);

    this.state = {
      captureImageInterval: null,
    };

    this.captureImage = this.captureImage.bind(this);
  }

  componentWillMount() {
      this.setState({
        captureImageInterval: setInterval(this.captureImage, 5000)
      })
  }

  componentWillUnmount() {
    clearInterval(this.state.captureImageInterval);
  }

  captureImage() {
    this.camera.capture()
      .then((data) => {
        RNFetchBlob.fetch('POST', 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
          'Ocp-Apim-Subscription-Key': 'ed42095f31554a55afdc5dd87302a624',
          'Content-Type' : 'application/octet-stream',
        }, data.data)
        .then((res) => {
          console.log(res.text());
        })
        .catch((err) => console.log('Error: ', err));
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          type={Camera.constants.Type.front}
          captureTarget={Camera.constants.CaptureTarget.memory}>
        </Camera>
      </View>
    );
  }
}
