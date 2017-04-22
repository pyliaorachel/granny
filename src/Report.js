import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
} from 'react-native';

import PieChart from './PieChart';
import * as emotionList from './utils/emotionList';
import Legends from './Legends';
import * as sentences from './utils/sentences';
import { weekdayNames as weekdays, monthNamesShort as months } from './utils/timeNames'
import { report_const } from './utils/constants'

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
  sentenceStyle: {
    fontSize: 20,
  },
});

export default class Report extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data || report_const.DEFAULT_DATA,
      key: props.dataKey,
      parsedData: report_const.DEFAULT_PARSED_DATA,
      day: (props.data && weekdays[props.data.time.day]) || 'Monday',
      timeString: null,
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

    const startTime = new Date(this.state.data.time.startTime);
    const timeString = `${startTime.getDate()} ${months[startTime.getMonth()]} ${startTime.getFullYear()}`;

    this.setState({
      parsedData,
      timeString,
      maxEmotion,
    });
  }

  render() {
    const { day, timeString, maxEmotion, parsedData } = this.state;
    return (
      <View style={styles.container}>
        <View style={{flex: 0.1}}>
          <Text style={styles.timeTextStyle}>{day}, {timeString}</Text>
        </View>
        <View style={{flex: 0.2}}>
          <Text style={styles.sentenceStyle}>{sentences[maxEmotion]}</Text>
        </View>
        <PieChart data={parsedData} />
        <Legends />
      </View>
    );
  }
}
