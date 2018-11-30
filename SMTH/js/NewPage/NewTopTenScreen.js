/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
    TouchableHighlight,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';

import {
    NetworkManager,
    DateUtil,
    SeperatorLine,
    HorizontalSeperatorLine,
    SectionHeader,
    CellBackground,
    LoginView,
    LoadingView,
    Screen,
    Toast,
    ToastUtil,
    AvatorImage,
    LoginButtonView,
    ReactNavigation,
    GDTNativeExpressView
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';
import AsyncStorageManger from '../storage/AsyncStorageManger';
import { NativeModules } from 'react-native';
import uuid from 'uuid';


export default class NewTopTenScreen extends Component {

    _array;
    _page = 0;
    _adSection = [0, 3, 7, 10];
    _adTag = [900, 901, 902, 903];
    _adTagDic = { '0': 900, '3': 901, '7': 902, '10': 903 };

    constructor(props) {
        super(props);

        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
            showLogin: false,
            adheight: { '900': 0, '901': 0, '902': 0, '903': 0 },
        }

        this._array = {
            0: '本日十大', 1: '社区管理', 2: '国内院校', 3: '休闲娱乐', 4: '五湖四海',
            5: '游戏运动', 6: '社会信息', 7: '知性感性', 8: '文化人文', 9: '学术科学', 10: '电脑技术'
        };

        this.loginSuccessNotification = DeviceEventEmitter.addListener('LoginSuccessNotification', () => {
            this.setState({
                screenStatus: global.screen.loading,
            });
            this.net_LoadSectionHot(this._page);
        });
        this.logoutNotification = DeviceEventEmitter.addListener('LogoutNotification', () => {
            this.setState({});
        });
        this.doubleClickHotScreenNotification = DeviceEventEmitter.addListener('DoubleClickHotScreenNotification', () => {
            if (this.props.selected == true) {
                if (this.props.selected == true) {
                    this.setState({
                        pullLoading: true,
                    });
                    setTimeout(() => {
                        this.refs.flatList.scrollToOffset({ offset: -64, animated: true })
                    }, 50);
                    setTimeout(() => {
                        var nativeExpressAdManager = NativeModules.GDTNativeExpressAdManager;
                        nativeExpressAdManager.remove(this._adTag);
                        this._page = 0;
                        this.net_LoadSectionHot(this._page);
                    }, 1000);
                }
            }
        });

        AsyncStorageManger.getLogin().then(login => {
            global.login = login;
            if (login == true) {
                this.setState({
                    screenStatus: global.screen.loading,
                });
                this.net_LoadSectionHot(this._page);
            }
        });
    }

    componentWillUnmount() {
        this.loginSuccessNotification.remove();
        this.logoutNotification.remove();
        this.doubleClickHotScreenNotification.remove();
    }

    net_LoadSectionHot(section) {
        NetworkManager.net_LoadSectionHot(section, (result) => {
            for (var i = 0; i < result['threads'].length; i++) {
                result['threads'][i].key = section * 10 + i;
                result['threads'][i].type = 'row';
                result['threads'][i].subject = unescape(result['threads'][i].subject);
                result['threads'][i].board = unescape(result['threads'][i].board);
                result['threads'][i].boardName = global.configures.boards[result['threads'][i].board];
            }

            var array = [];
            if (section != 0) {
                array = this.state.dataArray;
            }
            if (result['threads'].length > 0) {
                array.push({
                    key: 'section' + section,
                    type: 'section',
                    title: this._array[section],
                });
                array = array.concat(result['threads']);

                if (this._adSection.indexOf(section) != -1) {
                    array.push({
                        key: 'ad' + uuid.v4(),
                        adTag: this._adTagDic[section.toString()],
                        type: 'ad',
                    });
                }
            }

            this.setState({
                dataArray: array,
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: global.screen.none,
            });
        }, (error) => {
            ToastUtil.info(error.message);
            this.setState({
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? (error.error == 10010 ? global.screen.try : global.screen.error) : global.screen.none,
                screenText: error.message,
            });
        }, (errorMessage) => {
            ToastUtil.info(errorMessage);
            this.setState({
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.networkError : global.screen.none,
            });
        });
    }

    _renderItem = ({ item }) => {
        if (item.type == 'section') {
            return (
                <View>
                    <SectionHeader title={item.title} color={global.colors.backgroundGrayColor} />
                </View>
            );
        }
        else if (item.type == 'ad') {
            return (
                <GDTNativeExpressView
                    style={{ height: this.state.adheight[item.adTag.toString()] }}
                    adTag={item.adTag}
                    onRenderSuccess={(event) => {
                        this.state.adheight[item.adTag.toString()] = event.nativeEvent.height;
                        this.setState({
                            adheight: this.state.adheight,
                        });
                    }}
                />
            );
        }
        else {
            return (
                <CellBackground
                    onPress={() => {
                        ReactNavigation.navigate(this.props.navigation, 'threadDetail', { id: item.id, board: item.board, subject: item.subject })
                    }}
                >
                    <View>
                        <View style={styles.itemContainer}>

                            <Text style={CommonCSS.listOnlyTitle} >{item.subject}</Text>
                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                                <Text style={[CommonCSS.listBoardEN]} >{item.board}</Text>
                                {
                                    global.boards.all[item.board] == null ? null :
                                        (
                                            <Text style={[CommonCSS.listBoardCH, { marginLeft: 8 }]} >{global.boards.all[item.board].name}</Text>
                                        )
                                }
                                {/* <Text style={[CommonCSS.listDescript, { marginLeft: 10 }]} >{item.author_id}</Text> */}
                                <Text style={[CommonCSS.listDescript, { marginLeft: 8 }]} >{item.count + '回复 '}</Text>
                            </View>

                        </View>
                        <SeperatorLine />
                    </View>
                </CellBackground>
            );
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <HorizontalSeperatorLine />
                {
                    global.login == false
                        ?
                        <LoginButtonView text={'需登陆才能查看十大'} style={{ zIndex: 999, position: 'absolute', top: 1, bottom: 0, left: 0, right: 0 }} />
                        :
                        <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                            this.setState({
                                screenStatus: global.screen.loading,
                            });
                            this._page = 0;
                            this.net_LoadSectionHot(this._page);
                        }} >
                            <FlatList
                                ref="flatList"
                                data={this.state.dataArray}
                                renderItem={this._renderItem}
                                removeClippedSubviews={false}
                                extraData={this.state}
                                onRefresh={() => {
                                    this.setState({
                                        pullLoading: true
                                    });
                                    var nativeExpressAdManager = NativeModules.GDTNativeExpressAdManager;
                                    nativeExpressAdManager.remove(this._adTag);
                                    this._page = 0;
                                    this.net_LoadSectionHot(this._page);
                                }}
                                onEndReached={() => {
                                    if (this.state.pullLoading == false && this.state.pullMoreLoading == false && this._page < 10) {
                                        this.setState({
                                            pullMoreLoading: true
                                        });
                                        this._page = this._page + 1;
                                        this.net_LoadSectionHot(this._page);
                                    }
                                }}
                                onEndReachedThreshold={4}
                                refreshing={this.state.pullLoading}
                            />

                        </Screen>
                }
            </View>
        )
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
        }
    },
    get subject() {
        return {
            paddingLeft: 13,
            paddingRight: 13,
            paddingTop: 13,
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
    // board: {
    //   position: 'absolute',
    //   top: 13,
    //   right: 13,
    //   paddingTop: 3,
    //   paddingBottom: 3,
    //   paddingLeft: 5,
    //   paddingRight: 5,
    //   fontSize: global.configures.fontSize15,
    //   color: global.colors.gray2Color,
    //   backgroundColor: global.colors.backgroundGrayColor,
    //   borderRadius: 10,
    // },
    get board() {
        return {
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.backgroundGrayColor,
            borderRadius: 10,
        }
    },
    get avator() {
        return {
            width: 40,
            height: 40,
        }
    },
    // author: {
    //   marginLeft: 10,
    //   fontSize: global.configures.fontSize17,
    //   height: 20,
    //   color: global.colors.fontColor,
    // },
    get author() {
        return {
            fontSize: global.configures.fontSize15,
            paddingTop: 3,
            height: 20,
            color: global.colors.gray2Color,
        }
    },
    get time() {
        return {
            marginLeft: 10,
            marginTop: 4,
            height: 20,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
        }
    },
    get dot() {
        return {
            paddingTop: 3,
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize14,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.whiteColor
        }
    },
    get countView() {
        return {
            flexDirection: 'row',
            position: 'absolute',
            top: 15,
            right: 12
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
    get itemContainer() {
        return {
            flex: 1,
            flexDirection: 'column',
            padding: global.constants.Padding,
            backgroundColor: global.colors.whiteColor
        }
    },
    get itemName() {
        return {
            marginLeft: 10,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color
        }
    },
    get itemTitle() {
        return {
            lineHeight: global.constants.LineHeight,
            fontSize: global.configures.fontSize17,
            fontWeight: '600',
            color: global.colors.fontColor
        }
    },
    get itemBoard() {
        return {
            // marginRight: 8,
            paddingLeft: 4,
            paddingRight: 4,
            alignItems: 'center',
            fontSize: global.configures.fontSize14,
            color: global.colors.redColor,
            borderColor: global.colors.redColor,
            borderWidth: 1,
            borderRadius: 2,
            height: 18,
            textAlign: 'center'
        }
    },
}