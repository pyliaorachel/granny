import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class Report extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      key: props.dataKey,
    };
  }

  componentDidMount() {
    const { data, key } = this.state;
    
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.key}</Text>
      </View>
    );
  }
}
