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
    Dimensions
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
import cio from 'cheerio-without-node-native';
import uuid from 'uuid';

export default class NewUserfansScreen extends Component {

    _page = 1;
    _currentPage;
    _totalPage;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
        }

        this.getNewAccountFans(this._page);
    }

    getNewAccountFans(page) {
        NetworkManager.getNewAccountFans(this.props.id, page, (result) => {
            this.$ = cio.load(result, { decodeEntities: false });
            if (this.$('ul[class=pagination]').html() != null) {
                this.$ = cio.load(this.$('ul[class=pagination]').html());
                this._currentPage = this.$('.active').children().first().text() == null ? 1 : this.$('.active').children().first().text();
                this._totalPage = this.$('li').last().attr('class') == 'disabled' ? this._currentPage : this.$('li').last().children().attr('href').split('/')[4];
            }

            var dataArray = [];
            if (page != 1) {
                dataArray = dataArray.concat(this.state.dataArray);
            }

            this.$ = cio.load(result, { decodeEntities: false });
            if (this.$('ul[class=list-group]').html() != null) {
                this.$ = cio.load(this.$('ul[class=list-group]').html());
                this.$('li').each(function (i, elem) {
                    this.$ = cio.load(elem);

                    dataArray.push({
                        key: dataArray.length,
                        id: this.$('a[class=avatar]').attr('href').split('/')[2],
                        name: this.$('a[class=name]').text(),
                        meta: this.$('div[class=meta]').children().first().text(),
                        avatar: this.$('a[class=avatar]').children().first().attr('src'),
                    });
                });
            }

            this.setState({
                dataArray: dataArray,
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: dataArray.length == 0 ? global.screen.text : global.screen.none,
                screenText: this.props.name + ' 还没有粉丝',
            });

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
                    ReactNavigation.navigate(this.props.navigation, 'newUserScreen', {
                        id: item.id,
                        name: item.name
                    });
                }}
            >
                <View>
                    <View style={styles.container} >
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
        );
    };

    render() {
        return (
            <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                this.setState({
                    screenStatus: global.screen.loading,
                });
                this._page = 1;
                this.getNewAccountFans(this._page);
            }} >
                <FlatList
                    removeClippedSubviews={false}
                    extraData={this.state}
                    data={this.state.dataArray}
                    renderItem={this._renderItem}
                    style={styles.flatList}
                    onRefresh={() => {
                        this.setState({
                            pullLoading: true
                        });
                        this._page = 1;
                        this.getNewAccountFans(this._page);
                    }
                    }
                    onEndReached={() => {
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false && this._page < this._totalPage) {
                            this.setState({
                                pullMoreLoading: true
                            });
                            this._page = this._page + 1;
                            this.getNewAccountFans(this._page);
                        }
                    }
                    }
                    onEndReachedThreshold={2}
                    refreshing={this.state.pullLoading}
                />
            </Screen>
        )
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            flexDirection: 'row',
            padding: global.constants.Padding,
            backgroundColor: global.colors.whiteColor,
        }
    },
    get flatList() {
        return {
            height: global.constants.ScreenHeight - global.constants.NavigationBarHeight - 100 - 40,
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