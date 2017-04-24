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
import { Container, Content, InputGroup, Input, Item } from 'native-base';

import { Actions } from 'react-native-router-flux';
import DismissKeyboard from 'dismissKeyboard';
import * as Auth from './utils/db/authentication';
import * as colors from './utils/colors';
import { navbar_const } from './utils/constants';
import NavBar from './NavBar';

export default class Account extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      response: '',
    };

    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
  }

  static renderNavigationBar(props) {
    return (<NavBar title={props.title} leaveType={navbar_const.type.CLOSE} />);
  }

  signup() {
    DismissKeyboard();
    
    Auth.createMember(this.state.email, this.state.password)
      .then(() => {
        const member = Auth.getMember();
        if (member) {
          Actions.refresh({ member: member });
        }
      })
      .catch ((error) => {
        console.log(error);
      });
  }

  login() {
    DismissKeyboard();

    Auth.logInMember(this.state.email, this.state.password)
      .then(() => {
        const member = Auth.getMember();
        if (member) {
          Actions.refresh({ member: member });
        }
      })
      .catch ((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => DismissKeyboard()}>
        {/*<Container>
          <Content>​
            <Item regular>
              <Input 
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                keyboardType='email-address'
                placeholder='Email Address'
              />
            </Item>
          </Content>
        </Container>*/}
        <View style={{paddingTop: navbar_const.HEIGHT}}>
            <Text>Log In or Sign Up!</Text>
            <TextInput
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              keyboardType='email-address'
              placeholder='Email Address'
            />
            <TextInput
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              secureTextEntry={true}
              placeholder='Password'
            />
            <Button
              onPress={this.signup}
              title='Sign Up'
              color={colors.neutral} />
            <Button
              onPress={this.login}
              title='Log In'
              color={colors.neutral} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

}
