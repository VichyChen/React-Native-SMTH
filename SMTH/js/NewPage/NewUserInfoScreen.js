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
    AvatorImage,
    SeperatorLine,
    HorizontalSeperatorLine,
    LoadingView,
    Screen,
    CellBackground,
    NavigationBar,
    SectionBlankHeader,
    TitleValueItem,
    TitleArrowItem,
    DateUtil
} from '../config/Common';
import cio from 'cheerio-without-node-native';

export default class NewUserInfoScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewLoading: false,
            screenText: null,
        }

        this.getQueryUser();
    }

    getQueryUser() {
        NetworkManager.net_QueryUser(this.props.navigation.state.params.name, (result) => {
            this.setState({
                id: result['user'].id,
                nick: result['user'].nick,
                uid: result['user'].uid,
                gender: result['user'].gender,
                title: result['user'].title,
                posts: result['user'].posts,
                logins: result['user'].logins,
                level: result['user'].level,
                life: result['user'].life,
                score: result['user'].score,
                first_login: result['user'].first_login,
                last_login: result['user'].last_login,
                age: result['user'].age,
            });

            this.props.callback(result['user'].nick);

        }, (error) => {
            this.setState({
                screenText: error,
            });
        }, (errorMessage) => {
            this.setState({
                screenText: errorMessage,
            });
        });
    }

    render() {
        if (this.state.id == null) {
            return (null);
        }

        return (
            <Screen showLoading={this.state.viewLoading} loadingType={'background'} text={this.state.screenText}>
                <ScrollView style={styles.scrollView}>

                    {/* {
                        this.props.navigation.state.params.name != this.state.nick
                            ?
                            <Text style={styles.titleText}>{'昵称：' + (this.state.nick)}</Text>
                            :
                            null
                    } */}

                    <Text style={styles.titleText}>{'性别：' + (this.state.gender == 0 ? '男生' : '女生')}</Text>

                    {
                        this.state.age != 0
                            ?
                            <Text style={styles.titleText}>{'年龄：' + this.state.age + '岁'}</Text>
                            :
                            null
                    }
                    <View style={{ marginBottom: global.constants.Margin }} />
                    <HorizontalSeperatorLine />

                    <Text style={styles.titleText}>{'论坛身份：' + this.state.title}</Text>
                    <Text style={styles.titleText}>{'帖子总数：' + this.state.posts + '篇'}</Text>
                    <Text style={styles.titleText}>{'登陆次数：' + this.state.logins}</Text>
                    <Text style={styles.titleText}>{'论坛等级：' + this.state.life + '(' + this.state.level + ')'}</Text>
                    <Text style={styles.titleText}>{'用户积分：' + this.state.score}</Text>
                    <Text style={styles.titleText}>{'首次登陆：' + DateUtil.formatTimeStamp(this.state.first_login)}</Text>
                    <Text style={styles.titleText}>{'上次登录：' + DateUtil.formatTimeStamp(this.state.last_login)}</Text>
                    <View style={{ marginBottom: global.constants.Margin }} />
                    <HorizontalSeperatorLine />

                </ScrollView>
            </Screen>
        )
    }
}

var styles = {
    get scrollView() {
        return {
            paddingTop: 5,
            paddingHorizontal: global.constants.Padding,
            height: Dimensions.get('window').height - 64,
            backgroundColor: global.colors.whiteColor
        }
    },
    get titleText() {
        return {
            marginTop: global.constants.Margin,
            fontSize: global.configures.fontSize16,
            color: global.colors.fontColor,
        }
    },
    get content() {
        return {
            flexDirection: 'row',
            alignItems: 'center',
            height: 44,
            backgroundColor: global.colors.whiteColor
        }
    },
    get deleteButton() {
        return {
            marginLeft: 0,
            marginRight: -13
        }
    },
    get board() {
        return {
            marginLeft: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            backgroundColor: global.colors.whiteColor,
        }
    },
    get arrow() {
        return {
            position: 'absolute',
            top: 13,
            right: 13,
            width: 10,
            height: 17,
        }
    },
    get rightView() {
        return {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingLeft: 15,
            paddingTop: 5,
            paddingBottom: 15,
        }
    },
    get rightItemContainer() {
        return {
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
            marginTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: global.colors.whiteColor,
            borderColor: '#EBEBEB',
            borderWidth: 1,
            borderRadius: 4,
        }
    },
    get rightItemTitle() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.gray1Color,
        }
    },
    get sectionView() {
        return {
            height: 30, flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -global.constants.Padding,
            paddingLeft: global.constants.Padding
        }
    },
    get sectionVerticalLine() {
        return {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: global.colors.themeColor,
        }
    },
    get sectionTitle() {
        return {
            fontSize: global.configures.fontSize16,
            fontWeight: '600',
            color: global.colors.fontColor
        }
    },
}