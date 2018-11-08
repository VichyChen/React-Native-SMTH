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

// import {
// } from '../config/Common';

export default class LoadingViewText extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress} >
                <View style={[styles.container, { backgroundColor: global.colors.whiteColor }]}>
                    <Text style={styles.text}>{111}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
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
    get text() {
        return {
            color: global.colors.gray1Color,
            fontSize: global.configures.fontSize17,
        }
    },
}
