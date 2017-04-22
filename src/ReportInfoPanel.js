import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

import { report_const } from './utils/constants';
import { getEmotionImprovements } from './utils/utilFunctions';
import { emotionsAdj } from './utils/emotionList';
import * as colors from './utils/colors';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
    minHeight: report_const.infoPanel.MIN_HEIGHT,
    width: screenWidth - report_const.CONTAINER_PADDING * 2,
    elevation: 2,
  },
  summaryText: {
    fontWeight: 'bold',
  },
  emotionText: {

  }
});

export default class ReportInfoPanel extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      initialData: props.initialData || report_const.DEFAULT_DATA,
      lastData: props.lastData || report_const.DEFAULT_DATA,
      data: props.data || report_const.DEFAULT_DATA,
      improvement: 0,
      duration: 0,
      speechText: props.speechText || report_const.DEFUALT_SPEECH_TEXT,
    };
  }

  componentWillMount() {
    const { initialData, lastData, data } = this.state;

    // max initial/last emotion
    const initialEmotions = initialData.emotions;
    const lastEmotions = lastData.emotions;
    const maxInitialEmotion = Math.max.apply(null, Object.values(initialEmotions));
    const maxLastEmotion = Math.max.apply(null, Object.values(lastEmotions));

    const initialEmotion = Object.keys(initialEmotions).filter(x => initialEmotions[x] === maxInitialEmotion)[0];
    const lastEmotion = Object.keys(lastEmotions).filter(x => lastEmotions[x] === maxLastEmotion)[0];

    // improvement
    const improvement = getEmotionImprovements(initialEmotions, lastEmotions);

    // duration
    const duration = new Date(new Date(data.time.endTime) - new Date(data.time.startTime));

    this.setState({
      initialEmotion,
      lastEmotion,
      improvement,
      duration,
    });
  }

  render() {
    const { initialEmotion, lastEmotion, improvement, duration, speechText } = this.state;
    return (
      <View style={styles.container}>
        {
          (this.props.concise) ?
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.summaryText}>Started <Text style={[styles.emotionText, {color: colors[initialEmotion]}]}>{ emotionsAdj[initialEmotion] }</Text>, Ended <Text style={[styles.emotionText, {color: colors[lastEmotion]}]}>{ emotionsAdj[lastEmotion] }</Text></Text>
              <Text>{parseInt(duration / 36e5)} hr</Text>
            </View>
          :
            <View>
              <Text style={styles.summaryText}>Started <Text style={[styles.emotionText, {color: colors[initialEmotion]}]}>{ emotionsAdj[initialEmotion] }</Text>, Ended <Text style={[styles.emotionText, {color: colors[lastEmotion]}]}>{ emotionsAdj[lastEmotion] }</Text></Text>
              <Text>Time: {parseInt(duration / 864e5)} min</Text>
            </View>
        }
        <Text style={{color: '#A8D277'}}>{improvement * 100}% Improvement</Text>
        {
          (this.props.concise) ?
            <View>
              <Text numberOfLines={1} style={{flex: 1, overflow: 'hidden'}}>{speechText}</Text>
            </View>
          :
            <View>
              <Text>{speechText}</Text>
            </View>
        }
      </View>
    );
  }
}
