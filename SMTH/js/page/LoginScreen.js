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
} from 'react-native';

import {
    NetworkManager,
} from '../config/Common';

export default class LoginScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '登录',
    });

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Text>111122222</Text>
        )
    }
}