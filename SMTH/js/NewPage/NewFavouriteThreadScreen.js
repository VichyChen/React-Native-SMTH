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
import { CommonCSS } from 'CommonCSS';

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

    deleteFavouriteThreadModel(id) {
        FavouriteThreadModel.delete(id).then(() => {
            this.readrFavouriteThreadModel();
        });
    }

    _renderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    ReactNavigation.navigate(this.props.navigation, 'newSMTHThreadDetailScreen', { id: item.id, board: unescape(item.board_id) });

                    // if (item.type == 'new') {
                    //     ReactNavigation.navigate(this.props.navigation, 'newThreadDetailScreen', { id: item.id });
                    // }
                    // else {
                    //     ReactNavigation.navigate(this.props.navigation, 'threadDetail', { id: item.id, board: item.board_id, subject: item.subject })
                    // }
                }}
            >
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: global.colors.whiteColor }}>
                        {
                            this.state.editing == true
                                ?
                                <ImageButton style={styles.deleteImage} width={44} height={44} margin={24} source={global.images.icon_minus}
                                    onPress={() => { this.deleteFavouriteThreadModel(item.id); }} />
                                :
                                null
                        }
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
                    navigation={this.props.navigation}
                    title='帖子收藏'
                    showBottomLine={true}
                    showBackButton={true}
                    rightButtonTitle={this.state.editing == true ? '完成' : '编辑'}
                    rightButtonOnPress={() => {
                        this.setState({
                            editing: !this.state.editing,
                        });
                    }}
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
    get deleteImage() {
        return {
            paddingLeft: global.constants.Padding,
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
