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

import Color from '../config/Color'
// import {
// } from '../config/Common';

export default class LoadingViewText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            width: new Animated.Value(0),
            height: new Animated.Value(0),
        }
    }

    render() {
        //隐藏
        if (this.props.hidden == true) {
            Animated.sequence([
                Animated.timing(
                    this.state.opacity,
                    {
                        toValue: 0,
                        duration: 300,
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
        }
        //显示
        else {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(
                        this.state.width,
                        {
                            toValue: this.props.width ? this.props.width : Dimensions.get('window').width,
                            duration: 1,
                        },
                    ),
                    Animated.timing(
                        this.state.height,
                        {
                            toValue: this.props.height ? this.props.height : Dimensions.get('window').height - 64,
                            duration: 1,
                        },
                    ),
                ]),
                Animated.timing(
                    this.state.opacity,
                    {
                        toValue: 1,
                        duration: 0,
                    },
                ),
            ]).start();
        }

        return (
            <Animated.View style={[styles.container, {
                backgroundColor: global.colors.whiteColor,
                top: this.props.top ? this.props.top : 0,
                bottom: this.props.bottom ? this.props.bottom : 0,
                left: this.props.left ? this.props.left : 0,
                right: this.props.right ? this.props.right : 0,
                width: this.state.width,
                height: this.state.height,
                opacity: this.state.opacity,
            }]}>
                <TouchableWithoutFeedback onPress={this.props.onPress} >
                    <View>
                        <Text style={styles.text}>{this.props.text}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </Animated.View >
        )
    }
}

var styles = {
    get container() {
        return {
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
        }
    },
    get text() {
        return {
            color: global.colors.gray1Color,
            fontSize: global.configures.fontSize17,
        }
    },
}
