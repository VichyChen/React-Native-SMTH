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
    ReactNavigation,
    AvatorImage
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';
import cio from 'cheerio-without-node-native';


export default class NewSearchAccountScreen extends Component {

    _page = 1;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
        }

        this.getNewSearchAccount(this._page);
    }

    getNewSearchAccount(page) {
        NetworkManager.getNewSearchAccount(this.props.keyword, page, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('div[class=row]').html());

            _dataArray = [];
            if (page != 1) {
                _dataArray = _dataArray.concat(this.state.dataArray);
            }
            this.$('div[class=account-summary]').each(function (i, elem) {
                this.$ = cio.load(elem);

                _dataArray.push({
                    key: _dataArray.length,
                    id: this.$('a[class=avatar]').attr('href').split('/')[2],
                    name: this.$('a[class=name]').text(),
                    meta: this.$('div[class=meta]').children().first().text(),
                    avatar: this.$('a[class=avatar]').children().first().attr('src'),
                });
            });

            this.setState({
                dataArray: _dataArray,
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: _dataArray.length == 0 ? global.screen.text : global.screen.none,
                screenText: '没有搜索结果',
            });

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

    _renderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    ReactNavigation.navigate(this.props.navigation, 'newUserScreen', {
                        id: item.id,
                        name: item.name
                    });
                }}
            >
                <View>
                    <View style={styles.itemContainer} >
                        <AvatorImage
                            borderRadius={20}
                            widthAndHeight={40}
                            uri={'https://exp.newsmth.net/' + item.avatar} />
                        <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-start' }} >
                            <Text style={styles.itemName} >{item.name.trim()}</Text>
                            <Text style={styles.itemMeta} >{item.meta}</Text>
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

                <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                    this.setState({
                        screenStatus: global.screen.loading,
                    });
                    this._page = 1;
                    this.getNewSearchAccount(this._page);
                }} >
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
                        onRefresh={() => {
                            this.setState({
                                pullLoading: true
                            });
                            this._page = 1;
                            this.getNewSearchAccount(this._page);
                        }
                        }
                        // onEndReached={() => {
                        //     if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                        //         this.setState({
                        //             pullMoreLoading: true
                        //         });
                        //         this._page = this._page + 1;
                        //         this.getNewSearchAccount(this._page);
                        //     }
                        // }}
                        onEndReachedThreshold={2}
                        refreshing={this.state.pullLoading}
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
    get itemContainer() {
        return {
            flex: 1,
            flexDirection: 'row',
            padding: global.constants.Padding,
            backgroundColor: global.colors.whiteColor,
        }
    },
    get itemName() {
        return {
            fontSize: global.configures.fontSize16,
            color: global.colors.fontColor,
        }
    },
    get itemMeta() {
        return {
            fontSize: global.configures.fontSize14,
            color: global.colors.gray1Color,
        }
    },
}
