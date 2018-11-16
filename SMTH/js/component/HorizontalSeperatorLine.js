import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
} from 'react-native';

export default class HorizontalSeperatorLine extends Component {
    render() {
        return (
            <View style={[styles.container, { width: this.props.width == null ? null : this.props.width}]}>
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

            height: 1,
        }
    },
}
