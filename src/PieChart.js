import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Pie } from 'react-native-pathjs-charts';
import * as colors from './utils/colors'
import { chart_options } from './utils/constants'
import { hexToRgb } from './utils/utilFunctions'

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class PieChart extends Component {
  constructor(props) {
    super(props);

    const RGBColors = Object.keys(colors).map((color) => {
      return (color !== 'default') ? hexToRgb(colors[color]) : null;
    });
    RGBColors.pop();

    this.state = {
      data: props.data || defaultData,
      pallete: RGBColors,
    }
  }

  render() {
    const { data, pallete } = this.state;
    return (
      <View style={styles.container}>
        <Pie data={data}
          accessorKey='score'
          options={chart_options.pie}
          pallete={pallete}
          style={{backgroundColor: 'red'}}
        />
      </View>
    )
  }
}
