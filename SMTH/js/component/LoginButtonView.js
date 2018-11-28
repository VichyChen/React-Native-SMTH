import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
    DeviceEventEmitter,
    Image
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
                    <Image style={[{
                        marginTop: -40, 
                        width: 130,
                        height: 130,
                    }]}
                        source={global.images.logo} />
                    <Text style={{ color: global.colors.gray2Color, fontSize: global.fontSize.fontSize17 }}>{this.props.text}</Text>
                    <Button style={{ marginTop: 40, width: 100, borderRadius: 20, }}
                        text={'去登陆'}
                        fontColor={global.colors.whiteColor}
                        backgroundColor={global.colors.themeColor}
                        height={40}
                        onPress={() => {
                            DeviceEventEmitter.emit('LoginNotification', null);
                        }}
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
