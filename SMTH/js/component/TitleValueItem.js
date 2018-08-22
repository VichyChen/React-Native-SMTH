import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
} from 'react-native';

export default class TitleValueItem extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.title}</Text>
                <Text style={styles.value}>{this.props.value}</Text>
            </View>
        )
    }
}

var styles = {
    get container() {
        return {
            backgroundColor: global.colors.whiteColor,
            height: 44,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }
    },
    get title() {
        return {
            marginLeft: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get value() {
        return {
            marginRight: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
}