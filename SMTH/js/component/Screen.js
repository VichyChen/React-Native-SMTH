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

export default class Screen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View style={[styles.background, {
                backgroundColor: (this.props.backgroundColor != null ? this.props.backgroundColor : global.colors.whiteColor),
            }]}
            >
                <View>
                    {this.props.children}
                    <LoadingView hidden={!this.props.showLoading} type={this.props.loadingType} />
                    <LoadingViewText text={this.props.text} hidden={this.props.text == null ? true : false} onPress={() => {
                        if (this.props.onPress == null || this.props.showLoading == true) return;
                        this.props.onPress();
                    }} />
                </View>
            </View>

        )
    }
}

var styles = {
    get background() {

    },
}
