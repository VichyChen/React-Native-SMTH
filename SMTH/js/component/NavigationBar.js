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
    Button
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
            <View style={[
                styles.container,
                { backgroundColor: this.props.backgroundColor != null ? this.props.backgroundColor : global.colors.whiteColor }
            ]} >
                <View style={styles.status} ></View>

                <View style={styles.navigation} >

                    {
                        this.props.showBackButton == true
                            ?
                            <ImageButton
                                style={styles.backButton}
                                color={global.colors.fontColor}
                                width={44}
                                height={44}
                                margin={12}
                                source={global.images.ic_return_b_90x90}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }} />
                            :
                            null
                    }

                    {
                        this.props.showCancelButton == true
                            ?
                            <Button
                                style={styles.cancelButton}
                                height={44}
                                text={'取消'}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }} />
                            :
                            null
                    }

                    {
                        this.props.title != null
                            ?
                            <Text style={[
                                styles.title,
                                { color: this.props.titleColor != null ? this.props.titleColor : global.colors.fontColor }
                            ]}
                                onPress={this.props.titleOnPress}
                            >
                                {this.props.title}
                            </Text>
                            :
                            null
                    }

                    {
                        this.props.rightButtonImage != null
                            ?
                            <ImageButton
                                style={styles.rightButton}
                                color={global.colors.fontColor}
                                width={44}
                                height={44}
                                margin={12}
                                source={this.props.rightButtonImage}
                                onPress={() => {
                                    if (this.props.rightButtonOnPress != null) {
                                        this.props.rightButtonOnPress();
                                    }
                                }} />
                            :
                            null
                    }

                    {
                        this.props.rightButtonTitle != null
                            ?
                            <Button
                                style={styles.rightTitleButton}
                                height={44}
                                text={this.props.rightButtonTitle}
                                onPress={() => {
                                    if (this.props.rightButtonOnPress != null) {
                                        this.props.rightButtonOnPress();
                                    }
                                }} />
                            :
                            null
                    }

                    {
                        this.props.showBottomLine == true || this.props.showBottomLine == null
                            ?
                            <View style={styles.bottomLine} />
                            :
                            null
                    }
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
            // backgroundColor: 'green',
        }
    },
    get bottomLine() {
        return {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 1,
            backgroundColor: global.colors.seperatorColor,
        }
    },
    get backButton() {
        return {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 44,
        }
    },
    get cancelButton() {
        return {
            position: 'absolute',
            left: 10,
            top: 0,
            bottom: 0,
            width: 44,
        }
    },
    get title() {
        return {
            fontSize: 18,
            color: global.colors.fontColor,
        }
    },
    get rightButton() {
        return {
            position: 'absolute',
            right: 5,
            top: 0,
            bottom: 0,
            width: 44,
        }
    },
    get rightButton2() {
        return {
            marginLeft: 10,
            width: 44,
            height: 44,
        }
    },
    get rightTitleButton() {
        return {
            position: 'absolute',
            right: 10,
            top: 0,
            bottom: 0,
            width: 44,
        }
    },
}
