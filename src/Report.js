import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import PieChart from './PieChart';
import NavBar from './NavBar';
import ReportInfoPanel from './ReportInfoPanel';
import * as emotionList from './utils/emotionList';
import * as sentences from './utils/sentences';
import { report_const, style_const, navbar_const } from './utils/constants';
import { parseChartData, getEmotionImprovements } from './utils/utilFunctions';

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  container: {
    //flex: 1,
    justifyContent: 'center',
    padding: report_const.CONTAINER_PADDING,
    paddingTop: navbar_const.HEIGHT + report_const.CONTAINER_PADDING,
  },
  timeTextStyle: {
    fontSize: 18,
    color: '#aaaaaa',
  },
  titleTextContainer: {
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
      initialEmotion: props.initialEmotion || 'sad',
      lastEmotion: props.lastEmotion || 'happiness',
      improvement: 0,
      duration: 0,
    };
  }

  componentWillMount() {
    // chart data
    let parsedData = parseChartData(this.state.data.emotions);
    //let max = Math.max.apply(null, Object.values(initialEmotions));
    //let maxEmotion = '';
    

    if (this.props.data && this.props.data.error) {
      //maxEmotion = 'error';
    }

    // info panel data
    const { initialData, lastData, data } = this.props;

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

    this.setState({
      parsedData,
      //maxEmotion,
    });
  }

  static renderNavigationBar(props) {
    console.log(props.leaveAction);
    return (<NavBar leaveAction={props.leaveAction} title={props.title} type={props.navbarType}/>);
  }

  render() {
    const { parsedData, data, initialEmotion, lastEmotion, improvement, duration } = this.state;
    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>{report_const.REPORT_TITLE.toUpperCase()}</Text>
        </View>
        <PieChart data={parsedData} />
        <ReportInfoPanel 
          initialEmotion={initialEmotion}
          lastEmotion={lastEmotion}
          improvement={improvement}
          duration={duration}
        />
      </ScrollView>
    );
  }
}
