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
    DeviceEventEmitter
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
    NavigationBar
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';

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
                    if (item.type == 'new') {
                        this.props.navigation.navigate('newThreadDetailScreen', { id: item.id });
                    }
                    else {
                        this.props.navigation.navigate('threadDetail', { id: item.id, board: item.board_id, subject: item.subject })
                    }
                }}
            >
                <View style={styles.container}>
                    <Text style={styles.subject}>{item.subject}</Text>
                    <View style={styles.other}>
                        <Text style={styles.board}>{unescape(item.board_id)}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.author}>{item.author}</Text>
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
            padding: 0,
            backgroundColor: global.colors.clearColor
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
}
