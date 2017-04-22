import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ListView,
  TouchableHighlight,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import PieChart from './PieChart';
import StockLineChart from './StockLineChart';
import ReportInfoPanel from './ReportInfoPanel';
import SubNavBar from './SubNavBar';
import * as API from './utils/API';
import { parseChartData, parseReportTitleDate } from './utils/utilFunctions';
import { report_const, style_const, navbar_const } from './utils/constants';

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  container: {
    //flex: 1,
    paddingVertical: report_const.CONTAINER_PADDING,
  },
  reportList: {

  },
  reportListCell: {
    borderColor: '#EEEEEE',
    borderWidth: 1,
  },
  titleTextContainer: {
    alignSelf: 'center',
  },
  titleText: {
    color: style_const.color.themeGreen,
  },
});

export default class MainPageReport extends Component {
  constructor(props) {
    super(props);

    const title = (props.tabLabel === 'Today') ? report_const.REPORT_TITLE_TODAY : 
                  ((props.tabLabel === 'This Month') ? report_const.REPORT_TITLE_MONTH : report_const.REPORT_TITLE_ALL_TIME);
    const chartType = (props.tabLabel === 'Today') ? 'pie' : 'stockLine';
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      title: title.toUpperCase(),
      dataSource: ds,
      chartData: null,
      allData: null,
      summaryData: null,
      chartType,
    };

    this.pressReport = this.pressReport.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.renderReportList = this.renderReportList.bind(this);
  }

  componentWillMount() {
    const { summaryData, allData } = API.getMockData(this.state.chartType);
    const chartData = parseChartData(summaryData, this.state.chartType);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(allData),
      chartData: chartData,
      allData,
      summaryData,
    });
  }

  pressReport(data) {
    console.log(data);
    Actions.report({
      type: ActionConst.PUSH, 
      data: data.data, 
      title: parseReportTitleDate(data.data),
      hideNavBar: false,
      initialData: data.initialData,
      lastData: data.lastData,
      leaveAction: Actions.pop,
      navbarType: navbar_const.type.CLOSE,
    });
  }

  renderChart() {
  
    return (this.state.chartType === 'pie') ? 
      <PieChart data={this.state.chartData} />
    :
      <StockLineChart data={this.state.chartData} />
  }

  renderReportList() {
    return (
      <ListView
        style={styles.reportList}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => {
          return (
            <TouchableHighlight
              onPress={() => this.pressReport(rowData)}
            >
              <View style={styles.reportListCell}>
                <ReportInfoPanel 
                  concise={true} 
                  data={rowData.data} 
                  initialData={rowData.initialData} 
                  lastData={rowData.lastData} 
                />
              </View>
            </TouchableHighlight>
          );
        }}
      />
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <SubNavBar counts={this.state.summaryData && this.state.summaryData.counts}/>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
          <View style={styles.titleTextContainer}>
            <Text style={styles.titleText}>{this.state.title}</Text>
          </View>
          {this.renderChart()}
          {this.renderReportList()}
        </ScrollView>
      </View>
    );
  }
}
