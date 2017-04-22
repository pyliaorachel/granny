import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

import { report_const } from './utils/constants';
import { emotionsAdj } from './utils/emotionList';
import * as colors from './utils/colors';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: report_const.CONTAINER_PADDING,
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
      initialEmotion: props.initialEmotion || 'sad',
      lastEmotion: props.lastEmotion || 'happiness',
      improvement: props.improvement || 0,
      duration: props.duration || 0,
      speechText: props.speechText || report_const.DEFUALT_SPEECH_TEXT,
    };
  }

  componentWillMount() {
    
  }

  render() {
    const { initialEmotion, lastEmotion, improvement, duration, speechText } = this.state;
    return (
      <View style={[styles.container, {width: (this.props.concise) ? screenWidth : (screenWidth - report_const.CONTAINER_PADDING * 2)}]}>
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
