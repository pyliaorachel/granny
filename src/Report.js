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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 40,
  },
  timeTextStyle: {
    fontSize: 16,
    color: '#aaaaaa',
  },
  sentenceStyle: {
    fontSize: 20,
  },
});

const defaultRawData = {
  'emotions': {
    'happiness': '1.5',
    'sadness': '0.15',
    'anger': '0.1',
    'fear': '0.1',
    'surprise': '0.1',
    'contempt': '0.1',
    'disgust': '0.1',
    'neutral': '0.1',
  },
  'time': {
    'startTime': '2017-02-21T13:45:30',
    'endTime': '2017-02-21T13:55:31'
  }
};

const defaultData = [{
  'name': 'happiness',
  'score': 0.1
}, {
  'name': 'anger',
  'score': 0.1
}, {
  'name': 'fear',
  'score': 0.2
}, {
  'name': 'surprise',
  'score': 0.2
}, {
  'name': 'contempt',
  'score': 0.1
}, {
  'name': 'disgust',
  'score': 0.1
}, {
  'name': 'neutral',
  'score': 0.1
}, {
  'name': 'sadness',
  'score': 0.1
}];

export default class Report extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data || defaultRawData,
      key: props.dataKey,
      parsedData: defaultData,
      day: (props.data && props.data.time.day) || 'Monday',
      timeString: null,
      maxEmotion: 'neutral',
    };
  }

  componentWillMount() {
    const emotions = emotionList.emotions;
    const dataEmotions = this.state.data.emotions;

    const parsedData = [];
    let max = -1;
    let maxEmotion = '';
    emotions.forEach((emotion) => {
      const part = {
        "name": emotion,
        "score": parseFloat(dataEmotions[emotion]),
      };
      parsedData.push(part);
      if (parseFloat(dataEmotions[emotion]) > max) {
        max = parseFloat(dataEmotions[emotion]);
        maxEmotion = emotion;
      }
    });

    const startTime = new Date(this.state.data.time.startTime);
    const timeString = `${startTime.getDate()} ${startTime.getMonth()+1} ${startTime.getFullYear()}`;

    this.setState({
      parsedData,
      timeString,
      maxEmotion,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 0.15}}>
          <Text style={styles.timeTextStyle}>{this.state.day}</Text>
          <Text style={styles.timeTextStyle}>{this.state.timeString}</Text>
        </View>
        <View style={{flex: 0.25}}>
          <Text style={styles.sentenceStyle}>{sentences[this.state.maxEmotion]}</Text>
        </View>
        <PieChart data={this.state.parsedData} />
        <Legends />
      </View>
    );
  }
}
