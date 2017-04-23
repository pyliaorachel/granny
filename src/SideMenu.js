import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import { style_const, drawer_const } from './utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: style_const.color.BGGrey,
  },
  cell: {
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    height: drawer_const.HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  icon: {
    color: 'black',
    opacity: 0.6,
    padding: 10,
  },
  text: {
    color: 'black',
    opacity: 0.6,
  },
});

export default class SideMenu extends Component {
  render(){
    return (
      <View style={styles.container}>
        <TouchableHighlight>
          <View style={styles.cell}>
            <Icon
                  name='login'
                  size={20}
                  style={styles.icon}
              />
            <Text style={styles.text}>Login</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight>
          <View style={styles.cell}>
            <Icon
                  name='key'
                  size={20}
                  style={styles.icon}
              />
            <Text style={styles.text}>Change PIN</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}