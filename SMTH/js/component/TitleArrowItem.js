import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';

import {
    CellBackground
} from '../config/Common';

export default class TitleArrowItem extends Component {
    render() {
        return (
            <CellBackground onPress={this.props.onPress} >
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
                    </View>
                </View>
            </CellBackground>
        )
    }
}

var styles = {
    get container() {
        return {
            flexDirection: 'column',
            backgroundColor: global.colors.whiteColor
        }
    },
    get content() {
        return {
            marginLeft: 13,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 44,
        }
    },
    get title() {
        return {
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            backgroundColor: global.colors.whiteColor,
        }
    },
    get arrow() {
        return {
            marginRight: 13,
            width: 10,
            height: 17,
        }
    },
}