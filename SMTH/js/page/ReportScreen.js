import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TextInput,
  ScrollView,
  ListView,
  View,
  Navigator,
  FlatList,
  SectionList,
  TouchableWithoutFeedback,
  DeviceEventEmitter
} from 'react-native';

import {
  NetworkManager,
  SectionBlankHeader,
  Button,
  Screen
} from '../config/Common';

export default class ReportScreen extends Component {
  static navigationOptions = {
    title: '举报',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataArray: [],
    }

  }



  render() {
    return (
      <Screen>

      </Screen>
    );
  }
}

