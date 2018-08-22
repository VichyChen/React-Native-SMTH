import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableWithoutFeedback,
    TouchableHighlight
} from 'react-native';


export default class NavigatorTitleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            press: false,
        }
    }

    render() {
        return (
            <TouchableHighlight
                style={[styles.container]}
                underlayColor={global.colors.clearColor}
                onHideUnderlay={() => this.setState({ press: false })}
                onShowUnderlay={() => this.setState({ press: true })}
                onPress={this.props.onPressClick}
            >
                <View>
                    <Text style={[styles.text, {
                        color: this.state.press == false ? this.props.color == null ? global.colors.blueColor : this.props.color : global.colors.gray2Color,
                        fontSize: this.props.fontSize == null ? global.configures.fontSize17 : this.props.fontSize,
                    }]}>
                        {this.props.title}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
}

var styles = {
    get container() {
        return {
            backgroundColor: global.colors.clearColor,
            justifyContent: 'center',
            alignItems: 'center',
            height: 44,
            width: 44,
        }
    },
    get text() {
        return {
        }
    },
}
