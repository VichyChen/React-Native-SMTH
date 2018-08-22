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

export default class ToastView extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}> 1231231312321212</Text>
            </View>
        )
    }
}


var styles = {
    get container() {
        return {
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            position: 'absolute',
            // marginTop: 20,
            // marginBottom: 20,
            // marginLeft: 20,
            // marginRight: 20,
        }
    },
    get text() {
        return {
            textAlign: 'center',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor: global.colors.blueColor
            // alignItems: 'center',
            // position: 'absolute',        
        }
    },
}