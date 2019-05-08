import React from "react";
import { YellowBox } from "react-native";
import { createDrawerNavigator, createAppContainer } from "react-navigation";
import Settings from "./Settings";
import Welcome from "./Welcome";
import Analytics from "appcenter-analytics";

import {} from "react-native";

YellowBox.ignoreWarnings([
  "Warning: componentWillUpdate is deprecated",
  "Warning: componentWillReceiveProps is deprecated"
]);

Analytics.setEnabled(true);

const TabNavigator = createDrawerNavigator({
  Home: Welcome,
  Settings: Settings
});

export default createAppContainer(TabNavigator);
