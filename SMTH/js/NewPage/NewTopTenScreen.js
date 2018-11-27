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
    LoginButtonView
} from '../config/Common';

import { CommonCSS } from 'CommonCSS';

import AsyncStorageManger from '../storage/AsyncStorageManger';


export default class NewTopTenScreen extends Component {

    _array;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
            showLogin: false,
        }

        this._array = [
            { 'index': '0', 'key': '本日十大', 'data': [] },
            { 'index': '1', 'key': '社区管理', 'data': [] },
            { 'index': '2', 'key': '国内院校', 'data': [] },
            { 'index': '3', 'key': '休闲娱乐', 'data': [] },
            { 'index': '4', 'key': '五湖四海', 'data': [] },
            { 'index': '5', 'key': '游戏运动', 'data': [] },
            { 'index': '6', 'key': '社会信息', 'data': [] },
            { 'index': '7', 'key': '知性感性', 'data': [] },
            { 'index': '8', 'key': '文化人文', 'data': [] },
            { 'index': '9', 'key': '学术科学', 'data': [] },
            { 'index': '10', 'key': '电脑技术', 'data': [] },
        ];

        this.loginSuccessNotification = DeviceEventEmitter.addListener('LoginSuccessNotification', () => {
            this.setState({
                screenStatus: global.screen.loading,
            });
            this.net_LoadSectionHot();
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
                        // this.sectionListRef.scrollToLocation({
                        //     animated: true,
                        //     sectionIndex: 0,
                        //     itemIndex: 0,
                        //     viewPosition: 0
                        //   });

                        // this.refs.sectionList.scrollToLocation(({
                        //     sectionIndex: 0,
                        //     itemIndex: 0,
                        //     animated: true,
                        //   }));
                        //   this.sectionList.scrollToLocation(
                        //     {
                        //       sectionIndex: 0,
                        //       itemIndex: 0,
                        //       animated: true,
                        //     }
                        //   );

                        // this.refs.sectionList.scrollToOffset({ offset: -64, animated: true })
                    }, 50);
                    setTimeout(() => {
                        this.net_LoadSectionHot(this._page);
                    }, 1000);
                }
            }
        });

        AsyncStorageManger.getAccessToken().then((value) => {
            //没登录
            if (value.length == 0) {
                this.setState({});
            }
            else {
                this.setState({
                    screenStatus: global.screen.loading,
                });
                this.net_LoadSectionHot();
            }
        });
    }

    componentWillUnmount() {
        this.loginSuccessNotification.remove();
        this.logoutNotification.remove();
        this.doubleClickHotScreenNotification.remove();
    }

    // net_LoadSectionHot() {
    //     NetworkManager.net_LoadSectionHot(0, (result) => {
    //         for (var i = 0; i < result['threads'].length; i++) {
    //             result['threads'][i].key = i;
    //             result['threads'][i].board = unescape(result['threads'][i].board);
    //             result['threads'][i].boardName = global.configures.boards[result['threads'][i].board];
    //             // result['threads'][i].time = DateUtil.formatTimeStamp(result['threads'][i].time);
    //         }

    //         this.setState({
    //             dataArray: result['threads'],
    //             pullLoading: false,
    //             screenStatus: global.screen.none,
    //         });

    //     }, (error) => {
    //         ToastUtil.info(error.message);
    //         this.setState({
    //             pullLoading: false,
    //             screenStatus: this.state.screenStatus == global.screen.loading ? (error.error == 10010 ? global.screen.try : global.screen.error) : global.screen.none,
    //             screenText: error.message,
    //         });
    //     }, (errorMessage) => {
    //         ToastUtil.info(errorMessage);
    //         this.setState({
    //             pullLoading: false,
    //             screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.networkError : global.screen.none,
    //         });
    //     });
    // }

    net_LoadSectionHot() {
        NetworkManager.net_LoadSectionHot(0, (result) => {
            for (var i = 0; i < result['threads'].length; i++) {
                result['threads'][i].key = i;
                result['threads'][i].board = unescape(result['threads'][i].board);
                result['threads'][i].boardName = global.configures.boards[result['threads'][i].board];
            }

            this._array[0].data = result['threads'];
            this.setState({
                dataArray: this._array,
                pullLoading: false,
                screenStatus: global.screen.none,
            });

            for (var j = 1; j < 11; j++) {
                this.loadMore(j);
            }

        }, (error) => {
            ToastUtil.info(error.message);
            this.setState({
                pullLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? (error.error == 10010 ? global.screen.try : global.screen.error) : global.screen.none,
                screenText: error.message,
            });
        }, (errorMessage) => {
            ToastUtil.info(errorMessage);
            this.setState({
                pullLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.networkError : global.screen.none,
            });
        });
    }

    loadMore(index) {
        NetworkManager.net_LoadSectionHot(index, (result) => {
            for (var k = 0; k < result['threads'].length; k++) {
                result['threads'][k].key = k;
                result['threads'][k].board = unescape(result['threads'][k].board);
                result['threads'][k].boardName = global.configures.boards[result['threads'][k].board];
            }
            this._array[index].data = result['threads'];
            this.setState({
                dataArray: this._array,
            });
        }, (error) => {
        }, (timeout) => {
        });
    }

    _renderHeader = ({ section }) => section.data.length > 0 ?
        (
            // <View>
            //     <SectionHeader title={section.key} color={global.colors.whiteColor} />
            // </View>

            <View style={CommonCSS.sectionView} >
                <View style={CommonCSS.sectionVerticalLine} />
                <Text style={CommonCSS.sectionTitle} >
                    {section.key}
                </Text>
            </View>
    
        )
        : null;

    _renderItem = ({ item }) => (
        <CellBackground
            onPress={() => {
                this.props.navigation.navigate('threadDetail', { id: item.id, board: item.board, subject: item.subject })
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
                            this.net_LoadSectionHot();
                        }} >
                            {/* <FlatList
                                ref="flatList"
                                data={this.state.dataArray}
                                renderItem={this._renderItem}
                                removeClippedSubviews={false}
                                extraData={this.state}
                                style={styles.flatList}
                                onRefresh={() => {
                                    this.setState({
                                        pullLoading: true
                                    });
                                    this.net_LoadSectionHot();
                                }}
                                refreshing={this.state.pullLoading}
                            /> */}

                            <SectionList
                                // ref="sectionList"
                                ref={ref => (this.sectionListRef = ref)}
                                sections={this.state.dataArray}
                                renderItem={this._renderItem}
                                renderSectionHeader={this._renderHeader}
                                removeClippedSubviews={false}
                                style={{
                                }}
                                onRefresh={() => {
                                    this.setState({
                                        pullLoading: true
                                    });

                                    this.net_LoadSectionHot();
                                }
                                }
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