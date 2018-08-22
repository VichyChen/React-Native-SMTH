import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    TextInput,
    ScrollView,
    View,
    TouchableWithoutFeedback,
    Modal,
    Dimensions,
    Linking,
    DeviceEventEmitter,
    ActivityIndicator
} from 'react-native';

import {
    NetworkManager,
    ImageButton,
    Button,
    ToastUtil,
    HorizontalSeperatorLine,
    Screen
} from '../config/Common';
import AsyncStorageManger from '../storage/AsyncStorageManger';

var _username;
var _password;

export default class LoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            loadingType: 'clear',
            username: '',
            password: '',
        }

        this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
            this.setState({});
        });

        this.getUsername();
        this.getPassword();
    }

    componentWillUnmount() {
        this.refreshViewNotification.remove();
    }

    async getUsername() {
        _username = await AsyncStorageManger.getUsername();
        this.setState({
            username: _username,
        });
    }

    async getPassword() {
        _password = await AsyncStorageManger.getPassword();
        this.setState({
            password: _password,
        });
    }

    render() {
        return (
            <Modal
                animationType={"none"}
                transparent={false}
                visible={this.props.visible}
                onRequestClose={() => { alert("Modal has been closed.") }}
            >
                <ScrollView style={styles.scrollView} keyboardDismissMode={'on-drag'}>
                    <View style={styles.contain}>
                        <TextInput
                            style={styles.textInput}
                            underlineColorAndroid={'transparent'}
                            clearButtonMode={'while-editing'}
                            autoCorrect={false}
                            spellCheck={false}
                            autoCapitalize={'none'}
                            onChangeText={(text) => {
                                this.setState({
                                    username: text
                                });
                                _username = text;
                            }}
                            value={this.state.username}
                            placeholder={'账号'}
                        />
                        <HorizontalSeperatorLine />
                        <TextInput
                            style={styles.textInput}
                            secureTextEntry={true}
                            underlineColorAndroid={'transparent'}
                            clearButtonMode={'while-editing'}
                            autoCorrect={false}
                            spellCheck={false}
                            autoCapitalize={'none'}
                            onChangeText={(text) => {
                                this.setState({
                                    password: text
                                });
                                _password = text;
                            }}
                            value={this.state.password}
                            placeholder={'密码'}
                        />
                        <HorizontalSeperatorLine />
                        <Text style={styles.text}>{this.state.text}</Text>
                        <Button style={styles.login}
                            text={'登陆'}
                            fontColor={global.colors.whiteColor}
                            backgroundColor={global.colors.themeColor}
                            width={100}
                            height={40}
                            onPress={() => {
                                if (_username.length == 0 || _password.length == 0) return;

                                this.setState({
                                    isLoading: true,
                                    loadingType: 'clear',
                                    text: null
                                });
                                NetworkManager.login(_username, _password, () => {
                                    global.current.username = _username;
                                    DeviceEventEmitter.emit('LoginSuccessNotification', _username);
                                    this.props.success();
                                    this.setState({
                                        isLoading: false,
                                        loadingType: 'none',
                                        text: null
                                    });
                                }, (error) => {
                                    this.setState({
                                        isLoading: false,
                                        loadingType: 'none',
                                        text: error
                                    });
                                }, (errorMessage) => {
                                    this.setState({
                                        isLoading: false,
                                        loadingType: 'none',
                                        text: errorMessage
                                    });
                                });
                            }} />
                        <ActivityIndicator
                            animating={this.state.isLoading}
                            style={styles.indicator}
                            size="small"
                        />
                    </View>
                </ScrollView>
                <Button style={styles.regist}
                    text={'没账号？点这里注册'}
                    width={100}
                    height={40}
                    onPress={() => {
                        Linking.openURL('http://www.newsmth.net/nForum/#!reg');
                    }} />
            </Modal>
        )
    }
}

var styles = {
    get scrollView() {
        return {
            height: global.constants.SCREEN_HEIGHT,
        }
    },
    get contain() {
        return {
            marginTop: 100,
            marginLeft: 40,
            width: global.constants.SCREEN_WIDTH - 80,
        }
    },
    get textInput() {
        return {
            padding: 0,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            height: 40,
            fontSize: global.configures.fontSize17,
        }
    },
    get text() {
        return {
            marginTop: 20,
            marginBottom: 60,
            marginLeft: 40,
            marginRight: 40,
            height: 20,
            textAlign: 'center',
            color: global.colors.blueColor,
            fontSize: global.configures.fontSize17,
        }
    },
    get indicator() {
        return {
            marginTop: 20,
            height: 44,
        }
    },
    get login() {
        return {
            borderRadius: 5
        }
    },
    get regist() {
        return {
            position: 'absolute',
            bottom: 20,
            left: 40,
            right: 40,
        }
    },
}
