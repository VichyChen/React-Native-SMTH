import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';

import {
    LoadingView,
    LoadingViewText,
    ToastView,
} from '../config/Common';
import CellBackground from '../component/CellBackground'

global.screen = {
    none: 0,
    loading: 1,
    loadingClear: 2,
    text: 3,
    textImage: 4,
    networkError: 5,
};

export default class Screen extends Component {

    render() {
        return (
            <View style={[styles.background, {
                backgroundColor: (this.props.backgroundColor != null ? this.props.backgroundColor : global.colors.whiteColor),
            }]}
            >
                {this.props.children}
                {
                    this.props.status == global.screen.none ? null :
                        (
                            this.props.status == global.screen.none || this.props.status == global.screen.loading || this.props.status == global.screen.loadingClear
                                ?
                                <LoadingView hidden={this.props.status == global.screen.none ? true : false} clear={this.props.status == global.screen.loadingClear ? true : false} />
                                :
                                (
                                    this.props.status == global.screen.text || this.props.status == global.screen.textImage || this.props.status == global.screen.networkError ?
                                        <LoadingViewText text={this.props.text} onPress={() => {
                                            if (this.props.onPress == null ||
                                                (this.props.status == global.screen.loading || this.props.status == global.screen.loadingClear)) return;
                                            this.props.onPress();
                                        }} />
                                        :
                                        null
                                )
                        )
                }
            </View>
        )
    }
}

var styles = {
    get background() {
        return {
            flex: 1,
        }
    },
}
