import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import * as emotionList from './utils/emotionList';
import * as colors from './utils/colors';

const emotions = emotionList.emotions;

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendTextStyle: {
    color: '#333333',
  },
});

export default class Legends extends Component {
  constructor(props) {
    super(props);
  }

  parseLegends(start, end) {
    const legendList = emotions.slice(start, end).map((emotion,i) => {
      return (<View style={styles.legendStyle} key={i}>
        <View style={{
          width: 10,
          height: 10,
          marginRight: 5,
          backgroundColor: colors[emotion]
        }} />
        <Text style={styles.legendTextStyle}>{emotion}</Text>
      </View>);
    });
    return legendList;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 0.25, flexDirection: 'row'}}>{this.parseLegends(0,2)}</View>
        <View style={{flex: 0.25, flexDirection: 'row'}}>{this.parseLegends(2,4)}</View>
        <View style={{flex: 0.25, flexDirection: 'row'}}>{this.parseLegends(4,6)}</View>
        <View style={{flex: 0.25, flexDirection: 'row'}}>{this.parseLegends(6,8)}</View>
      </View>
    )
  }
}
