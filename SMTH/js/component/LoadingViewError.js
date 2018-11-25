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

export default class LoadingViewError extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress} >
                <View style={styles.container}>
                    <Image style={[{
                        marginTop: -40,
                        width: global.constants.ScreenWidth / 3,
                        height: global.constants.ScreenWidth / 3,
                        tintColor: global.colors.backgroundGrayColor,
                    }]}
                        source={global.images.icon_error} />
                    <Text style={{ marginTop: 10, color: global.colors.gray1Color, fontSize: global.fontSize.fontSize17 }}>
                        {'出错啦'}
                    </Text>
                    <Text style={{ marginTop: 10, color: global.colors.gray2Color, fontSize: global.fontSize.fontSize15 }}>
                        {this.props.text}
                    </Text>
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
