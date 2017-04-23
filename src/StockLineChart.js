import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import { StockLine } from 'react-native-pathjs-charts';
import { hexToRgba, rgbaToRgb } from './utils/utilFunctions';
import { chart_const, style_const } from './utils/constants';
import { emotions } from './utils/emotionList';
import * as colors from './utils/colors';

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

    let pallete;
    if (props.data) {
      pallete = props.data.map((item) => {
        const color = colors[emotions[item[1].emotionID]];
        return rgbaToRgb(hexToRgba(color, 0.5));
      });
    }

    this.state = {
      data: props.data,
      pallete,
    };
  }

  render() {
    const { data, pallete } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <StockLine 
            data={data}
            options={chart_const.chart_options.stockLine}
            xKey='day'
            yKey='emotionID'
            pallete={pallete}
          />
        </View>
    </View>
    )
  }
}
