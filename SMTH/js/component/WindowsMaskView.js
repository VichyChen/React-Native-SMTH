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
    Dimensions,
    Modal
} from 'react-native';

import {
    BackgroundMaskView
} from '../config/Common';

export default class WindowsMaskView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.props.visible}
            >
                <BackgroundMaskView
                    height={Dimensions.get('window').height}
                    onPress={this.props.onPress}
                    hidden={false}
                />
            </Modal>
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
