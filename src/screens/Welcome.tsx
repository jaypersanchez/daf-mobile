/**
 * Serto Mobile App
 *
 */

import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Config from 'react-native-config';

interface Props {}
interface State {}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Serto!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: Config.BRAND_COLOR,
  },
});
