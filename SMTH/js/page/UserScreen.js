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
    ReactNavigation
} from '../config/Common';
import AsyncStorageManger from '../storage/AsyncStorageManger';

export default class UserScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.title ? navigation.state.params.title : '详细资料',
        headerRight: navigation.state.params ? navigation.state.params.headerRight : null
    });

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataArray: [],
            screenText: null
        }

        NetworkManager.net_QueryUser(this.props.navigation.state.params.id, (result) => {
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
                        ReactNavigation.navigate(this.props.navigation, 'sendMessageScreen', {
                            user: this.props.navigation.state.params.id,
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
            title: username == this.props.navigation.state.params.id ? '个人信息' : '详细资料'
        })
    }

    render() {
        return (
            <Screen showLoading={this.state.isLoading} loadingType={'background'} text={this.state.screenText}>
                <ScrollView style={{ height: Dimensions.get('window').height - 64, backgroundColor: global.colors.backgroundGrayColor }}>

                    <SectionBlankHeader />

                    <View style={{ flexDirection: 'row', padding: 13, height: 80, backgroundColor: global.colors.whiteColor }}>
                        <AvatorImage style={{ marginLeft: 13, }}
                            widthAndHeight={60}
                            uri={NetworkManager.net_getFace(this.props.navigation.state.params.id)} />
                        <View style={{ marginLeft: 13 }}>
                            <Text style={styles.name}>{this.state.id}</Text>
                            <Text style={styles.nick}>{'昵称：' + this.state.nick}</Text>
                        </View>
                    </View>

                    <SectionBlankHeader />

                    <TitleValueItem title={'性别'} value={this.state.gender == 0 ? '男生' : '女生'} />
                    <SeperatorLine />
                    <TitleValueItem title={'年龄'} value={this.state.age + '岁'} />
                    <SeperatorLine />
                    <TitleValueItem title={'论坛身份'} value={this.state.title} />
                    <SeperatorLine />
                    <TitleValueItem title={'帖子总数'} value={this.state.posts + '篇'} />
                    <SeperatorLine />
                    <TitleValueItem title={'登陆次数'} value={this.state.logins} />
                    <SeperatorLine />
                    <TitleValueItem title={'论坛等级'} value={this.state.level} />
                    <SeperatorLine />
                    <TitleValueItem title={'用户积分'} value={this.state.score} />
                    <SeperatorLine />
                    <TitleValueItem title={'首次登陆'} value={DateUtil.formatTimeStamp(this.state.first_login)} />
                    <SeperatorLine />
                    <TitleValueItem title={'上次登录'} value={DateUtil.formatTimeStamp(this.state.last_login)} />

                    <SectionBlankHeader />

                    <TitleArrowItem
                        title={this.props.navigation.state.params.id + ' 的图片主题'}
                        onPress={() => {
                            ReactNavigation.navigate(this.props.navigation, 'userImageThreadScreen', { id: this.props.navigation.state.params.id })
                            // ReactNavigation.navigate(this.props.navigation, 'userImageThreadScreen', { id: 'IDjiangyou' })
                        }}
                    />
                    <SeperatorLine />
                    <TitleArrowItem
                        title={this.props.navigation.state.params.id + ' 的主题'}
                        onPress={() => {
                            ReactNavigation.navigate(this.props.navigation, 'userThreadScreen', { id: this.props.navigation.state.params.id })
                        }}
                    />

                    <SectionBlankHeader />

                </ScrollView>
            </Screen>
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
            flexDirection: 'column',
            backgroundColor: global.colors.whiteColor
        }
    },
    get content() {
        return {
            flexDirection: 'column',
            paddingLeft: 34,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 44,
        }
    },
    get arrow() {
        return {
            marginRight: 13,
            width: 10,
            height: 17,
        }
    },
}