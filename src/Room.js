import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  DeviceEventEmitter,
  Image,
} from 'react-native';
import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';
import { AudioRecorder, AudioUtils } from 'react-native-audio';

import Granny from './Granny';
import * as colors from './utils/colors';
import * as Animatable from 'react-native-animatable';
import SpeechAndroid from 'react-native-android-voice';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const dimensions = {
  previewWidth: windowWidth / 4,
  previewHeight: windowWidth / 4,
  previewMarginRight: windowWidth / 15,
  previewMarginBottom: windowWidth / 15,
  jumpingGrannyWidth: windowWidth / 4,
  jumpingGrannyHeight: windowWidth * 537 / (4 * 253),
};

const jumpingGrannyImage = require('../assets/opening/jumping-granny.png');
const questions = require('../assets/questions.json').questions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    height: dimensions.previewHeight,
    width: dimensions.previewWidth,
    position: 'absolute',
    right: dimensions.previewMarginRight,
    bottom: dimensions.previewMarginBottom,
  },
  jumpingGrannyStyle: {
    width: dimensions.jumpingGrannyWidth,
    height: dimensions.jumpingGrannyHeight,
    marginTop: 10,
    marginBottom: 10,
  },
  grannyTextStyle: {
    fontSize: 34,
    color: 'white',
  },
});

export default class Room extends Component {

  constructor(props) {
    super(props);

    const startTime = new Date();
    const key = `${startTime.getFullYear()}-${startTime.getMonth()}-${startTime.getDate()}`;

    this.state = {
      emotionData: {
        happiness: 0,
        anger: 0,
        fear: 0,
        surprise: 0,
        contempt: 0,
        disgust: 0,
        neutral: 0,
        sadness: 0,
      },
      startTime,
      key,
      setup: true,
      captureImageInterval: null,
      cntCaptureSound: 0,
      cummulatedBelowBackground: 0,
      background: 0,
      audioPath: '/dev/null',
      nextQuestion: false,
      ttsFinishListener: null,
      grannyEmotion: 'neutral',
      containerStyle: StyleSheet.flatten([styles.container, {backgroundColor: colors['neutral']}]),
      currentQuestion: 0,
      totalQuestions: questions.length,
    };

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

    this.setupAnimation();
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

  setupAnimation() {
    setTimeout(this.startTalk, 10000);
  }

  captureBackground(data) {
    //console.log('bg', data, this.state.background);

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
    const { currentQuestion, totalQuestions } = this.state;

    if (currentQuestion >= totalQuestions) {
      this.endTalk();
      return;
    }

    const question = questions[this.state.currentQuestion];
    this.setState({
      currentQuestion: this.state.currentQuestion+1,
    });
    console.log(currentQuestion, totalQuestions, question);

    // TTS.speak(question);
    console.log(SpeechAndroid);
    const spokenText = SpeechAndroid.startSpeech(questions, SpeechAndroid.US);
    console.log(spokenText);
  }

  finishQuestion() {
    console.log('finishQuestion');
    this.setState({
      nextQuestion: false,
    });
  }

  endTalk() {
    console.log('endTalk');
    clearInterval(this.state.captureImageInterval);
    AudioRecorder.stopRecording();

    TTS.speak('Nice to chat with you! See you next time.');

    const endTime = new Date().toISOString();

    // normalize emotion
    const emotionData = this.state.emotionData;
    let sum = 0;
    Object.keys(emotionData).forEach((key) => {
      sum += emotionData[key];
    });
    Object.keys(emotionData).forEach((key) => {
      emotionData[key] = emotionData[key] / sum;
    });

    // parse data
    const data = {
      emotions: emotionData,
      time: {
        startTime: this.state.startTime.toISOString(),
        endTime,
      }
    };

    console.log(this.state.key, data);
  }

  changeEmotion(emotion) {
    console.log(emotion);
    this.setState({
      grannyEmotion: emotion,
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
          console.log(JSON.parse(res.text()));
          const data = JSON.parse(res.text());
          const emotionData = this.state.emotionData;

          data.forEach((record) => {
            const scores = record.scores;
            this.setState({
              emotionData: {
                happiness: emotionData.happiness + scores.happiness,
                anger: emotionData.anger + scores.anger,
                fear: emotionData.fear + scores.fear,
                surprise: emotionData.surprise + scores.surprise,
                contempt: emotionData.contempt + scores.contempt,
                disgust: emotionData.disgust + scores.disgust,
                neutral: emotionData.neutral + scores.neutral,
                sadness: emotionData.sadness + scores.sadness,
              },
            });
            const maxKey = Object.keys(scores).reduce(function(a, b){ return scores[a] > scores[b] ? a : b });
            if (scores[maxKey] !== 0 && maxKey !== this.state.grannyEmotion) {
              this.changeEmotion(maxKey);
            }
          });
          console.log(emotionData);
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
      setup: false,
      captureImageInterval: setInterval(this.captureImage, 3000),
      // ttsFinishListener: TTS.addEventListener('tts-finish', this.finishQuestion),
    });

    this.nextQuestion();
  }

  render() {
    return (
      this.state.setup ?
        <View style={StyleSheet.flatten([styles.container, {backgroundColor: colors['neutral']}])}>
          <Text style={styles.grannyTextStyle}>KEEP CALM</Text>
          <Text style={styles.grannyTextStyle}>AND</Text>
          <Animatable.Image animation='bounce' duration={1500} iterationCount='infinite' style={styles.jumpingGrannyStyle} source={jumpingGrannyImage}/>
          <Text style={styles.grannyTextStyle}>WAIT FOR</Text>
          <Text style={styles.grannyTextStyle}>GRANNY</Text>
        </View>
        :
        <View style={StyleSheet.flatten([styles.container, {backgroundColor: colors[this.state.grannyEmotion]}])}>
          <Granny emotion={this.state.grannyEmotion}/>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            playSoundOnCapture={false}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
            type={Camera.constants.Type.front}
            captureTarget={Camera.constants.CaptureTarget.memory}>
          </Camera>
        </View>
    );
  }
}
