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
    Dimensions
} from 'react-native';

import {
    NetworkManager,
    SectionBlankHeader,
    AvatorImage,
    TitleValueItem,
    TitleArrowItem,
    SeperatorLine,
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
    ToastUtil
} from '../config/Common';
import AsyncStorageManger from '../storage/AsyncStorageManger';

export default class NewUserScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nick: '',
            isLoading: true,
            dataArray: [],
            screenText: null
        }
    }

    render() {
        return (
            <View style={styles.container} >
                <NavigationBar
                    navigation={this.props.navigation}
                    showBackButton={true}
                    showBottomLine={false}
                />
                <View style={styles.header} >
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
                                    this.props.navigation.navigate('newMessageSendScreen', { user: this.props.navigation.state.params.name })
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
                                        ToastUtil.info(error);
                                    }, (errorMessage) => {

                                    });

                                }}
                            >
                                <View style={[styles.buttonView, { marginTop: 10 }]} >
                                    <Text style={styles.buttonViewTitle} >关注</Text>
                                </View>
                            </CellBackground>

                        </View>
                    </View>
                </View>
                <TabPageView
                    style={{}}
                    titles={['资料', '文章', '版面', '关注', '粉丝']}
                    pages={[
                        (<NewUserInfoScreen
                            navigation={this.props.navigation}
                            id={this.props.navigation.state.params.id}
                            callback={(nick) => {
                                this.setState({
                                    nick: nick,
                                });
                            }}
                        />),
                        (<NewUserArticleScreen navigation={this.props.navigation} id={this.props.navigation.state.params.id} />),
                        (<NewUserMemberScreen navigation={this.props.navigation} id={this.props.navigation.state.params.id} />),
                        (<NewUserFriendsScreen navigation={this.props.navigation} id={this.props.navigation.state.params.id} />),
                        (<NewUserfansScreen navigation={this.props.navigation} id={this.props.navigation.state.params.id} />),
                    ]} />
            </View>
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
            height: 100,
            padding: global.constants.Padding + 5,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
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
            fontWeight: 'bold',
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
            height: 30,
            width: 60,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: global.colors.whiteColor,
            borderColor: global.colors.gray1Color,
            borderWidth: 1,
            borderRadius: 4,
        }
    },
    get buttonViewTitle() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.gray1Color,
        }
    },
}