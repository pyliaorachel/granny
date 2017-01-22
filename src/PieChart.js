import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Pie } from 'react-native-pathjs-charts';
import * as colors from './utils/colors'

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const options = {
  margin: {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20
  },
  width: 300,
  height: 300,
  color: '#2980B9',
  r: 20,
  R: 100,
};

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        'r': parseInt(result[1], 16),
        'g': parseInt(result[2], 16),
        'b': parseInt(result[3], 16)
    } : null;
}

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
          options={options}
          pallete={pallete}
          style={{backgroundColor: 'red'}}
        />
      </View>
    )
  }
}
