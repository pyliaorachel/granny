import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';

import PieChart from './PieChart';
import NavBar from './NavBar';
import ReportInfoPanel from './ReportInfoPanel';
import * as emotionList from './utils/emotionList';
import * as sentences from './utils/sentences';
import { report_const, style_const, navbar_const, enum_const } from './utils/constants';
import { parseChartData, parseInfoPanelData } from './utils/utilFunctions';
import * as api from './utils/db/api';

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
    };
  }

  componentWillMount() {
    // chart data
    let parsedData = parseChartData(this.state.data, enum_const.CHART_TYPE.PIE);

    this.setState({
      parsedData,
    });

    //if (this.props.isNewJourney) {
      const { initialData, lastData, data, transcript } = this.props;
      api.uploadJourney({
        initialData: initialData || false, 
        lastData: lastData || false, 
        data: data || false, 
        transcript: transcript || false,
      });
    //}
  }

  static renderNavigationBar(props) {
    return (<NavBar leaveAction={props.leaveAction} title={props.title} leaveType={props.navbarType} />);
  }

  render() {
    const { parsedData } = this.state;
    const { initialData, lastData, data } = this.props;
    return (
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>{report_const.REPORT_TITLE.toUpperCase()}</Text>
        </View>
        <PieChart data={parsedData} />
        <ReportInfoPanel 
          initialData={initialData}
          lastData={lastData}
          data={data}
        />
      </ScrollView>
    );
  }
}
