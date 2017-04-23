import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { navbar_const, style_const } from './utils/constants';

const styles = StyleSheet.create({
  container: {
    height: navbar_const.SUBNAVBAR_HEIGHT,
    backgroundColor: style_const.color.themeGreen,
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 2,
  },
  cell: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  number: {
    color: 'rgba(255, 255, 255, 0.8)', 
    fontStyle: 'italic', 
    alignSelf: 'center'
  },
  title: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  separator: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    height: navbar_const.SUBNAVBAR_HEIGHT - 10,
  }
});

export default class SubNavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meta: props.meta || {
        entries: 0,
        improvements: 0,
        streak: 0,
      }
    };
  }

  componentWillReceiveProps(props) {
    if (!this.state.meta !== props.meta) {
      this.setState({
        meta: {...props.meta}
      });
    }
  }

  render() {
    const { entries, improvements, streak } = this.state.meta;
    return (
      <View style={styles.container}>
        <View style={styles.cell}>
          <Icon
            name='edit'
            size={25}
            color='rgba(255, 255, 255, 0.8)'
          />
          <View>
            <Text style={styles.number}>{entries}</Text>
            <Text style={styles.title}>ENTRIES</Text>
          </View>
        </View>
        <View style={styles.separator}/>
        <View style={styles.cell}>
          <Icon
            name='flare'
            size={25}
            color='rgba(255, 255, 255, 0.6)'
          />
          <View>
            <Text style={styles.number}>{improvements}</Text>
            <Text style={styles.title}>IMPROVEMENTS</Text>
          </View>
        </View>
        <View style={styles.separator}/>
        <View style={styles.cell}>
          <Icon
            name='directions-run'
            size={25}
            color='rgba(255, 255, 255, 0.6)'
          />
          <View>
            <Text style={styles.number}>{streak} day{(streak === 1 ? '' : 's')}</Text>
            <Text style={styles.title}>STREAK</Text>
          </View>
        </View>
      </View>
    );
  }
}
