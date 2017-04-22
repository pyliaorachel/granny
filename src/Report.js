import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import PieChart from './PieChart';
import * as emotionList from './utils/emotionList';
import * as sentences from './utils/sentences';
import { report_const, style_const } from './utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 30,
    backgroundColor: '#EEEEEE',
  },
  timeTextStyle: {
    fontSize: 18,
    color: '#aaaaaa',
  },
  titleTextContainer: {
    flex: 0.1,
    alignSelf: 'center',
  },
  titleText: {
    color: style_const.color.themeGreen,
  },
});

export default class Report extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data || report_const.DEFAULT_DATA,
      key: props.dataKey,
      parsedData: report_const.DEFAULT_PARSED_DATA,
      maxEmotion: 'neutral',
    };
  }

  componentWillMount() {
    const emotions = emotionList.emotions;
    const dataEmotions = this.state.data.emotions;

    let parsedData = [];
    let max = -1;
    let maxEmotion = '';
    emotions.forEach((emotion) => {
      const part = {
        'name': emotion,
        'score': parseFloat(dataEmotions[emotion]),
      };
      parsedData.push(part);
      if (parseFloat(dataEmotions[emotion]) > max) {
        max = parseFloat(dataEmotions[emotion]);
        maxEmotion = emotion;
      }
    });

    if (this.props.data && this.props.data.error) {
      maxEmotion = 'error';
    }

    this.setState({
      parsedData,
      maxEmotion,
    });
  }

  render() {
    const { maxEmotion, parsedData } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>{report_const.REPORT_TITLE.toUpperCase()}</Text>
        </View>
        <PieChart data={parsedData} />
      </View>
    );
  }
}
