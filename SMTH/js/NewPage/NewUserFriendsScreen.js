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
} from '../config/Common';
import cio from 'cheerio-without-node-native';

export default class NewUserFriendsScreen extends Component {

    _page = 1;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            viewLoading: true,
            screenText: null,
            dataArray: [],
        }

        this.getNewAccountFriends(this._page);
    }

    getNewAccountFriends(page) {
        NetworkManager.getNewAccountFriends(this.props.id, page, (result) => {
            this.$ = cio.load(result, { decodeEntities: false });
            this.$ = cio.load(this.$('ul[class=list-group]').html());

            var dataArray = [];
            if (page != 1) {
                dataArray = dataArray.concat(this.state.dataArray);
            }
            this.$('li').each(function (i, elem) {
                this.$ = cio.load(elem);


                var object = {
                    key: dataArray.length,
                    id: this.$('a[class=avatar]').attr('href').split('/')[2],
                    name: this.$('a[class=name]').text(),
                    meta: this.$('div[class=meta]').children().first().text(),
                    avatar: this.$('a[class=avatar]').children().first().attr('src'),
                };
                console.log('object.key:' + object.key);
                console.log('object.id:' + object.id);
                console.log('object.name:' + object.name);
                console.log('object.meta:' + object.meta);
                console.log('object.avatar:' + object.avatar);

                dataArray.push({
                    key: dataArray.length,
                    id: this.$('a[class=avatar]').attr('href').split('/')[2],
                    name: this.$('a[class=name]').text(),
                    meta: this.$('div[class=meta]').children().first().text(),
                    avatar: this.$('a[class=avatar]').children().first().attr('src'),
                });
            });

            // this.setState({
            //     dataArray: dataArray,
            //     pullLoading: false,
            //     pullMoreLoading: false,
            //     viewLoading: false,
            //     screenText: null
            // });

        }, (error) => {

        }, (errorMessage) => {

        });
    }


    render() {
        return (
            <Screen
                showLoading={this.state.viewLoading}
                loadingType={'background'}
                text={this.state.screenText}
                onPress={() => {
                    this.setState({
                        viewLoading: true,
                        screenText: null
                    });
                    this._page = 1;
                    this.getNewAccountFriends(this._page);
                }}
            >
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
                        this.getNewAccountFriends(this._page);
                    }
                    }
                    onEndReached={() => {
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                            this.setState({
                                pullMoreLoading: true
                            });
                            this._page = this._page + 1;
                            this.getNewAccountFriends(this._page);
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
            backgroundColor: global.colors.whiteColor
        }
    },
}