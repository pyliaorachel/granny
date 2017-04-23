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
import * as api from './utils/db/api';
import { parseChartData, parseReportTitleDate } from './utils/utilFunctions';
import { report_const, style_const, navbar_const, enum_const } from './utils/constants';

const { DATA_TYPE, CHART_TYPE } = enum_const;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  container: {
    //flex: 1,
    paddingTop: report_const.CONTAINER_PADDING,
  },
  reportList: {

  },
  reportListCell: {
    borderColor: '#EEEEEE',
    borderWidth: 0.5,
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

    const dataType = (props.tabLabel === 'Today') ? DATA_TYPE.DAY : 
                  ((props.tabLabel === 'This Month') ? DATA_TYPE.MONTH : DATA_TYPE.YEAR);
    const title = (dataType === DATA_TYPE.DAY) ? report_const.REPORT_TITLE_TODAY : 
                  ((dataType === DATA_TYPE.MONTH) ? report_const.REPORT_TITLE_MONTH : report_const.REPORT_TITLE_ALL_TIME);
    const chartType = (dataType === DATA_TYPE.DAY) ? CHART_TYPE.PIE : CHART_TYPE.STOCK_LINE;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      title: title.toUpperCase(),
      dataSource: ds,
      chartData: null,
      allData: null,
      summaryData: null,
      chartType,
      dataType,
    };

    this.pressReport = this.pressReport.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.renderReportList = this.renderReportList.bind(this);
    this.retrievedData = this.retrievedData.bind(this);
  }

  componentWillMount() {
    switch (this.state.dataType) {
      case DATA_TYPE.DAY:
        api.getDayData(d = 20).then(this.retrievedData);
        break;
      case DATA_TYPE.MONTH:
        api.getMonthData().then(this.retrievedData);
        break;
      case DATA_TYPE.YEAR:
        api.getYearData().then(this.retrievedData);
        break;
    }
  }

  retrievedData(data) {
    const chartData = parseChartData(data.summaryData, this.state.chartType);

    this.setState({
      dataSource: data.allData && this.state.dataSource.cloneWithRows(data.allData),
      chartData: chartData,
      allData: data.allData,
      summaryData: data.summaryData,
    });
  }

  pressReport(data) {
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
    return (this.state.chartType === CHART_TYPE.PIE) ? 
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
        <SubNavBar meta={this.state.summaryData && this.state.summaryData.meta}/>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
          <View style={styles.titleTextContainer}>
            <Text style={styles.titleText}>{this.state.title}</Text>
          </View>
          {(this.state.chartData) ? this.renderChart() : null}
          {(this.state.allData) ? this.renderReportList() : null}
        </ScrollView>
      </View>
    );
  }
}
