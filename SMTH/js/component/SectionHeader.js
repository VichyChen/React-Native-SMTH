import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
} from 'react-native';

import Color from '../config/Color'

export default class SectionHeader extends Component {
    render() {
        return (
            <View style={[styles.container, { backgroundColor: this.props.color == null ? global.colors.backgroundGrayColor : this.props.color }]}>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
        )
    }
}

var styles = {
    get container() {
        return {
            height: 40,
            flexDirection: 'row',
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
}
