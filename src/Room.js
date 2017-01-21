import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import TTS from 'react-native-tts';

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
      cntCaptureSound: 0,
      cummulatedBelowBackground: 0,
      background: 0,
      audioPath: '/dev/null',
      nextQuestion: false,
      ttsFinishListener: null,
    };

    TTS.setDefaultLanguage('en-US');
    TTS.setDefaultRate(0.6);

    this.captureImage = this.captureImage.bind(this);
    this.captureBackground = this.captureBackground.bind(this);
    this.captureSound = this.captureSound.bind(this);
    this.startTalk = this.startTalk.bind(this);
    this.finishQuestion = this.finishQuestion.bind(this);
  }

  componentDidMount() {
      this.prepareRecordingPath(this.state.audioPath);
      DeviceEventEmitter.addListener('recordingProgress', this.captureBackground);

      AudioRecorder.startRecording();

      setTimeout(this.startTalk, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.state.captureImageInterval);
    AudioRecorder.stopRecording();
  }


  prepareRecordingPath(audioPath){
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
    });
  }

  captureBackground(data) {
    console.log('bg', data, this.state.background);

    const background = (data.currentTime !== 0) ? (this.state.background * this.state.cntCaptureSound + data.maxAmplitude) / data.currentTime : 0;

    this.setState({
      cntCaptureSound: data.currentTime,
      background,
    })
  }

  captureSound(data) {
    console.log('progress', data, this.state.background);

    let cummulatedBelowBackground = this.state.cummulatedBelowBackground;
    let nextQuestion = this.state.nextQuestion;

    if (!nextQuestion) { // Granny is not asking a question
      if (data.maxAmplitude < this.state.background) {
        cummulatedBelowBackground++;
        if (cummulatedBelowBackground >= 3) {
          nextQuestion = true;
          cummulatedBelowBackground = 0;
        }
      } else {
        cummulatedBelowBackground = 0;
      }

      this.setState({
        cummulatedBelowBackground,
        nextQuestion,
      })

      if (nextQuestion) this.nextQuestion();
    }
  }

  nextQuestion() {
    console.log('nextQuestion');

    TTS.speak('Hello, Rachel! How are you?');
  }

  finishQuestion() {
    console.log('finishQuestion');
    this.setState({
      nextQuestion: false,
    });
  }

  captureImage() {
    this.camera.capture()
      .then((data) => {
        RNFetchBlob.fetch('POST', 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
          'Ocp-Apim-Subscription-Key': 'ed42095f31554a55afdc5dd87302a624',
          'Content-Type' : 'application/octet-stream',
        }, data.data)
        .then((res) => {
          //console.log(res.text());
        })
        .catch((err) => console.log('Error: ', err));
      })
      .catch(err => console.error(err));
  }

  startTalk() {
    console.log('startTalk');
    DeviceEventEmitter.removeListener('recordingProgress', this.captureBackground);
    DeviceEventEmitter.addListener('recordingProgress', this.captureSound);

    this.setState({
      captureImageInterval: setInterval(this.captureImage, 5000),
      ttsFinishListener: TTS.addEventListener('tts-finish', this.finishQuestion),
    });
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
