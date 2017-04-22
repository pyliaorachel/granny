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
import { parseChartData } from './utils/utilFunctions';

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
    const { parsedData, data } = this.state;
    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>{report_const.REPORT_TITLE.toUpperCase()}</Text>
        </View>
        <PieChart data={parsedData} />
        <ReportInfoPanel 
          data={this.props.data} 
          initialData={this.props.initialData} 
          lastData={this.props.lastData} 
        />
      </ScrollView>
    );
  }
}
