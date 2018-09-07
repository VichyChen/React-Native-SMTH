import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    TouchableHighlight
} from 'react-native';

export default class CellBackground extends Component {
    constructor(props) {
        super(props);
        this.state = {
            press: false,
        }
    }

    render() {
        return (
            <TouchableHighlight
                style={[(this.props.showSelect == false ? null : { backgroundColor: ((this.state.press == false ? global.colors.clearColor : global.colors.gray3Color)) })]}
                underlayColor={global.colors.clearColor}
                onHideUnderlay={() => { this.setState({ press: false }); }}
                onShowUnderlay={() => { this.setState({ press: true }); }}
                onPress={this.props.onPress}
            >
                {this.props.children}
            </TouchableHighlight>
        )
    }
}

