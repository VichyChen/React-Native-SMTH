import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
} from 'react-native';

import Color from '../config/Color'

export default class SectionBlankHeader extends Component {
    render() {
        return (
            <View style={[styles.container, { height: this.props.height ? this.props.height : 13 }]}>
            </View>
        )
    }
}

var styles = {
    get container() {
        return {
            backgroundColor: global.colors.backgroundGrayColor,
            flexDirection: 'row',
            alignItems: 'center',
        }
    },
}
