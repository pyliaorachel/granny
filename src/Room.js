import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  Image,
} from 'react-native';
import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import TTS from 'react-native-tts';
import { Actions } from 'react-native-router-flux'
import * as Animatable from 'react-native-animatable';

import Granny from './Granny';
import * as colors from './utils/colors';
import { interval_const, timeout_const, config_const, granny_const, env_const } from './utils/constants';

const windowWidth = env_const.WINDOW_WIDTH;
const windowHeight = env_const.WINDOW_HEIGHT;

const dimensions = {
  previewWidth: windowWidth / 4,
  previewHeight: windowWidth / 4,
  previewMarginRight: windowWidth / 15,
  previewMarginBottom: windowWidth / 15,
  jumpingGrannyWidth: windowWidth / 4,
  jumpingGrannyHeight: windowWidth * 537 / (4 * 253),
};

const jumpingGrannyImage = require('../assets/opening/jumping-granny.png');
const questions = require('./utils/questions.json').questions;

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
    opacity: 0,
  },
  jumpingGrannyStyle: {
    width: dimensions.jumpingGrannyWidth,
    height: dimensions.jumpingGrannyHeight,
    marginTop: 20,
    marginBottom: 20,
  },
  grannyTextStyle: {
    fontSize: 46,
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
      audioPath: config_const.AUDIO_FILE_PATH,
      nextQuestion: true,
      ttsFinishListener: null,
      grannyEmotion: 'neutral',
      containerStyle: StyleSheet.flatten([styles.container, {backgroundColor: colors['neutral']}]),
      currentQuestion: 0,
      totalQuestions: questions.length,
    };

    TTS.setDefaultLanguage(config_const.TTS_DEFAULT_LANG);
    TTS.setDefaultRate(config_const.TTS_DEFAULT_RATE);

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
    AudioRecorder.prepareRecordingAtPath(audioPath, config_const.AUDIO_OPTIONS);
  }

  setupAnimation() {
    setTimeout(this.startTalk, timeout_const.OPENING_TIMEOUT);
  }

  captureBackground(data) {
    //console.log('bg', data, this.state.background);

    const background = (data.currentTime !== 0)
      ? (this.state.background * this.state.cntCaptureSound + data.maxAmplitude) / data.currentTime
      : 0;

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
      if (data.maxAmplitude < this.state.background * config_const.BG_SCALE) { // scale up for sake
        cummulatedBelowBackground++;
        if (cummulatedBelowBackground >= config_const.BG_CUMULATE_CNT) { // consider no sound for 3 consecutive seconds as user not talking
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

    TTS.speak(question);
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

    let error = false;
    if (sum !== 0) {
      Object.keys(emotionData).forEach((key) => {
        emotionData[key] = emotionData[key] / sum;
      });
    } else {
      Object.keys(emotionData).forEach((key) => {
        emotionData[key] = 1 / Object.keys(emotionData).length;
      });
      error = true
    }

    // parse data
    const data = {
      emotions: emotionData,
      error,
      time: {
        startTime: this.state.startTime.toISOString(),
        endTime,
        day: this.state.startTime.getDay(),
      }
    };

    console.log(this.state.key, data);
    setTimeout(() => {
      Actions.report({data, dataKey: this.state.key});
    }, timeout_const.END_TALK_TIMEOUT);
  }

  changeEmotion(emotion) {
    console.log(emotion);
    this.setState({
      grannyEmotion: emotion,
    });
  }

  captureImage() {
    console.log('capture');

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
      captureImageInterval: setInterval(this.captureImage, interval_const.CAPTURE_IMAGE_INTERVAL),
      ttsFinishListener: TTS.addEventListener('tts-finish', this.finishQuestion),
    });

    this.nextQuestion();
  }

  render() {
    return (
      this.state.setup ?
        <View style={StyleSheet.flatten([styles.container, {backgroundColor: colors['neutral']}])}>
          <Text style={styles.grannyTextStyle}>KEEP CALM</Text>
          <Text style={styles.grannyTextStyle}>AND</Text>
          <Animatable.Image animation='bounce' duration={granny_const.BOUNCING_DURATION} iterationCount='infinite' style={styles.jumpingGrannyStyle} source={jumpingGrannyImage}/>
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
