import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  AppRegistry,
  AsyncStorage,
  dismissKeyboard,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import DismissKeyboard from "dismissKeyboard";
import {
  getMemberStart,
  getMember,
  createMember,
  logInMember,
} from "./database/GrannyDatabase";
import * as colors from './utils/colors';

export default class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      response: "",
    };
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
  }

  ////////////////////////////////
  // Check if already logged in
  ////////////////////////////////

  componentWillMount(){
    const member = getMemberStart();
    if (member) {
      console.log(member + " is already logged in.");
      Actions.main({ member: member });
    } else{
      console.log("New user. Need to log-in or sign-up.");
    }
  }

  ////////////////////////////////
  // Signing Up
  ////////////////////////////////

  async signup() {
    DismissKeyboard();
    try {
      await createMember(this.state.email, this.state.password);
      this.setState({
        response: "Account created! Logging In..."
      });
      setTimeout(() => {
        const member = getMember();
        Actions.main({ member: member });
      }, 1000);
    } catch (error) {
      this.setState({
        response: error.toString()
      })
    }
  }

  ////////////////////////////////
  // Logging In
  ////////////////////////////////

  async login() {
    DismissKeyboard();
    try {
      await logInMember(this.state.email, this.state.password);
      this.setState({
        response: "Logging In..."
      });
      setTimeout(() => {
        const member = getMember();
        Actions.main({ member: member });
      }, 1000);
    } catch (error) {
      this.setState({
        response: error.toString()
      })
    }
  }

  ////////////////////////////////
  // Render views
  ////////////////////////////////

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => {DismissKeyboard()}}>
        <View>
            <Text>Log In or Sign Up!</Text>
            <TextInput
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              keyboardType='email-address'
              placeholder={"Email Address"}
            />
            <TextInput
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              secureTextEntry={true}
              placeholder={"Password"}
            />
            <Button
              onPress={this.signup}
              title="Sign Up"
              color={colors.neutral} />
            <Button
              onPress={this.login}
              title="Log In"
              color={colors.neutral} />
            <Text>{this.state.response}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

}
