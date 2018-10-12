import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
    DeviceEventEmitter
} from 'react-native';


import {
    Button
} from '../config/Common';

export default class LoginButtonView extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <View style={[this.props.style]}>
                <View style={styles.container}>
                    <Button
                        onPress={() => {
                            DeviceEventEmitter.emit('LoginNotification', null);
                        }}
                        text={'登陆'}
                    />
                </View>
            </View >
        )
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: global.colors.whiteColor,
        }
    },
    get text() {
        return {
            color: global.colors.gray1Color,
            fontSize: global.configures.fontSize17,
        }
    },
}
