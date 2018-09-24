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
    NewUserArticleScreen,
    NewUserMemberScreen,
    NewUserFriendsScreen,
    NewUserfansScreen,
    TabPageView
} from '../config/Common';
import AsyncStorageManger from '../storage/AsyncStorageManger';

export default class NewUserScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataArray: [],
            screenText: null
        }

        NetworkManager.net_QueryUser(this.props.navigation.state.params.name, (result) => {
            this.setState({
                isLoading: false,
                id: result['user'].id,
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
            });
        }, (error) => {
            this.setState({
                screenText: error,
            });
        }, (errorMessage) => {
            this.setState({
                screenText: errorMessage,
            });
        });

        this.setTitle();
    }

    componentDidMount() {
        this.setBarItemButton();
    }

    setBarItemButton() {
        this.props.navigation.setParams({
            headerRight: (
                <NavigatorTitleButton
                    color={global.colors.whiteColor}
                    fontSize={16}
                    onPressClick={() => {
                        this.props.navigation.navigate('sendMessageScreen', {
                            user: this.props.navigation.state.params.name,
                            title: '',
                            content: '',
                        });
                    }}
                    title='发送短信' />
            )
        })
    }

    async setTitle() {
        var username = await AsyncStorageManger.getUsername();

        this.props.navigation.setParams({
            title: username == this.props.navigation.state.params.name ? '个人信息' : '详细资料'
        })
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
                            <Text style={styles.headerRightMeta}>{this.state.id == this.state.nick ? '未设置昵称' : this.state.nick}</Text>
                        </View>
                        <View>
                            <CellBackground
                                                                        showSelect={false}
                                onPress={() => {

                                }}
                            >
                                <View style={styles.buttonView} >
                                    <Text style={styles.buttonViewTitle} >私信</Text>
                                </View>
                            </CellBackground>
                            <CellBackground
                                                                        showSelect={false}
                                onPress={() => {

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
                    titles={['文章', '版面', '关注', '粉丝']}
                    pages={[
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
            fontSize: global.configures.fontSize18,
            fontWeight: 'bold',
            color: global.colors.fontColor,
        }
    },
    get headerRightMeta() {
        return {
            marginTop: 5,
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