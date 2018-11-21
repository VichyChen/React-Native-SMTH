import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';

export default class AvatorImage extends Component {
    render() {
        return (
            <TouchableWithoutFeedback
                style={{
                    backgroundColor: global.colors.whiteColor,
                    padding: 0,
                    height: this.props.widthAndHeight,
                    width: this.props.widthAndHeight,
                }}
                onPress={this.props.onPressClick} >
                <View>
                    <Image
                        style={{
                            margin: 0,
                            height: this.props.widthAndHeight,
                            width: this.props.widthAndHeight,
                            zIndex: 0,
                            borderRadius: this.props.borderRadius == null ? 0 : this.props.borderRadius,
                            borderWidth: 0.5,
                            borderColor: global.colors.gray4Color,
                        }}
                        source={global.images.face_default_m} />
                    {
                        this.props.uri == null ? null : (
                            <Image
                                style={{
                                    marginTop: -(this.props.widthAndHeight),
                                    height: this.props.widthAndHeight,
                                    width: this.props.widthAndHeight,
                                    zIndex: 1,
                                    borderRadius: this.props.borderRadius == null ? 0 : this.props.borderRadius,
                                    borderWidth: 0.5,
                                    borderColor: global.colors.gray4Color,
                                }}
                                source={{ uri: this.props.uri }} />
                        )
                    }
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

