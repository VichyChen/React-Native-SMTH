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

import AsyncStorageManger from '../storage/AsyncStorageManger';

var _array;

export default class NewTopTenScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            viewLoading: true,
            screenText: null,
            dataArray: [],
            showLogin: false,
        }

        this.loginSuccessNotification = DeviceEventEmitter.addListener('LoginSuccessNotification', () => {
            this.setState({
                viewLoading: true,
                loadingType: 'background',
                screenText: null
            });
            this.net_LoadSectionHot();
        });
        this.logoutNotification = DeviceEventEmitter.addListener('LogoutNotification', () => {
            this.setState({});
        });

        AsyncStorageManger.getAccessToken().then((value) => {
            //没登录
            if (value.length == 0) {
                this.setState({});
            }
            else {
                this.net_LoadSectionHot();
            }
        });
    }

    componentWillUnmount() {
        this.loginSuccessNotification.remove();
        this.logoutNotification.remove();
    }

    net_LoadSectionHot() {
        NetworkManager.net_LoadSectionHot(0, (result) => {
            for (var i = 0; i < result['threads'].length; i++) {
                result['threads'][i].key = i;
                result['threads'][i].board = unescape(result['threads'][i].board);
                result['threads'][i].boardName = global.configures.boards[result['threads'][i].board];
                // result['threads'][i].time = DateUtil.formatTimeStamp(result['threads'][i].time);
            }

            this.setState({
                dataArray: result['threads'],
                pullLoading: false,
                viewLoading: false,
                screenText: null
            });

        }, (error) => {
            if (this.state.viewLoading == true) {
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: error
                });
            }
            else {
                ToastUtil.info(error);
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: null
                });
            }
        }, (errorMessage) => {
            if (this.state.viewLoading == true) {
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: errorMessage + '，请点击重试'
                });
            }
            else {
                ToastUtil.info(errorMessage);
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: null
                });
            }
        });
    }

    _renderItem = ({ item }) => (
        <CellBackground
            onPress={() => {
                this.props.navigation.navigate('threadDetail', { id: item.id, board: item.board, subject: item.subject })
            }}
        >
            <View>
                <View style={styles.itemContainer}>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <AvatorImage
                            borderRadius={15}
                            widthAndHeight={30}
                            onPressClick={() => {
                                // this.props.navigation.navigate('userScreen', { id: item.author_id });
                            }}
                            uri={NetworkManager.net_getFace(item.author_id)} />

                        <Text style={styles.itemName} >{item.author_id}</Text>
                    </View>
                    {/* <Text style={styles.itemTime} >{item.time}</Text> */}
                    <Text style={styles.itemTitle} >{item.subject}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                        <Text style={[styles.itemBoard, { paddingTop: 1 }]} >{item.board}</Text>
                        <Text style={[styles.itemBoard, { marginLeft: 8, marginRight: 8, paddingTop: 3 }]} >{global.boards.all[item.board].name}</Text>
                        <Text style={styles.itemDescript} >{item.count + '回复 '}</Text>
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
                        <LoginButtonView style={{ zIndex: 999, position: 'absolute', top: 1, bottom: 0, left: 0, right: 0 }} />
                        :
                        <Screen
                            showLoading={this.state.viewLoading}
                            loadingType={'background'}
                            text={this.state.screenText}
                            onPress={() => {
                                this.setState({
                                    viewLoading: true,
                                    loadingType: 'background',
                                    screenText: null
                                });
                                this.net_LoadSectionHot();
                            }}
                        >
                            <FlatList
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
            color: global.colors.fontColor
        }
    },
    get itemTime() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize13,
            color: global.colors.gray2Color
        }
    },
    get itemTitle() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize17,
            fontWeight: 'bold',
            color: global.colors.fontColor
        }
    },
    get itemBoard() {
        return {
            marginTop: 10,
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
    get itemDescript() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize13,
            color: global.colors.gray2Color
        }
    },
}