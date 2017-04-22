import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import { StockLine } from 'react-native-pathjs-charts';
import { chart_const, style_const } from './utils/constants'

const styles = StyleSheet.create({
  container: {
    height: chart_const.HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chartCenter: {
    position: 'absolute',
    width: chart_const.chart_options.pie.r * 2 - chart_const.INNER_CIRCLE_MARGIN * 2,
    height: chart_const.chart_options.pie.r * 2 - chart_const.INNER_CIRCLE_MARGIN * 2,
    borderRadius: (chart_const.chart_options.pie.r * 2 - chart_const.INNER_CIRCLE_MARGIN * 2) / 2,
    top: chart_const.RING_THICKNESS + chart_const.INNER_CIRCLE_MARGIN,
    left: chart_const.RING_THICKNESS + chart_const.INNER_CIRCLE_MARGIN,
    backgroundColor: 'white',
    elevation: 2,
  },
});

export default class StockLineChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
    };
  }

  render() {
    const { data, pallete } = this.state;
    console.log(pallete);
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <StockLine 
            data={data}
            options={chart_const.chart_options.stockLine}
            xKey='day'
            yKey='emotionID'
          />
        </View>
    </View>
    )
  }
}
