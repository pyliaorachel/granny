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
import { Actions, ActionConst } from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';

import Granny from './Granny';
import Options from './Options';
import * as colors from './utils/colors';
import { interval_const, timeout_const, config_const, granny_const, env_const, navbar_const, report_const } from './utils/constants';
import { OcpApimSubscriptionKey } from '../config';
import { parseReportTitleDate } from './utils/utilFunctions';

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
const questions = require('./utils/questions.json').questions.main;

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
      initialData: null,
      lastData: null,
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
      currentQuestionID: 0,
      totalQuestions: Object.keys(questions).length,
      questionKeys: Object.keys(questions),
      audioIsStarted: false,
      options: null,
      optionRes: (() => {}),
      shouldSetOptions: false,
    };

    TTS.setDefaultLanguage(config_const.TTS_DEFAULT_LANG);
    TTS.setDefaultRate(config_const.TTS_DEFAULT_RATE);

    this.captureImage = this.captureImage.bind(this);
    this.captureBackground = this.captureBackground.bind(this);
    this.captureSound = this.captureSound.bind(this);
    this.startTalk = this.startTalk.bind(this);
    this.finishQuestion = this.finishQuestion.bind(this);
    this.speakRandomQuestion = this.speakRandomQuestion.bind(this);
    this.chooseOption = this.chooseOption.bind(this);
  }

  componentDidMount() {
    this.prepareRecordingPath(this.state.audioPath);
    DeviceEventEmitter.addListener('recordingProgress', this.captureBackground);

    AudioRecorder.startRecording();
    this.setState({audioIsStarted: true});

    this.setupAnimation();
  }

  componentWillUnmount() {

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

  speakRandomQuestion(textGroup) {
    const text = textGroup[ Math.floor(Math.random() * textGroup.length) ];
    TTS.speak(text);
  }

  chooseOption(options) {
    return new Promise((res, rej) => {
      this.setState({
        shouldSetOptions: true,
        options: options,
        optionRes: res,
      });
    });
  }

  nextQuestion() {
    console.log('nextQuestion');
    const { currentQuestionID, totalQuestions, questionKeys } = this.state;

    if (currentQuestionID >= totalQuestions) {
      this.endTalk();
      return;
    }

    const question = questions[questionKeys[this.state.currentQuestionID]];
    this.setState({
      currentQuestionID: this.state.currentQuestionID+1,
    });
    console.log(currentQuestionID, totalQuestions, question);

    if (question.type === "n") {
      this.speakRandomQuestion(question.text);
    } else if (question.type === "seq") {
      question.text.forEach((textGroup) => {
        this.speakRandomQuestion(textGroup);
      });
    } else if (question.type === "res") {
      this.speakRandomQuestion(question.text);
      this.chooseOption(question.res)
        .then(({option, emotion}) => {
          console.log('option', option, emotion);
          this.speakRandomQuestion(question.res[option].text);
          if (emotion) this.setState({grannyEmotion: emotion});
          this.setState({
            options: null,
            optionRes: (() => {}),
          }, () => {
            this.finishQuestion();
          });
        });
    }
  }

  finishQuestion() {
    console.log('finishQuestion');
    if (!this.state.options && !this.state.shouldSetOptions) { // is not choosing an option
      this.setState({
        nextQuestion: false,
      });
    } else if (this.state.shouldSetOptions) {
      this.setState({
        shouldSetOptions: false,
      });
    }
  }

  endTalk() {
    console.log('endTalk');

    TTS.speak('Nice to chat with you! See you next time.');

    const endTime = new Date().toISOString();

    // normalize emotion
    const emotionData = this.state.emotionData;
    console.log(Object.assign({}, emotionData));
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
    console.log('parsed', emotionData)

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

    // cleanup
    clearInterval(this.state.captureImageInterval);
    if (this.state.audioIsStarted) {
      this.setState({audioIsStarted: false}, AudioRecorder.stopRecording);
    }
    TTS.removeEventListener('tts-finish', this.finishQuestion),

    setTimeout(() => {
      Actions.report({
        data, 
        dataKey: this.state.key, 
        title: parseReportTitleDate(data), 
        hideNavBar: false,
        initialData: this.state.initialData || report_const.DEFAULT_EMOTION_DATA,
        lastData: this.state.lastData || report_const.DEFAULT_EMOTION_DATA,
        navbarType: navbar_const.type.CLOSE,
        isNewJourney: true,
        transcript: null, // to be substituted with real data
    });
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
          'Ocp-Apim-Subscription-Key': OcpApimSubscriptionKey,
          'Content-Type' : 'application/octet-stream',
        }, data.data)
        .then((res) => {
          const data = JSON.parse(res.text());
          const emotionData = this.state.emotionData;
          const record = data && data[0]; // retrieve the first data record in array

          if (record) {
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
              lastData: {...scores},
            });
            if (!this.state.initialData) {
              this.setState({initialData: {...scores}});
            }
            const maxKey = Object.keys(scores).reduce(function(a, b){ return scores[a] > scores[b] ? a : b });
            if (scores[maxKey] !== 0 && maxKey !== this.state.grannyEmotion) {
              this.changeEmotion(maxKey);
            }
          }
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
    console.log('should set', this.state.shouldSetOptions);
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
          {(!this.state.shouldSetOptions && this.state.options) ? <Options options={this.state.options} res={this.state.optionRes}/> : null}
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
