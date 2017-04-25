import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ListView,
  TouchableHighlight,
  Image
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Spinner } from 'native-base';

import PieChart from './PieChart';
import StockLineChart from './StockLineChart';
import ReportInfoPanel from './ReportInfoPanel';
import SubNavBar from './SubNavBar';
import * as api from './utils/db/api';
import { parseChartData, parseReportTitleDate, getPaddingUntil } from './utils/utilFunctions';
import { report_const, style_const, navbar_const, enum_const, timeout_const, granny_const } from './utils/constants';
import * as Auth from './utils/db/authentication';

const { DATA_TYPE, CHART_TYPE } = enum_const;
const ERROR_GRANNY_IMAGE = require('../assets/emotions/surprised.png');
const TITLE_REPLACE = {
  [DATA_TYPE.DAY]: 'DAY',
  [DATA_TYPE.MONTH]: 'MONTH',
  [DATA_TYPE.YEAR]: 'YEAR',
};

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
  imageStyle: {
    width: 200,
    height: 200 * granny_const.HEIGHT / granny_const.WIDTH,
    margin: 30,
  },
  errorText: {
    fontSize: 16,
    color: style_const.color.themeGreen,
    fontFamily: 'Open Sans',
  }
});

export default class MainPageReport extends Component {
  constructor(props) {
    super(props);

    const dataType = (props.tabLabel === 'Day') ? DATA_TYPE.DAY : 
                  ((props.tabLabel === 'Month') ? DATA_TYPE.MONTH : DATA_TYPE.YEAR);
    const title = (dataType === DATA_TYPE.DAY) ? report_const.REPORT_TITLE_DAY : 
                  ((dataType === DATA_TYPE.MONTH) ? report_const.REPORT_TITLE_MONTH : report_const.REPORT_TITLE_YEAR);
    const chartType = (dataType === DATA_TYPE.DAY) ? CHART_TYPE.PIE : CHART_TYPE.STOCK_LINE;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    const now = new Date();

    let y, m, d;
    if (props.date) {
      const split = props.date.split('-');
      y = Number(split[0]).toString();
      m = Number(split[1]).toString();
      d = Number(split[2]).toString();
    }
    console.log('props.date', props.date);

    this.state = {
      title: title.toUpperCase(),
      dataSource: ds,
      chartData: null,
      allData: null,
      summaryData: null,
      chartType,
      dataType,
      y,
      m,
      d,
      date: props.date,
      hasData: false,
      stopSpinning: false,
      UID: props.UID,
    };

    this.pressReport = this.pressReport.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.renderReportList = this.renderReportList.bind(this);
    this.retrievedData = this.retrievedData.bind(this);
    this.getData = this.getData.bind(this);
    this.getReplace = this.getReplace.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.UID !== this.state.UID) {
      this.setState({ UID: props.UID, stopSpinning: false });
      this.getData();
      setTimeout(() => {
        if (!this.state.hasData) {
          this.setState({ stopSpinning: true });
        }
      }, timeout_const.RETRIEVE_DATA_TIMEOUT);
    }
    if (props.date !== this.state.date) {
      console.log('props.date', props.date);
      let y, m, d;
      if (props.date) {
        const split = props.date.split('-');
        y = Number(split[0]).toString();
        m = Number(split[1]).toString();
        d = Number(split[2]).toString();
      }
      console.log('y, m, d, date', y, m, d, props.date);
      this.setState({
        y, m, d, 
        date: props.date, 
        stopSpinning: false, hasData: false,
        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        chartData: null,
        allData: null,
        summaryData: null, 
      }, () => {
        this.getData();
        setTimeout(() => {
          if (!this.state.hasData) {
            this.setState({ stopSpinning: true });
          }
        }, timeout_const.RETRIEVE_DATA_TIMEOUT);
      });
    }
  }

  componentWillMount() {
    const member = Auth.getMember();
    if (member) {
      this.setState({ UID: member.uid, stopSpinning: false }, () => {
        this.getData();
        setTimeout(() => {
          if (!this.state.hasData) {
            this.setState({ stopSpinning: true });
          }
        }, timeout_const.RETRIEVE_DATA_TIMEOUT);
      });

    } else{
      this.setState({ stopSpinning: true });
    }
  }

  getReplace() {
    const { date, y, m, d, dataType } = this.state;
    if (dataType === DATA_TYPE.DAY) {
      return `DAY ${y}-${m}-${d}`;
    }
    if (dataType === DATA_TYPE.MONTH) {
      return `MONTH ${y}-${m}`;
    }
    if (dataType === DATA_TYPE.YEAR) {
      return `YEAR ${y}`;
    }
  }

  getData() {
    const { d, m, y } = this.state;
    switch (this.state.dataType) {
      case DATA_TYPE.DAY:
        api.getDayMetaData(this.retrievedData);
        api.getDayData(this.retrievedData, d, m, y);
        break;
      case DATA_TYPE.MONTH:
        api.getMonthData(this.retrievedData, m, y);
        break;
      case DATA_TYPE.YEAR:
        api.getYearData(this.retrievedData, y);
        break;
    }
  }

  retrievedData(data) {
    console.log('retrieved data', data);
    if (data.dayMetaData) {
      const meta = Object.assign({}, this.state.summaryData && this.state.summaryData.meta, data.dayMetaData);
      this.setState({
        summaryData: {
          meta,
        },
        hasData: true,
      });
    }

    if (data.summaryData) {
      const paddingUntil = getPaddingUntil(this.state.dataType, this.state.m, this.state.y);
      const chartData = parseChartData(data.summaryData, this.state.chartType, paddingUntil);

      const meta = Object.assign({}, this.state.summaryData && this.state.summaryData.meta, data.summaryData.meta);

      this.setState({
        chartData: chartData,
        summaryData: {
          ...this.state.summaryData,
          meta,
        },
        hasData: true,
      });
    }

    if (data.allData) {
      this.setState({
        dataSource: data.allData && this.state.dataSource.cloneWithRows(data.allData),
        allData: data.allData,
        hasData: true,
      });
    }
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
      transcript: data.transcript,
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
      (this.state.hasData) ?
        (
          <View style={{flex: 1}}>
            <SubNavBar meta={this.state.summaryData && this.state.summaryData.meta}/>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
              <View style={styles.titleTextContainer}>
                <Text style={styles.titleText}>{this.state.title.replace(TITLE_REPLACE[this.state.dataType], this.getReplace())}</Text>
              </View>
              {(this.state.chartData) ? this.renderChart() : null}
              {(this.state.allData) ? this.renderReportList() : null}
            </ScrollView>
          </View>
        )
      :
        (
          (!this.state.stopSpinning) ?
            <View style={{flex: 1,backgroundColor: style_const.color.BGGrey, justifyContent: 'center', alignItems: 'center'}}>
              <Spinner color={style_const.color.themeGreen} />
            </View>
          : 
            <View style={{flex: 1,backgroundColor: style_const.color.BGGrey, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.errorText}>There are currently no data to be retrieved!</Text>
              <Image style={styles.imageStyle} source={ERROR_GRANNY_IMAGE} />
            </View>
        )
    );
  }
}
