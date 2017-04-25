import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AppRegistry,
  AsyncStorage,
  dismissKeyboard,
  Image,
} from 'react-native';
import DatePicker from 'react-native-datepicker';

import { Actions } from 'react-native-router-flux';
import DismissKeyboard from 'dismissKeyboard';
import { navbar_const, style_const, granny_const } from './utils/constants';
import * as colors from './utils/colors';
import NavBar from './NavBar';
import * as api from './utils/db/api';

const HAPPY_GRANNY = require('../assets/emotions/happy.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: style_const.color.BGGrey,
  },
  imageStyle: {
    width: 50,
    height: 50 * granny_const.HEIGHT / granny_const.WIDTH,
    margin: 10,
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: style_const.color.themeGreen,
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderRadius: 3,
  },
  btnText: {
    fontSize: 16,
    color: 'white',
  },
  inputText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
  info: {
    color: '#cccccc',
    alignSelf: 'center',
  },
  picker: {
    textAlign: 'center',
  }
});

export default class Search extends Component {

  constructor(props) {
    super(props);

    const now = new Date();

    this.state = {
      date: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`,
      minDate: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`,
      maxDate: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`,
      target: 2, // 0 for year, 1 for month, 2 for date
    };
  }

  static renderNavigationBar(props) {
    return (<NavBar title={props.title} leaveType={navbar_const.type.CLOSE} />);
  }

  componentWillMount() {
    const creationTime = api.getCreationTime()
      .then((creationTime) => {
        console.log('search creationtime', creationTime);
        this.setState({
          minDate: creationTime
        });
      });
  }

  selectDate(date) {
    Actions.popTo('main');
    setTimeout(() => {
      Actions.refresh({search: {target: this.state.target, date}});
    }, 10);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => DismissKeyboard()}>
        <View style={styles.container}>
          <Image style={styles.imageStyle} source={HAPPY_GRANNY} />
          <DatePicker
            ref='datepicker'
            style={{width: 0, height: 0}}
            date={this.state.date}
            mode='date'
            placeholder='select date'
            format='YYYY-MM-DD'
            minDate={this.state.minDate}
            maxDate={this.state.maxDate}
            confirmBtnText='Confirm'
            cancelBtnText='Cancel'
            customStyles={{
              width: 0,
              height: 0,
              borderWidth: 0
            }}
            showIcon={false}
            onDateChange={(date) => {this.selectDate(date)}}
          />
          <Text style={styles.info}>Pick a date for journal records.</Text>
          <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.setState({target: 2});
                this.refs.datepicker.onPressDate();
              }}
          >
            <Text style={styles.btnText}>Search Date Entries</Text>
          </TouchableOpacity>
          {/*<Text style={styles.info}>Pick any date in a month.</Text>
          <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.setState({target: 1});
                this.refs.datepicker.onPressDate();
              }}
          >
            <Text style={styles.btnText}>Search Month Trend</Text>
          </TouchableOpacity>
          <Text style={styles.info}>Pick any date in a year.</Text>
          <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.setState({target: 0});
                this.refs.datepicker.onPressDate();
              }}
          >
            <Text style={styles.btnText}>Search Year Trend</Text>
          </TouchableOpacity>*/}
        </View>
      </TouchableWithoutFeedback>
    );
  }

}
