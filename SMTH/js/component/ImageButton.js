// /**
//  * @providesModule ImageButton
//  */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    TouchableHighlight
} from 'react-native';

import Color from '../config/Color'

export default class ImageButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            press: false,
        }
    }

    render() {
        var tintColor = {};
        return (
            <TouchableHighlight
                style={[styles.container, this.props.style, { width: this.props.width, height: this.props.height }]}
                underlayColor={global.colors.clearColor}
                onHideUnderlay={() => this.setState({ press: false })}
                onShowUnderlay={() => this.setState({ press: true })}
                onPress={this.props.onPress}
                disabled={this.props.disabled}
            >
                <View>
                    <Image style={[styles.image, {
                        width: this.props.width - this.props.margin,
                        height: this.props.height - this.props.margin,
                        tintColor: this.props.color == null ? null : this.props.color
                    }]}
                        source={this.props.source} />
                    <Image style={[styles.pressImage, {
                        width: this.props.width - this.props.margin,
                        height: this.props.height - this.props.margin,
                        opacity: (this.state.press == false ? 0 : 1)
                    }]}
                        source={this.props.pressSource} />
                </View>
            </TouchableHighlight>
        )
    }
}

var styles = {
    get container() {
        return {
            backgroundColor: global.colors.clearColor,
            justifyContent: 'center',
            alignItems: 'center',
        }
    },
    get image() {

    },
    get pressImage() {
        return {
            position: 'absolute',
            top: 0,
            left: 0,
        }
    },
}
