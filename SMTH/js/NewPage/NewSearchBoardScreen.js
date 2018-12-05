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
import cio from 'cheerio-without-node-native';


export default class NewSearchBoardScreen extends Component {

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

        this.getNewSearchBoard(this._page);
    }

    getNewSearchBoard(page) {
        NetworkManager.getNewSearchBoard(this.props.keyword, page, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('div[class=row]').html());

            var _dataArray = [];
            if (page != 1) {
                _dataArray = _dataArray.concat(this.state.dataArray);
            }
            this.$('div[class=board-data-summary]').each(function (i, elem) {
                this.$ = cio.load(elem);

                _dataArray.push({
                    key: i,
                    id: this.$('div[class=board-data-summary-name]').children().first().attr('href').split('/')[2],
                    boardName: this.$('div[class=board-data-summary-name]').children().first().text(),
                    boardTitle: this.$('div[class=board-data-summary-name]').children().last().text(),
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
                    ReactNavigation.navigate(this.props.navigation, 'newBoardListScreen', { id: item.id, name: item.boardTitle, title: item.boardName });
                }}
            >
                <View>
                    <View style={styles.itemContainer}>
                        <Text style={[CommonCSS.listBoardEN, { paddingTop: 1 }]} >{item.boardName}</Text>
                        <Text style={[CommonCSS.listBoardCH, { marginLeft: 8, marginRight: 8, paddingTop: 3 }]} >{item.boardTitle}</Text>
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
                    this.getNewSearchBoard(this._page);
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
                            this.getNewSearchBoard(this._page);
                        }}
                        // onEndReached={() => {
                        //     if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                        //         this.setState({
                        //             pullMoreLoading: true
                        //         });
                        //         this._page = this._page + 1;
                        //         this.getNewSearchBoard(this._page);
                        //     }
                        // }}
                        onEndReachedThreshold={4}
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
            paddingLeft: global.constants.Padding,
            flex: 1,
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: global.colors.whiteColor
        }
    },
}
