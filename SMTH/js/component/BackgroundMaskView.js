import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Text,
    Picker,
    Animated,
    Dimensions
} from 'react-native';

import Color from '../config/Color'

export default class BackgroundMaskView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(0),
            opacity: new Animated.Value(0),
        }
    }

    render() {
        Animated.timing(this.state.translateY, {
            toValue: (this.props.hidden ? Dimensions.get('window').height - 64 : 0),
            duration: 1
        }).start();

        Animated.timing(
            this.state.opacity,
            {
                toValue: (this.props.hidden ? 0 : 0.3),
                duration: 600
            }
        ).start();

        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <Animated.View style={[styles.background, {
                    transform: [{ translateY: this.state.translateY }],
                    height: this.props.height,
                    opacity: this.state.opacity,
                    zIndex: 1,
                }]}>

                </Animated.View >
            </TouchableWithoutFeedback>
        )
    }
}

var styles = {
    get background() {
        return {
            backgroundColor: 'black',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        }
    },
}
