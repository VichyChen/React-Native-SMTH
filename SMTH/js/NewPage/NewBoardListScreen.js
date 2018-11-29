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
    StatusBar
} from 'react-native';

import {
    NetworkManager,
    DateUtil,
    NavigatorTitleButton,
    SeperatorLine,
    SectionHeader,
    CellBackground,
    LoadingView,
    Screen,
    ToastUtil,
    AvatorImage,
    NavigationBar,
    TabPageView,
    ReactNavigation
} from '../config/Common';

import ActionSheet from 'react-native-actionsheet'

import NewBoardListScreenExperience from './NewBoardListScreenExperience';
import NewBoardListScreenHot from './NewBoardListScreenHot';
import { NativeModules } from 'react-native';

export default class NewBoardListScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            viewLoading: true,
            screenText: null,
            isAdding: false,
            dataArray: [],
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <NavigationBar
                    title={this.props.navigation.state.params.name}
                    message={this.props.navigation.state.params.title}
                    navigation={this.props.navigation}
                    showBackButton={true}
                    showBottomLine={false}
                    rightButtonImage={global.images.icon_more}
                    rightButtonOnPress={() => {
                        this.moreActionSheet.show()
                    }}
                />

                <TabPageView
                    titles={['体验', '热点']}
                    pages={
                        [
                            (<NewBoardListScreenExperience navigation={this.props.navigation} board={this.props.navigation.state.params.id} />),
                            (<NewBoardListScreenHot navigation={this.props.navigation} board={this.props.navigation.state.params.id} />),
                        ]}
                />

                <ActionSheet
                    ref={o => this.moreActionSheet = o}
                    title={this.props.navigation.state.params.title}
                    options={['发帖', '收藏', '驻版', '分享', '取消']}
                    cancelButtonIndex={4}
                    onPress={(index) => {
                        //发帖
                        if (index == 0) {
                            if (global.login == true) {
                                ReactNavigation.navigate(this.props.navigation, 'newPostThreadScreen',
                                    {
                                        id: this.props.navigation.state.params.id,
                                        name: this.props.navigation.state.params.name,
                                        title: this.props.navigation.state.params.title,
                                    });
                            }
                            else {
                                DeviceEventEmitter.emit('LoginNotification', null);
                            }
                        }
                        //收藏
                        else if (index == 1) {
                            NetworkManager.net_AddFav(this.props.navigation.state.params.title, (result) => {
                                ToastUtil.info('收藏成功');
                            }, (error) => {
                                ToastUtil.error('收藏失败');
                            }, (errorMessage) => {
                                ToastUtil.error(errorMessage);
                            });
                        }
                        //驻版
                        else if (index == 2) {
                            NetworkManager.net_JoinMember(this.props.navigation.state.params.title, (result) => {
                                ToastUtil.info('驻版成功');
                            }, (error) => {
                                ToastUtil.error('驻版失败');
                            }, (errorMessage) => {
                                ToastUtil.error(errorMessage);
                            });
                        }
                        //分享
                        else if (index == 3) {
                            var shareManager = NativeModules.ShareManager;
                            shareManager.share(this.props.navigation.state.params.name + ' - ' + this.props.navigation.state.params.title + ' - 水木社区', 'https://exp.newsmth.net/board/' + this.props.navigation.state.params.id);
                        }
                        else {

                        }

                    }}
                />

            </View>
        )
    }
}



var styles = {
    get container() {
        return {
            flex: 1,
            padding: 0,
            backgroundColor: global.colors.whiteColor
        }
    },
    get avator() {
        return {
            width: 40,
            height: 40,
        }
    },
    get subject() {
        return {
            paddingLeft: 13,
            paddingRight: 13,
            paddingBottom: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            backgroundColor: global.colors.whiteColor
        }
    },
    get other() {
        return {
            flexDirection: 'row',
            padding: 13,
            backgroundColor: global.colors.whiteColor
        }
    },
    get board() {
        return {
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.backgroundGrayColor,
            borderRadius: 10,
        }
    },
    get author() {
        return {
            marginLeft: 10,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get time() {
        return {
            marginLeft: 10,
            height: 19,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
        }
    },
    get countView() {
        return {
            flexDirection: 'row',
            position: 'absolute',
            top: 13,
            right: 13
        }
    },
    get countImage() {
        return {
            width: 14,
            height: 14,
            marginTop: 2,
            marginRight: 3,
            tintColor: global.colors.gray2Color
        }
    },
    get count() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
        }
    },
    get dot() {
        return {
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize14,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.whiteColor
        }
    },
}
