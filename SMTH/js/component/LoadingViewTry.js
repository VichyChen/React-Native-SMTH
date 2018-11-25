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
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native';

import {
    Button,
} from '../config/Common';

export default class LoadingViewTry extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={[{
                    marginTop: -40,
                    width: global.constants.ScreenWidth / 3,
                    height: global.constants.ScreenWidth / 3,
                    tintColor: global.colors.backgroundGrayColor,
                }]}
                    source={global.images.icon_error} />
                <Text style={{ marginTop: 10, color: global.colors.gray1Color, fontSize: global.fontSize.fontSize17 }}>
                    {'水木接口出问题啦'}
                </Text>
                <Text style={{ marginTop: 10, color: global.colors.gray2Color, fontSize: global.fontSize.fontSize15 }}>
                    {'点击重试，还不行的话请重新登录'}
                </Text>
                <View style={{ marginTop: 30, width: 200, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Button style={{ borderRadius: 4, width: 80 }}
                        text={'重试'}
                        fontColor={global.colors.whiteColor}
                        backgroundColor={global.colors.themeColor}
                        height={40}
                        onPress={this.props.onPress} />
                    <Button style={{ borderRadius: 4, width: 80 }}
                        text={'登陆'}
                        fontColor={global.colors.whiteColor}
                        backgroundColor={global.colors.themeColor}
                        height={40}
                        onPress={() => {
                            DeviceEventEmitter.emit('LoginNotification', null);
                        }} />
                </View>
            </View>
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
