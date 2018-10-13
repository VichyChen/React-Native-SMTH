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

import FavouriteThreadModel from '../models/FavouriteThreadModel';

export default class NewFavouriteThreadScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataArray: [],
        }

        this.refreshFavouriteThreadNotification = DeviceEventEmitter.addListener('RefreshFavouriteThreadNotification', () => {
            this.readrFavouriteThreadModel();
        });

        this.readrFavouriteThreadModel();
    }

    componentWillUnmount() {
        this.refreshFavouriteThreadNotification.remove();
    }

    readrFavouriteThreadModel() {
        FavouriteThreadModel.read().then((array) => {
            this.setState({
                dataArray: array,
                screenText: array.length > 0 ? null : '您没有收藏帖子'
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
                <View>
                    <View style={styles.container}>
                        <Text style={styles.subject}>{item.subject}</Text>
                        <View style={styles.other}>
                            <Text style={styles.board}>{unescape(item.board_id)}</Text>
                            <Text style={styles.author}>{item.author}</Text>
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
    get subject() {
        return {
            fontSize: global.configures.fontSize17,
            fontWeight: 'bold',
            color: global.colors.fontColor
        }
    },
    get other() {
        return {
            flexDirection: 'row',
            paddingTop: 13,
            backgroundColor: global.colors.whiteColor
        }
    },
    get board() {
        return {
            // marginTop: 10,
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
