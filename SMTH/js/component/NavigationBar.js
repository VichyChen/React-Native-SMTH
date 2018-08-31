import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    ImageButton,
} from '../config/Common';

export default class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backButtonPress: false,
        }
    }

    render() {
        return (
            <View style={styles.container} >

                <View style={styles.status} ></View>

                <View style={styles.navigation} >

                    {/* <ImageButton
                        style={styles.backButton}
                        color={global.colors.fontColor}
                        width={44}
                        height={44}
                        margin={10}
                        source={global.images.ic_return_b_90x90}
                        onPress={() => {

                        }} /> */}

                    <Text style={styles.title} >
                        {this.props.title}
                    </Text>

                    {/* <ImageButton
                        style={styles.rightButton1}
                        color={global.colors.fontColor}
                        width={44}
                        height={44}
                        margin={20}
                        source={global.images.icon_search}
                        onPress={() => {

                        }} /> */}

                </View>
            </View>
        )
    }
}

var styles = {
    get container() {
        return {
            backgroundColor: global.colors.whiteColor,
            height: global.constants.NavigationBarHeight
        }
    },
    get status() {
        return {
            height: global.constants.StatusBarHeight
        }
    },
    get navigation() {
        return {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        }
    },
    get backButton() {
        return {
            marginLeft: 10,
            width: 44,
            height: 44,
        }
    },
    get title() {
        return {
            fontSize: 17,
            color: global.colors.fontColor,
        }
    },
    get rightButton1() {
        return {
            marginRight: 10,
            width: 44,
            height: 44,
        }
    },
    get rightButton2() {
        return {
            marginLeft: 10,
            width: 44,
            height: 44,
        }
    },
    
}
