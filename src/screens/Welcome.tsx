/**
 * Serto Mobile App
 *
 */

import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Config from "react-native-config";
import Analytics from "appcenter-analytics";
import codePush from "react-native-code-push";

Analytics.setEnabled(true);

interface Props {}

export default class App extends React.Component<Props> {
  onButtonPress() {
    codePush.sync({
      updateDialog: {
        appendReleaseDescription: true
      },
      installMode: codePush.InstallMode.IMMEDIATE
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to binary Serto!</Text>
        <Text style={styles.welcome}>Environment = {Config.ENV}</Text>
        <TouchableOpacity
          onPress={() => {
            throw new Error("Sample error");
          }}
        >
          <Text style={styles.welcome}>Press here to crash the app</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Analytics.trackEvent("Sample event");
          }}
        >
          <Text style={styles.welcome}>Press here to trigger sample event</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onButtonPress}>
          <Text>Check for updates</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: Config.BRAND_COLOR
  }
});
