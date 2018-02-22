import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
} from 'react-native';

import Color from '../config/Color'

export default class SeperatorLine extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.line, { backgroundColor: this.props.color == null ? global.colors.seperatorColor : this.props.color }]} />
            </View>
        )
    }
}

var styles = {
    get container() {
        return {
            backgroundColor: global.colors.whiteColor,
        }
    },
    get line() {
        return {
            marginLeft: 13,
            height: 1,
        }
    },
}
