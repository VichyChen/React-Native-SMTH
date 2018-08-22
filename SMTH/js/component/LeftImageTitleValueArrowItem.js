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

export default class LeftImageTitleValueArrowItem extends Component {
    render() {
        return (
            <CellBackground onPress={this.props.onPress} >
                <View style={styles.container}>
                    <Image style={styles.leftImage} source={this.props.leftImageSource} />
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
    get leftImage() {
        return {
            position: 'absolute',
            top: 12,
            left: 13,
            height: 20,
            width: 20,
        }
    },
    get content() {
        return {
            paddingLeft: 34,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 44,
        }
    },
    get title() {
        return {
            paddingLeft: 13,
            paddingRight: 13,
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
