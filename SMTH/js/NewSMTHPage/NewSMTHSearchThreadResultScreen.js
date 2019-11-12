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
    AvatorImage,
    SeperatorLine,
    LoadingView,
    Screen,
    CellBackground,
    NavigationBar,
    ToastUtil,
    ReactNavigation
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';

import cio from 'cheerio-without-node-native';
import HTMLView from 'react-native-htmlview';
import AutoHeightImage from 'react-native-auto-height-image';
import { CachedImage } from "react-native-img-cache";

export default class NewSMTHSearchThreadResultScreen extends Component {

    _page = 1;
    _totalPage;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: this.props.navigation.state.params.dataArray == null ? global.screen.loading : global.screen.none,
            screenText: null,
            dataArray: this.props.navigation.state.params.dataArray,
        }

        if (this.props.navigation.state.params.dataArray == null) {
            this._page = 1;
            this.getNewSMTHSearchThread(this._page);
        } else {

        }
    }

    getNewSMTHSearchThread() {
        NetworkManager.getNewSMTHSearchThread(this.props.navigation.state.params.board, this.props.navigation.state.params.title, this.props.navigation.state.params.author, this._page, (result) => {
            this.$ = cio.load(result, { decodeEntities: false });
            this._totalPage = this.$('li[class=page-pre]').children().first().text() / 80 + 1;
            this.$ = cio.load(this.$('div[class=b-content]').html());
            var dataArray = [];
            if (this.$('td[colspan=7]').text() == '没有搜索到任何主题') {
                this.setState({
                    dataArray: dataArray,
                    pullLoading: false,
                    pullMoreLoading: false,
                    screenStatus: global.screen.text,
                    screenText: '没有搜索到任何主题',
                });
            } else {
                this.$('tr').each(function (i, elem) {
                    if (i != 0) {
                        this.$ = cio.load(elem, { decodeEntities: false });
                        var title = this.$('td[class=title_9]').children().first().text();
                        var author = this.$('td[class=title_12]').first().children().first().text();
                        var time = this.$('td[class=title_9]').next().text();

                        dataArray.push({
                            key: dataArray.length,
                            id: this.$('td[class=title_9]').children().first().attr('href').split('/')[4],
                            time: time,
                            title: title,
                            author: author,
                        });
                    }
                });
                this.setState({
                    dataArray: dataArray,
                    pullLoading: false,
                    pullMoreLoading: false,
                    screenStatus: global.screen.none,
                });
            }

        }, (error) => {
            ToastUtil.info(error);
            this.setState({
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.error : global.screen.none,
                screenText: error,
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
        return (
            <CellBackground
                onPress={() => {
                    ReactNavigation.navigate(this.props.navigation, 'newSMTHThreadDetailScreen', { id: item.id, board: this.props.navigation.state.params.board });
                }}
            >
                <View>
                    <View style={styles.container} >
                        <Text style={[CommonCSS.listTitle]} >{item.title}</Text>
                        <Text style={[CommonCSS.listTime, { marginTop: 10 }]} >{item.time}</Text>
                        <Text style={[CommonCSS.listTime, { marginTop: 10 }]} >{item.author}</Text>
                    </View>
                    <SeperatorLine />
                </View>
            </CellBackground>
        );
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                {
                    this.props.id != null ? null :
                        <NavigationBar
                            title={'搜索结果'}
                            navigation={this.props.navigation}
                            showBackButton={true}
                            showBottomLine={true}
                        />
                }
                <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                    this.setState({
                        screenStatus: global.screen.loading,
                    });
                    this._page = 1;
                    this.getNewSMTHSearchThread(this._page);
                }} >
                    <FlatList
                        removeClippedSubviews={false}
                        extraData={this.state}
                        data={this.state.dataArray}
                        renderItem={this._renderItem}
                        style={styles.flatList}
                        onEndReached={() => {
                            if (this.state.pullLoading == false && this.state.pullMoreLoading == false && this._page < this._totalPage) {
                                this.setState({
                                    pullMoreLoading: true
                                });
                                this._page = this._page + 1;
                                this.getNewSMTHSearchThread(this._page);
                            }
                        }
                        }
                        onEndReachedThreshold={2}
                        refreshing={this.state.pullLoading}
                    />


                </Screen>
            </View>
        )
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            padding: global.constants.Padding,
            backgroundColor: global.colors.whiteColor
        }
    },

}