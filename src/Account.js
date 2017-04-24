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

import { Actions } from 'react-native-router-flux';
import DismissKeyboard from 'dismissKeyboard';
import * as Auth from './utils/db/authentication';
import { navbar_const, style_const } from './utils/constants';
import * as colors from './utils/colors';
import NavBar from './NavBar';

const HAPPY_GRANNY = require('../assets/emotions/happy.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: style_const.color.BGGrey,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 30,
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
  error: {
    color: 'rgba(237, 47, 47, 0.6)'
  }
});

export default class Account extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      error: '',
    };

    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
  }

  static renderNavigationBar(props) {
    return (<NavBar title={props.title} leaveType={navbar_const.type.CLOSE} />);
  }

  signup() {
    DismissKeyboard();
    
    Auth.createMember(this.state.email)
      .then(() => {
        const member = Auth.getMember();
        if (member) {
          Actions.popTo('main');
        }
      })
      .catch ((error) => {
        console.log(error);
        if (error.code === 'auth/email-already-in-use') {
          this.login();
        } else {
          this.setState({error: error.message});
        }
      });
  }

  login() {
    DismissKeyboard();

    Auth.logInMember(this.state.email)
      .then(() => {
        const member = Auth.getMember();
        if (member) {
          Actions.popTo('main');
        }
      })
      .catch ((error) => {
        console.log(error);
        this.setState({error: error.message});
      });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => DismissKeyboard()}>
        <View style={styles.container}>
          <Image style={styles.imageStyle} source={HAPPY_GRANNY} />
          <TextInput
            style={styles.inputText}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            keyboardType='email-address'
            placeholder='granny@example.com'
            autoCorrect={false}
            underlineColorAndroid={style_const.color.themeGreen}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={this.signup}
          >
            <Text style={styles.btnText}>Start Journey!</Text>
          </TouchableOpacity>
          <Text style={styles.error}>{this.state.error}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

}
