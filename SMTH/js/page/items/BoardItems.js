import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableWithoutFeedback
} from 'react-native';

import Color from 'Color'
import {
    SeperatorLine,
    CellBackground
} from '../../config/Common';

export default class BoardItems extends Component {
    render() {
        return (
            <CellBackground onPress={this.props.onPress} >
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View>
                            <Text style={styles.board}>{this.props.text}</Text>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={styles.type}>{this.props.type}</Text>
                            </View>
                        </View>
                        <Image style={styles.arrow} source={require('../../image/icon_forward_arrow.png')} />
                    </View>
                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    }
}

var styles = {
    get container() {
        return {
            flexDirection: 'column',
            backgroundColor: global.colors.clearColor
        }
    },
    get content() {
        return {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: global.colors.whiteColor
        }
    },
    get board() {
        return {
            marginTop: 10,
            marginLeft: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            backgroundColor: global.colors.whiteColor,
        }
    },
    get type() {
        return {
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 5,
            paddingRight: 5,
            marginTop: 8,
            marginBottom: 10,
            marginLeft: 13,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.backgroundGrayColor,
            borderRadius: 10,
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