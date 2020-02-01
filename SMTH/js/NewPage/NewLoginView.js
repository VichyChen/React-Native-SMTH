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
    ActivityIndicator,
    URL,
    StatusBar
} from 'react-native';

import {
    NetworkManager,
    HTMLParseManager,
    ImageButton,
    Button,
    ToastUtil,
    HorizontalSeperatorLine,
    Screen,
    NavigationBar
} from '../config/Common';
import AsyncStorageManger from '../storage/AsyncStorageManger';
import Cookie from 'react-native-cookie';

var _username = '';
var _password = '';
var _captcha = '';

export default class NewLoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            screenText: '',
            username: '',
            password: '',
            captcha: '',
        }

        this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
            this.setState({});
        });

        this.getUsername();
        this.getPassword();


        // NetworkManager.getNewAuthorize((result) => {

        //     this.refreshCaptcha();

        // }, (error) => {

        // }, (errorMessage) => {

        // });

    }

    // refreshCaptcha() {
    //     NetworkManager.getNewCaptcha((result1) => {

    //         this.setState({
    //             image: 'data:image/png;base64,' + result1
    //         });
    //     }, (error) => {

    //     }, (errorMessage) => {

    //     });
    // }

    login() {
        // if (_username.length == 0 || _password.length == 0 || _captcha.length == 0) {
        if (_username.length == 0 || _password.length == 0) {
            this.setState({
                screenText: '',
            })
            return
        };
        this.setState({
            isLoading: true,
        })


        NetworkManager.postNewSMTHLogin(_username, _password, 99999, (result) => {

            Cookie.get('http://www.newsmth.net')
                .then((res) => {
                    console.log('http://www.newsmth.net CookieManager.get =>', res); // => 'user_session=abcdefg; path=/;'
                });

            AsyncStorageManger.setLogin(true);
            global.login = true;
            global.current.username = _username;

            DeviceEventEmitter.emit('LoginSuccessNotification', result);
            if (this.props.closeCallback != null) {
                this.props.closeCallback();
            }

            this.setState({
                isLoading: false,
            })
        }, (error) => {
            this.setState({
                isLoading: false,
                screenText: error,
            })
            
        }, (errorMessage) => {
            this.setState({
                isLoading: false,
            })
        });
    }

    componentWillUnmount() {
        this.refreshViewNotification.remove();
    }

    async getUsername() {
        _username = await AsyncStorageManger.getUsername();
        console.log('1231231231' + _username);
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
                animationType={"slide"}
                transparent={false}
                visible={this.props.visible}
                onRequestClose={() => { alert("Modal has been closed.") }
                }
            >
                {/* <View> */}

                < NavigationBar
                    title={'天天水木'}
                    showCloseButton={true}
                    closeButtonOnPress={() => {
                        DeviceEventEmitter.emit('LoginCloseNotification', null);
                        if (this.props.closeCallback != null) {
                            this.props.closeCallback();
                        }
                    }}
                    showBottomLine={false}
                />

                <ScrollView style={styles.scrollView} keyboardDismissMode={'on-drag'}>

                    <Text style={styles.text} >{this.state.screenText}</Text>

                    <View style={styles.contain}>
                        <View style={[styles.textInputView, styles.textInputViewShadow]}>
                            <Image style={[styles.textInputLeftImage]} source={global.images.icon_login_account} />
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
                        </View>

                        <View style={[styles.textInputView, styles.textInputViewShadow, { marginTop: 20 }]}>
                            <Image style={[styles.textInputLeftImage]} source={global.images.icon_login_password} />
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
                        </View>
                        {/* <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: 20 }]}>
                            <View style={[styles.textInputView, styles.textInputViewShadow, { width: ((global.constants.ScreenWidth - 40) / 2) }]}>
                                <Image style={[styles.textInputLeftImage]} source={global.images.icon_login_captcha} />
                                <TextInput
                                    style={[styles.textInput, { width: ((global.constants.ScreenWidth - 40) / 2) }]}
                                    underlineColorAndroid={'transparent'}
                                    clearButtonMode={'while-editing'}
                                    autoCorrect={false}
                                    spellCheck={false}
                                    autoCapitalize={'none'}
                                    onChangeText={(text) => {
                                        this.setState({
                                            captcha: text
                                        });
                                        _captcha = text;
                                    }}
                                    value={this.state.captcha}
                                    placeholder={'验证码'}
                                />
                            </View>
                            <View style={[{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                width: ((global.constants.ScreenWidth - 40) / 2)
                            }]}>
                                <View style={[styles.textInputViewShadow]}>
                                    <Image style={[{ width: 100, height: 40, resizeMode: Image.resizeMode.contain, backgroundColor: global.colors.backgroundGrayColor }]}
                                        source={{ uri: this.state.image }} />
                                </View>
                            </View>

                        </View> */}

                        {
                            this.state.isLoading == true ?
                                (
                                    <View style={[styles.login, { flex: 1, flexDirection: 'row', justifyContent: 'center', height: 44 }]}>
                                        <ActivityIndicator animating={true} size="small" />
                                    </View>
                                )
                                :
                                (
                                    <Button style={styles.login}
                                        text={'登陆'}
                                        fontColor={global.colors.whiteColor}
                                        backgroundColor={global.colors.themeColor}
                                        width={100}
                                        height={44}
                                        onPress={() => { this.login(); }} />
                                )
                        }

                        <View style={[styles.textInputView, { marginTop: 20 }]}>
                            <Text style={styles.regist}
                                onPress={() => {
                                    Linking.openURL('http://www.newsmth.net/nForum/#!reg');
                                }} >
                                {'没账号？点击注册'}
                            </Text>
                        </View>

                    </View>
                </ScrollView>
                {/* </View> */}

            </Modal >
        )
    }
}

var styles = {
    get scrollView() {
        return {

        }
    },
    get contain() {
        return {
            marginTop: 100,
            marginLeft: 20,
            width: global.constants.ScreenWidth - 40,
            // backgroundColor: 'red',
        }
    },
    get textInputView() {
        return {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: 22,
        }
    },
    get textInputViewShadow() {
        return {
            shadowColor: global.colors.backgroundGrayColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 6,
        }
    },
    get textInputLeftImage() {
        return {
            marginLeft: 15,
            height: 16,
            width: 16,
            tintColor: global.colors.gray2Color,
        }
    },
    get textInput() {
        return {
            flex: 1,
            marginLeft: 10,
            marginRight: 10,
            height: 44,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get text() {
        return {
            position: 'absolute',
            top: 44,
            left: 0,
            right: 0,
            height: 20,
            textAlign: 'center',
            color: 'red',
            fontSize: global.configures.fontSize15,
        }
    },
    get login() {
        return {
            borderRadius: 22,
            marginTop: 40,
        }
    },
    get regist() {
        return {
            color: global.colors.themeColor,
            fontSize: global.fontSize.fontSize15,
        }
    },
}
