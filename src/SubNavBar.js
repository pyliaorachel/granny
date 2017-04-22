import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

import { navbar_const, style_const } from './utils/constants';

const styles = StyleSheet.create({
  container: {
    height: navbar_const.SUBNAVBAR_HEIGHT,
    backgroundColor: style_const.color.themeGreen,
  },
});

export default class SubNavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello</Text>
      </View>
    );
  }
}
