/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
    TouchableHighlight,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';

import codePush from 'react-native-code-push'

import {
    NetworkManager,
    DateUtil,
    SeperatorLine,
    HorizontalSeperatorLine,
    SectionHeader,
    CellBackground,
    LoginView,
    LoadingView,
    Screen,
    Toast,
    ToastUtil,
    AvatorImage,
    NavigationBar
} from '../config/Common';

export default class NewHotListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

        console.log('NewHotListScreen constructor');
    }

    render() {
        console.log('NewHotListScreen render');
        return (
            <View style={{ flex: 1 }}>
                <Text>111</Text>
            </View>
        )
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            padding: 0,
            backgroundColor: global.colors.clearColor
        }
    },

}
