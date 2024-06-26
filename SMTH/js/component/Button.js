// /**
//  * @providesModule Button
//  */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableWithoutFeedback,
    TouchableHighlight
} from 'react-native';

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            press: false,
        }
    }

    render() {
        return (
            <TouchableHighlight
                style={[{
                    height: this.props.height ? this.props.height : 40,
                    backgroundColor: (this.props.backgroundColor != null ? this.props.backgroundColor : global.colors.whiteColor)
                }, this.props.style]}
                underlayColor={(this.props.backgroundColor != null ? this.props.backgroundColor : global.colors.clearColor)}
                onHideUnderlay={() => this.setState({ press: false })}
                onShowUnderlay={() => this.setState({ press: true })}
                onPress={this.props.onPress}
                disabled={this.props.disabled}
            >
                <View style={styles.container}>
                    <Text style={[styles.text, { color: (this.props.disabled ? global.colors.gray3Color : (this.state.press == false ? (this.props.fontColor != null ? this.props.fontColor : global.colors.themeColor) : global.colors.gray3Color)) }]}>
                        {this.props.text}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
}

var styles = {
    get container() {
        return {
            justifyContent: 'center',
            alignItems: 'center',
            // flexDirection: 'row',
            flex: 1,
        }
    },
    get text() {
        return {
            fontSize: global.configures.fontSize16,
            textAlign: 'center'
        }
    },
}
