import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { env_const } from './utils/constants';
import * as colors from './utils/colors';

const windowWidth = env_const.WINDOW_WIDTH;
const windowHeight = env_const.WINDOW_HEIGHT;

const dimensions = {
  buttonWidth: windowWidth / 4,
  buttonHeight: windowWidth / 4,
};

const recordImage = require('../assets/buttons/green-button.png');  // PLACEHOLDER PICS
const archiveImage = require('../assets/buttons/red-button.png');   // PLACEHOLDER PICS

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextStyle: {
    fontSize: 46,
  },
  buttonStyle: {
    width: dimensions.buttonWidth,
    height: dimensions.buttonHeight,
  },
});

export default class MainMenu extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (

      <View style={StyleSheet.flatten([styles.container, {backgroundColor: colors['neutral']}])}>

        <View style={{flex: 0.1}}></View>

        <View style={{flex: 0.1}}>
          <Text style={styles.titleTextStyle}>G R A N N Y</Text>
        </View>

        <View style={{flex: 0.2, flexDirection: 'row'}}>

          <TouchableOpacity onPress={Actions.room}>
            <Image style={styles.buttonStyle} source={recordImage}/>
          </TouchableOpacity>

          {/* find a better way to space -_- */}
          <Text style={styles.titleTextStyle}>     </Text>

          <TouchableOpacity onPress={Actions.report}>
            <Image style={styles.buttonStyle} source={archiveImage}/>
          </TouchableOpacity>

        </View>

      </View>

    );
  }
}
