import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';

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
  happy: happyImage,
  sad: sadImage,
  surprised: surprisedImage,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: 300,
    height: 300,
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
    console.log('renderGranny');
    return (<
      Image style={styles.imageStyle} source={this.state.image}
    />);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderGranny()}
      </View>
    );
  }
}