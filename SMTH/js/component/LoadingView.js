import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Text,
    Dimensions,
    Animated,
    ActivityIndicator
} from 'react-native';

import {
} from '../config/Common';

export default class LoadingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(1),
            width: new Animated.Value(10000),
            height: new Animated.Value(10000),
        }
    }

    render() {
        if (this.props.hidden == true) {
            Animated.sequence([
                Animated.timing(
                    this.state.opacity,
                    {
                        toValue: 0,
                        duration: 400,
                    },
                ),
                Animated.parallel([
                    Animated.timing(
                        this.state.width,
                        {
                            toValue: 0,
                            duration: 0,
                        },
                    ),
                    Animated.timing(
                        this.state.height,
                        {
                            toValue: 0,
                            duration: 0,
                        },
                    ),
                ]),
            ]).start();

            return (
                <Animated.View style={[styles.container, {
                    backgroundColor: this.props.clear == true ? global.colors.clearColor : (this.props.backgroundColor ? this.props.backgroundColor : global.colors.whiteColor),
                    width: this.state.width,
                    height: this.state.height,
                    opacity: this.state.opacity,
                }]}>
                    <ActivityIndicator
                        animating={true}
                        style={[styles.indicator]}
                        size="small"
                    />
                </Animated.View >
            )
        }
        //显示
        else {
            return (
                <Animated.View style={[styles.container, {
                    backgroundColor: this.props.clear == true ? global.colors.clearColor : (this.props.backgroundColor ? this.props.backgroundColor : global.colors.whiteColor),
                    opacity: 1,
                }]}>
                    <ActivityIndicator
                        animating={true}
                        style={[styles.indicator]}
                        size="small"
                    />
                </Animated.View >
            )
        }
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }
    },
    get indicator() {
    },
}
