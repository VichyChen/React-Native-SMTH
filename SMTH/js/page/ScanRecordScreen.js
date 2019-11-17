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
    DeviceEventEmitter,
    StatusBar
} from 'react-native';

import {
    NetworkManager,
    SeperatorLine,
    CellBackground,
    NavigatorTitleButton,
    ImageButton,
    LoadingView,
    Screen,
    ToastUtil,
    NavigationBar,
    ReactNavigation
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';
import { CommonCSS } from 'CommonCSS';

import ScanRecordModel from '../models/ScanRecordModel';

export default class ScanRecordScreen extends Component {
    static navigationOptions = {
        title: '浏览记录',
    };

    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
        }

        this.refreshScanRecordNotification = DeviceEventEmitter.addListener('RefreshScanRecordNotification', () => {
            console.log('RefreshScanRecordNotification');
            this.readrScanRecordModel();
        });

        this.readrScanRecordModel();
    }

    componentWillUnmount() {
        this.refreshScanRecordNotification.remove();
    }

    readrScanRecordModel() {
        ScanRecordModel.read().then((array) => {
            this.setState({
                dataArray: array,
                screenText: array.length > 0 ? null : '您还没有浏览记录'
            });
        });
    }

    _renderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    ReactNavigation.navigate(this.props.navigation, 'newSMTHThreadDetailScreen', { id: item.id, board: unescape(item.board_id) });
                }}
            >
                <View>
                    <View style={styles.container}>
                        <Text style={CommonCSS.listOnlyTitle}>{item.subject}</Text>
                        <View style={styles.other}>
                                <Text style={CommonCSS.listBoardEN}>{unescape(item.board_id)}</Text>
                                {
                                    global.boards.all[item.board_id] == null ? null :
                                        (
                                            <Text style={[CommonCSS.listBoardCH, { marginLeft: 8 }]} >{global.boards.all[item.board_id].name}</Text>
                                        )
                                }
                                {/* <Text style={[CommonCSS.listDescript, { marginLeft: 8 }]}>{item.author}</Text> */}
                            </View>
                    </View>
                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    };

    render() {
        return (
            <View style={{ flex: 1 }}>

                <NavigationBar
                    title={'浏览记录'}
                    showBackButton={true}
                    navigation={this.props.navigation}
                />

                <Screen
                    showLoading={false}
                    loadingType={'none'}
                    text={this.state.screenText}
                >
                    <FlatList
                        data={this.state.dataArray}
                        renderItem={this._renderItem}
                        removeClippedSubviews={false}
                        extraData={this.state}
                        keyExtractor={(item, index) => index}
                        style={{
                            backgroundColor: global.colors.whiteColor,
                            height: global.constants.ScreenHeight - global.constants.NavigationBarHeight,
                        }}
                    />
                </Screen>
            </View>
        );
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            flexDirection: 'column',
            padding: global.constants.Padding,
            backgroundColor: global.colors.whiteColor
        }
    },
    get other() {
        return {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 13,
            backgroundColor: global.colors.whiteColor
        }
    },
    get board() {
        return {
            marginRight: 8,
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
    get avator() {
        return {
            width: 40,
            height: 40,
        }
    },
    get author() {
        return {
            fontSize: global.configures.fontSize15,
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
}
