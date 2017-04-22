import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import { Actions } from 'react-native-router-flux';

import { report_const, style_const, navbar_const } from './utils/constants';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: style_const.color.themeGreen,
    borderWidth: 0,
    top: 0,
    height: navbar_const.HEIGHT,
    width: screenWidth,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
  },
  navBarIconContainer: {

  },
  navBarIconButton: {
    color: 'white',
    opacity: 0.6,
    padding: 10,
  }
});

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.settings = this.settings.bind(this);
    this.handleLeaveButtonClick = this.handleLeaveButtonClick.bind(this);
  }

  handleLeaveButtonClick() {
    this.props.leaveAction() || Actions.main();
  }

  settings() {
    console.log('settings');
  }

  render() {
    return (
      <View style={styles.container}>
        {
          (this.props.type === navbar_const.type.MAIN) ? 
            <TouchableHighlight style={styles.navBarIconContainer} underlayColor='transparent' onPress={() => {this.settings()}}>
              <Icon
                  name='gear'
                  size={35}
                  style={styles.navBarIconButton}
              />
            </TouchableHighlight>
          :
            <Icon
                name='close'
                size={35}
                style={{opacity: 0}}
            />
        }
        <Text style={styles.title}>{this.props.title}</Text>
        {
          (this.props.type === navbar_const.type.CLOSE) ? 
            <TouchableHighlight style={styles.navBarIconContainer} underlayColor='transparent' onPress={() => {this.handleLeaveButtonClick()}}>
              <Icon
                  name='close'
                  size={35}
                  style={styles.navBarIconButton}
              />
            </TouchableHighlight>
          :
            <Icon
                name='close'
                size={35}
                style={{opacity: 0}}
            />
        }
      </View>
    );
  }
}