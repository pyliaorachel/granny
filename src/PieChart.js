import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Pie } from 'react-native-pathjs-charts';
import * as colors from './utils/colors'
import { chart_options } from './utils/constants'
import { hexToRgb } from './utils/utilFunctions'

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartContainer: {
    flex: 2,
  },
  legendsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  legendCellContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  emotionCell: {

  },
  emotionText: {
    backgroundColor: 'blue',
    alignItems: 'center',
  }
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
        name: item.name, 
        score: item.score * 100, 
        color: colors[item.name],
        size: (item.score >= 0.4) ? 40 : 40 * (item.score * 100 / 40),
        borderRadius: (item.score >= 0.4) ? 5 : 5 * (item.score * 100 / 40),
      };
    });

    this.state = {
      data: props.data,
      pallete: RGBColors,
      topThree,
    }
  }

  render() {
    const { data, pallete, topThree } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <Pie data={data}
            accessorKey='score'
            options={chart_options.pie}
            pallete={pallete}
          />
        </View>
        <View style={styles.legendsContainer}>
        {
          topThree.map((item, i) => {
            return (
              <View style={styles.legendCellContainer} key={i}>
                <View style={[styles.emotionCell, {backgroundColor: item.color, width: item.size, height: item.size, borderRadius: item.borderRadius}]}></View>
                <View style={styles.emotionText}>
                  <Text>{ item.score } %</Text>
                  <Text>{ item.name }</Text>
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
