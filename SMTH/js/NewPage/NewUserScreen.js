import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    TextInput,
    ScrollView,
    ListView,
    View,
    Navigator,
    FlatList,
    SectionList,
    TouchableWithoutFeedback,
    Dimensions,
    StatusBar,
    DeviceEventEmitter
} from 'react-native';

import {
    NetworkManager,
    HTMLParseManager,
    SectionBlankHeader,
    AvatorImage,
    TitleValueItem,
    TitleArrowItem,
    SeperatorLine,
    HorizontalSeperatorLine,
    DateUtil,
    LoadingView,
    Screen,
    NavigatorTitleButton,
    CellBackground,
    NavigationBar,
    NewUserInfoScreen,
    NewUserArticleScreen,
    NewUserMemberScreen,
    NewUserFriendsScreen,
    NewUserfansScreen,
    TabPageView,
    ToastUtil,
    ReactNavigation
} from '../config/Common';
import AsyncStorageManger from '../storage/AsyncStorageManger';
import { NativeModules } from 'react-native';

export default class NewUserScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.navigation.state.params.id,
            nick: '',
            isLoading: true,
            dataArray: [],
            screenText: null
        }

        this.queryUser();
        if (this.props.navigation.state.params.id == null) {
            NetworkManager.getNewSearchAccount(this.props.navigation.state.params.name, 1, (html) => {
                HTMLParseManager.parseNewSearchAccount(html, this.props.navigation.state.params.name, (id) => {
                    this.setState({
                        id: id
                    });
                });
            }, (error) => {

            }, (errorMessage) => {

            });
        }
    }

    queryUser() {
        NetworkManager.net_QueryUser(this.props.navigation.state.params.name, (result) => {
            this.setState({
                isLoading: false,
                nick: result['user'].nick,
                uid: result['user'].uid,
                gender: result['user'].gender,
                title: result['user'].title,
                posts: result['user'].posts,
                logins: result['user'].logins,
                level: result['user'].level,
                score: result['user'].score,
                first_login: result['user'].first_login,
                last_login: result['user'].last_login,
                age: result['user'].age,
                life: result['user'].life,
            });
        }, (error) => {

        }, (errorMessage) => {

        });
    }

    render() {
        return (
            <View style={styles.container} >
                <StatusBar barStyle="light-content" />
                <NavigationBar
                    navigation={this.props.navigation}
                    backgroundColor={global.colors.themeColor}
                    showBackButton={true}
                    backButtonTintColor={global.colors.whiteColor}
                    showBottomLine={false}
                    rightButtonImage={global.images.icon_share}
                    rightButtonTintColor={global.colors.whiteColor}
                    rightButtonImageMargin={28}
                    rightButtonOnPress={() => {
                        if (this.props.navigation.state.params.id != null || this.state.id != null) {
                            var shareManager = NativeModules.ShareManager;
                            shareManager.share(this.props.navigation.state.params.name + ' - 水木社区', 'https://exp.newsmth.net/account/' + this.props.navigation.state.params.id != null ? this.props.navigation.state.params.id : this.state.id);
                        }
                    }}
                />

                <CellBackground
                    style={{ position: 'absolute', top: global.constants.NavigationBarHeight - 35, right: 110 }}
                    showSelect={false}
                    onPress={() => {
                        if (global.login == true) {
                            ReactNavigation.navigate(this.props.navigation, 'newMessageSendScreen', { user: this.props.navigation.state.params.name })
                        }
                        else {
                            StatusBar.setBarStyle('dark-content');
                            DeviceEventEmitter.emit('LoginNotification', () => { StatusBar.setBarStyle('light-content'); });
                        }
                    }}
                >
                    <View style={[styles.buttonView, {}]} >
                        <Text style={styles.buttonViewTitle} >私信</Text>
                    </View>
                </CellBackground>
                <CellBackground
                    style={{ position: 'absolute', top: global.constants.NavigationBarHeight - 35, right: 50 }}
                    showSelect={false}
                    onPress={() => {
                        if (global.login == true) {
                            NetworkManager.net_AddUserFriend(this.props.navigation.state.params.name, (result) => {
                                ToastUtil.info("关注成功");
                            }, (error) => {
                                ToastUtil.info(error.message);
                            }, (errorMessage) => {

                            });
                        }
                        else {
                            StatusBar.setBarStyle('dark-content');
                            DeviceEventEmitter.emit('LoginNotification', () => { StatusBar.setBarStyle('light-content'); });
                        }
                    }}
                >
                    <View style={[styles.buttonView, {}]} >
                        <Text style={styles.buttonViewTitle} >关注</Text>
                    </View>
                </CellBackground>

                <View style={styles.header} >

                    <View style={{
                        height: 64,
                        width: global.constants.ScreenWidth - 40,
                        marginBottom: 10,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }} >
                        <AvatorImage
                            borderRadius={30}
                            widthAndHeight={60}
                            uri={NetworkManager.net_getFace(this.props.navigation.state.params.name)} />

                        <View style={{
                            flex: 1,
                            marginLeft: 10,
                        }} >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontSize: global.configures.fontSize20,
                                    fontWeight: '600',
                                    color: global.colors.whiteColor
                                }}>
                                    {this.props.navigation.state.params.name}
                                </Text>
                            </View>

                            <Text style={[styles.nick, { marginTop: 10 }]} >
                                {this.props.navigation.state.params.name == this.state.nick ? '未设置昵称' : this.state.nick}
                            </Text>

                        </View>

                    </View>
                    <HorizontalSeperatorLine />

                    <View style={[styles.userInfoView, { marginTop: 10, height: 40 }]} >
                        <Text style={[styles.userInfoSmallText]} >{'身份 '}</Text>
                        <Text style={[styles.userInfoBigText]} >
                            {global.login == true && this.state.title != null ? this.state.title : '无'}
                        </Text>
                        <Text style={[styles.userInfoSmallText]} >{'  |  '}</Text>
                        <Text style={[styles.userInfoSmallText]} >{'积分 '}</Text>
                        <Text style={[styles.userInfoBigText]} >
                            {global.login == true && this.state.score != null ? this.state.score : '0'}
                        </Text>
                        <Text style={[styles.userInfoSmallText]} >{'  |  '}</Text>
                        <Text style={[styles.userInfoSmallText]} >{'等级 '}</Text>
                        <Text style={[styles.userInfoBigText]} >
                            {global.login == true && this.state.life != null ? this.state.life + '(' + this.state.level + ')' : '无'}
                        </Text>
                    </View>

                    <View style={[styles.userInfoView, { marginTop: 5, marginBottom: 20 }]} >
                        <Text style={[styles.userInfoSmallText, styles.nick]} >
                            {
                                '上次登录 ' +
                                (global.login == true && this.state.last_login != null ? DateUtil.formatTimeStamp(this.state.last_login) : '无') +
                                '  |  注册于 ' +
                                (global.login == true && this.state.first_login != null ? DateUtil.formatTimeStamp(this.state.first_login) : '无')
                            }
                        </Text>
                    </View>

                    {/*
                    <AvatorImage
                        style={styles.avator}
                        borderRadius={35}
                        widthAndHeight={70}
                        onPressClick={() => { }}
                        uri={NetworkManager.net_getFace(this.props.navigation.state.params.name)} />
                    <View style={styles.headerRight} >
                        <View>
                            <Text style={styles.headerRightName}>{this.props.navigation.state.params.name}</Text>
                            <Text style={styles.headerRightMeta}>{this.props.navigation.state.params.name == this.state.nick ? '未设置昵称' : this.state.nick}</Text>
                        </View>
                        <View>
                            <CellBackground
                                showSelect={false}
                                onPress={() => {
                                    ReactNavigation.navigate(this.props.navigation, 'newMessageSendScreen', { user: this.props.navigation.state.params.name })
                                }}
                            >
                                <View style={styles.buttonView} >
                                    <Text style={styles.buttonViewTitle} >私信</Text>
                                </View>
                            </CellBackground>
                            <CellBackground
                                showSelect={false}
                                onPress={() => {
                                    NetworkManager.net_AddUserFriend(this.props.navigation.state.params.name, (result) => {
                                        ToastUtil.info("关注成功");
                                    }, (error) => {
                                        ToastUtil.info(error.message);
                                    }, (errorMessage) => {

                                    });

                                }}
                            >
                                <View style={[styles.buttonView, { marginTop: 10 }]} >
                                    <Text style={styles.buttonViewTitle} >关注</Text>
                                </View>
                            </CellBackground>

                        </View>
                        */}
                </View>
                <TabPageView
                    style={{}}
                    titles={[/*'资料', */'文章', '版面', '关注', '粉丝']}
                    pages={
                        this.state.id == null ? [] :
                            [
                                // (<NewUserInfoScreen
                                //     navigation={this.props.navigation}
                                //     id={this.props.navigation.state.params.id}
                                //     callback={(nick) => {
                                //         this.setState({
                                //             nick: nick,
                                //         });
                                //     }}
                                // />),
                                (<NewUserArticleScreen navigation={this.props.navigation} id={this.state.id} name={this.props.navigation.state.params.name} />),
                                (<NewUserMemberScreen navigation={this.props.navigation} id={this.state.id} name={this.props.navigation.state.params.name} />),
                                (<NewUserFriendsScreen navigation={this.props.navigation} id={this.state.id} name={this.props.navigation.state.params.name} />),
                                (<NewUserfansScreen navigation={this.props.navigation} id={this.state.id} name={this.props.navigation.state.params.name} />),
                            ]
                    } />
            </View >
        )
    }
}

var styles = {
    get name() {
        return {
            fontSize: global.configures.fontSize18,
            color: global.colors.fontColor,
            marginTop: 5,
        }
    },
    get nick() {
        return {
            fontSize: global.configures.fontSize16,
            color: global.colors.gray1Color,
            marginTop: 12,
        }
    },
    get container() {
        return {
            flex: 1,
            backgroundColor: global.colors.whiteColor
        }
    },
    get header() {
        return {
            height: 165,
            flexDirection: 'column',
            paddingHorizontal: global.constants.Padding,
            // justifyContent: 'flex-start',
            backgroundColor: global.colors.themeColor,
        }
    },
    get name() {
        return {
            marginLeft: 10,
            fontSize: global.configures.fontSize20,
            fontWeight: '600',
            color: global.colors.whiteColor
        }
    },
    get nick() {
        return {
            fontSize: global.configures.fontSize12,
            color: global.colors.whiteColor,
        }
    },
    get headerRight() {
        return {
            paddingLeft: global.constants.Padding,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        }
    },
    get headerRightName() {
        return {
            marginTop: 5,
            fontSize: global.configures.fontSize19,
            fontWeight: '600',
            color: global.colors.fontColor,
        }
    },
    get headerRightMeta() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize16,
            color: global.colors.gray2Color,
        }
    },
    get avator() {
        return {
            // marginLeft: global.constants.Margin,
        }
    },
    get buttonView() {
        return {
            height: 25,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: global.colors.clearColor,
            borderColor: global.colors.whiteColor,
            borderWidth: 1,
            borderRadius: 4,
        }
    },
    get buttonViewTitle() {
        return {
            fontSize: global.configures.fontSize14,
            color: global.colors.whiteColor,
        }
    },
    get userInfoView() {
        return {
            width: global.constants.ScreenWidth - 40,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
        }
    },
    get userInfoSmallText() {
        return {
            fontSize: global.configures.fontSize10,
            color: global.colors.whiteColor,
            marginBottom: -4,
        }
    },
    get userInfoBigText() {
        return {
            fontSize: global.configures.fontSize18,
            color: global.colors.whiteColor
        }
    },
}