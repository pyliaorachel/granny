import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import { granny_const, env_const } from './utils/constants';

const neutralImage = require('../assets/emotions/neutral.png');
const angerImage = require('../assets/emotions/anger.png');
const contemptImage = require('../assets/emotions/contempt.png');
const disgustImage = require('../assets/emotions/disgust.png');
const fearImage = require('../assets/emotions/fear.png');
const happyImage = require('../assets/emotions/happy.png');
const sadImage = require('../assets/emotions/sad.png');
const surprisedImage = require('../assets/emotions/surprised.png');

const emotionImages = {
  neutral: neutralImage,
  anger: angerImage,
  contempt: contemptImage,
  disgust: disgustImage,
  fear: fearImage,
  happiness: happyImage,
  sadness: sadImage,
  surprise: surprisedImage,
};

const windowWidth = env_const.WINDOW_WIDTH;
const windowHeight = env_const.WINDOW_HEIGHT;

const dimensions = {
  grannyWidth: windowWidth - 100,
  grannyHeight: (windowWidth - 100) * granny_const.HEIGHT / granny_const.WIDTH,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: dimensions.grannyWidth,
    height: dimensions.grannyHeight,
  },
});

export default class Granny extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emotion: props.emotion,
      image: emotionImages[props.emotion],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps === this.props) {
      return;
    }
    this.setState({
      emotion: nextProps.emotion,
      image: emotionImages[nextProps.emotion],
    });
  }

  renderGranny() {
    return (<
      Image style={styles.imageStyle} source={this.state.image}
    />);
  }

  render() {
    return (
      <Animatable.View animation='bounce' duration={granny_const.BOUNCING_DURATION} iterationCount='infinite' style={styles.container}>
        {this.renderGranny()}
      </Animatable.View>
    );
  }
}
