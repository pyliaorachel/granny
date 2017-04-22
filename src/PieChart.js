import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import { Pie } from 'react-native-pathjs-charts';
import * as colors from './utils/colors'
import { chart_const, style_const } from './utils/constants'
import { hexToRgb } from './utils/utilFunctions'

const styles = StyleSheet.create({
  container: {
    height: chart_const.HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  chartContainer: {
    //flex: 2,
    alignItems: 'center',
    margin: 10,
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
  legendsContainer: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  legendCellContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionCell: {

  },
  emotionTextContainer: {
    alignItems: 'center',
  },
  emotionScoreText: {
    fontSize: 20,
  },
  emotionNameText: {
    fontSize: 12,
  },
});

export default class PieChart extends Component {
  constructor(props) {
    super(props);

    const RGBColors = Object.keys(colors).map((color) => {
      return (color !== 'default') ? hexToRgb(colors[color]) : null;
    });
    RGBColors.pop();

    const topThree = props.data.sort((a, b) => b.score - a.score).slice(0, 3).map((item) => {
      return {
        name: item.name[0].toUpperCase() + item.name.slice(1), 
        score: parseInt(item.score * 100), 
        color: colors[item.name],
        size: (item.score >= 0.4) ? 40 : 40 * (item.score * 100 / 40),
        borderRadius: (item.score >= 0.4) ? 4 : 4 * (item.score * 100 / 40),
      };
    });

    this.state = {
      data: props.data,
      pallete: RGBColors,
      topThree,
    };
  }

  render() {
    const { data, pallete, topThree } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <Pie data={data}
            accessorKey='score'
            options={chart_const.chart_options.pie}
            pallete={pallete}
          />
          <View style={styles.chartCenter}>

          </View>
        </View>
        <View style={styles.legendsContainer}>
        {
          topThree.map((item, i) => {
            return (
              <View style={styles.legendCellContainer} key={i}>
                <View style={[styles.emotionCell, {backgroundColor: item.color, width: item.size, height: item.size, borderRadius: item.borderRadius}]}></View>
                <View style={styles.emotionTextContainer}>
                  <Text style={styles.emotionScoreText}>{ item.score } %</Text>
                  <Text style={styles.emotionNameText}>{ item.name }</Text>
                </View>
              </View>
            );
          })
        }
        </View>
      </View>
    )
  }
}
