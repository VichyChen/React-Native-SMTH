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
            // this.$ = cio.load(result);
            // this.$ = cio.load(this.$('ul[class=article-list]').html());

            // var dataArray = [];
            // if (page != 1) {
            //     dataArray = dataArray.concat(this.state.dataArray);
            // }
            // this.$('li').each(function (i, elem) {
            //     this.$ = cio.load(elem);
            //     if (this.$('a[class=article-subject]').attr('href') != null) {
            //         dataArray.push({
            //             key: dataArray.length,
            //             id: this.$('a[class=article-subject]').attr('href').split('/')[2],
            //             avatar: this.$('a[class=article-account-avatar]').children().attr('src'),
            //             name: this.$('div[class=article-account-name]').children().first().text(),
            //             time: this.$('div[class=article-account-name]').children().last().text(),
            //             title: this.$('a[class=article-subject]').text().trim(),
            //             content: this.$('p[class=article-brief]').text().trim(),
            //             comment: this.$('span[class*=glyphicon-comment]').parent().text(),
            //             heart: this.$('span[class*=glyphicon-heart]').parent().text(),
            //             picture: this.$('span[class*=glyphicon-picture]').parent().text(),
            //         });
            //     }
            // });

            this.setState({
                dataArray: dataArray,
                pullLoading: false,
                pullMoreLoading: false,
                viewLoading: false,
                screenText: null
            });

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