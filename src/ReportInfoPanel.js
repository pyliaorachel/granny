import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

import { report_const, style_const } from './utils/constants';
import { emotionsAdj } from './utils/emotionList';
import * as colors from './utils/colors';
import { parseInfoPanelData } from './utils/utilFunctions';

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

  },
  keywordContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  keyword: {
    marginRight: 3,
    color: 'white',
    backgroundColor: style_const.color.themeGreen,
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  transcriptContainer: {

  },
  speechTextEntry: {
    backgroundColor: style_const.color.BGGrey,
    borderRadius: 2,
    marginBottom: 2,
    paddingHorizontal: 3,
  }
});

export default class ReportInfoPanel extends Component {
  constructor(props) {
    super(props);

    const { initialEmotion, lastEmotion, improvement, duration } = parseInfoPanelData(props);
    
    this.state = {
      initialEmotion: initialEmotion || 'sad',
      lastEmotion: lastEmotion || 'happiness',
      improvement: improvement || 0,
      duration: duration || 0,
      speechText: props.speechText || report_const.DEFAULT_SPEECH_TEXT,
      parsedData: report_const.DEFAULT_PARSED_DATA,
      keywords: props.keywords || report_const.DEFAULT_KEYWORDS,
      transcript: props.transcript || report_const.DEFAULT_TRANSCRIPT,
      parsedTranscript: null,
    };

    this.renderSpeechText = this.renderSpeechText.bind(this);
  }

  componentWillMount() {
    this.parseSpeechText();
  }

  parseSpeechText() {
    const transcript = this.state.transcript;
    const parsedTranscript = transcript.map((entry, i) => {
      return (<Text key={i} style={styles.speechTextEntry}>{this.renderSpeechText(entry.answer)}</Text>);
    });
    this.setState({
      parsedTranscript,
    });
  }

  renderSpeechText(text) {
    const { keywords } = this.state;

    let textList = [];
    let lastIndex = 0; const l = text.length; let count = 0;
    while (lastIndex < l) {
      let smallestIndex = l; let kw = ''; let emotion = '';
      keywords.forEach((keyword) => {
        const i = text.indexOf(keyword.text, lastIndex);
        if (i < smallestIndex && i !== -1) {
          smallestIndex = i;
          kw = keyword.text;
          emotion = keyword.emotion;
        }
      });
      if (kw === '') {
        textList.push(<Text key={count++}>{text.substr(lastIndex)}</Text>);
        break;
      }
      textList.push(<Text key={count++}>{text.substr(lastIndex, smallestIndex - lastIndex)}</Text>);
      textList.push(<Text key={count++} style={{color: colors[emotion]}}>{kw}</Text>);
      console.log('keyword', kw, emotion);
      lastIndex = smallestIndex + kw.length;
    }
    return textList;
  }

  render() {
    const { initialEmotion, lastEmotion, improvement, duration, speechText, keywords, parsedTranscript } = this.state;
    return (
      <View style={[
        styles.container, 
        {
          width: (this.props.concise) ? screenWidth : (screenWidth - report_const.CONTAINER_PADDING * 2),
          paddingVertical: (this.props.concise) ? 0 : report_const.CONTAINER_PADDING,
        }
      ]}>
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
        <Text style={{color: '#A8D277'}}>{improvement}% Improvement</Text>
        {
          (this.props.concise) ?
            <View>
              <Text numberOfLines={1} style={{flex: 1, overflow: 'hidden'}}>{speechText}</Text>
            </View>
          :
            <View>
              <View style={styles.keywordContainer}>
              {
                keywords.map((keyword, i) => {
                  return (<Text key={i} style={[styles.keyword, { backgroundColor: colors[keyword.emotion]}]}>{keyword.text}</Text>)
                })
              }
              </View>
              <View style={styles.transcriptContainer}>{parsedTranscript}</View>
            </View>
        }
      </View>
    );
  }
}
