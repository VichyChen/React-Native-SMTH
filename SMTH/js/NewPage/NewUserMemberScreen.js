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

export default class NewUserMemberScreen extends Component {

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

        this.getNewAccountMembers(this._page);
    }

    getNewAccountMembers(page) {
        NetworkManager.getNewAccountMembers(this.props.id, page, (result) => {
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
                    id: this.$('div[class=board-summary]').children().first().children().first().attr('href').split('/')[2],
                    boardName: this.$('div[class=board-summary]').children().first().children().first().text(),
                    boardTitle: this.$('div[class=board-summary]').children().last().children().first().text(),
                };
                console.log('object.key:' + object.key);
                console.log('object.id:' + object.id);
                console.log('object.boardName:' + object.boardName);
                console.log('object.boardTitle:' + object.boardTitle);

                dataArray.push({
                    key: dataArray.length,
                    id: this.$('div[class=board-summary]').children().first().children().first().attr('href').split('/')[2],
                    boardName: this.$('div[class=board-summary]').children().first().children().first().text(),
                    boardTitle: this.$('div[class=board-summary]').children().last().children().first().text(),
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
                    this.getNewAccountMembers(this._page);
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
                        this.getNewAccountMembers(this._page);
                    }
                    }
                    onEndReached={() => {
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                            this.setState({
                                pullMoreLoading: true
                            });
                            this._page = this._page + 1;
                            this.getNewAccountMembers(this._page);
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