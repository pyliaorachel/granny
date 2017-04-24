import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import { style_const } from './utils/constants';
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {
    marginVertical: 5,
    flexDirection: 'row',    
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
    margin: 5,
    borderRadius: 3,
  },
  btnText: {
    fontSize: 16,
    color: style_const.color.themeGreen,
  },
});

export default class Options extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    const numOfOptions = Object.keys(this.props.options).length;
    const btnWidth = Math.round((screenWidth - 20) / (numOfOptions / 2)) - 10;
    const options = this.props.options;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
        {
          Object.keys(options).slice(0, numOfOptions/2).map((option, i) => {
            return (
              <TouchableOpacity 
                onPress={() => {this.props.res({option, emotion: options[option]['related-emotion']})}} 
                key={i}
                style={[
                  styles.btn, 
                  {
                    backgroundColor: options[option].color || 'white',
                    width: btnWidth,
                  }
                ]}
              >
                  <Text style={[
                    styles.btnText,
                    {
                      color: options[option]['text-color'] || style_const.color.themeGreen,
                    }
                  ]}>{option}</Text>
              </TouchableOpacity>
            );
          })
        }
        </View>
         <View style={styles.row}>
        {
          Object.keys(options).slice(numOfOptions/2, numOfOptions).map((option, i) => {
            return (
              <TouchableOpacity 
                onPress={() => {this.props.res({option, emotion: options[option]['related-emotion']})}} 
                key={i + numOfOptions/2}
                style={[
                  styles.btn, 
                  {
                    backgroundColor: options[option].color || 'white',                    
                    width: btnWidth,
                  }
                ]}              >
                  <Text style={[
                    styles.btnText,
                    {
                      color: options[option]['text-color'] || style_const.color.themeGreen,
                    }
                  ]}>{option}</Text>
              </TouchableOpacity>
            );
          })
        }
        </View>
      </View>
    );
  }
}