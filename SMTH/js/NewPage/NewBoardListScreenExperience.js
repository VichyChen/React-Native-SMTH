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
} from 'react-native';

import {
    NetworkManager,
    DateUtil,
    NavigatorTitleButton,
    SeperatorLine,
    SectionHeader,
    CellBackground,
    LoadingView,
    Screen,
    ToastUtil,
    AvatorImage
} from '../config/Common';


import cio from 'cheerio-without-node-native';

export default class NewBoardListScreenExperience extends Component {

    _page = 1;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            viewLoading: true,
            screenText: null,
            isAdding: false,
            dataArray: [],
        }

        this.getNewBoardExperience(this._page);
    }

    getNewBoardExperience(page) {
        NetworkManager.getNewBoardExperience(this.props.board, page, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('ul[class=article-list]').html());

            var dataArray = [];
            if (page != 1) {
                dataArray = dataArray.concat(this.state.dataArray);
            }
            this.$('li').each(function (i, elem) {
                this.$ = cio.load(elem);
                if (this.$('a[class=article-subject]').attr('href') != null) {
                    dataArray.push({
                        key: this.$('a[class=article-subject]').attr('href').split('/')[2],
                        avatar: this.$('a[class=article-account-avatar]').children().attr('src'),
                        name: this.$('div[class=article-account-name]').children().first().text(),
                        time: this.$('div[class=article-account-name]').children().last().text(),
                        title: this.$('a[class=article-subject]').text().trim(),
                        content: this.$('p[class=article-brief]').text().trim(),
                        comment: this.$('span[class*=glyphicon-comment]').parent().text(),
                        heart: this.$('span[class*=glyphicon-heart]').parent().text(),
                        picture: this.$('span[class*=glyphicon-picture]').parent().text(),
                    });
                }
            });

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

    _renderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    this.props.navigation.navigate('newThreadDetailScreen', { id: item.key });
                }}
            >
                <View>
                    <View style={styles.itemContainer}>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <AvatorImage
                                borderRadius={15}
                                widthAndHeight={30}
                                onPressClick={() => {
                                    // this.props.navigation.navigate('userScreen', { id: item.author_id });
                                }}
                                uri={'https://exp.newsmth.net/' + item.avatar} />

                            <Text style={styles.itemName} >{item.name}</Text>
                        </View>
                        <Text style={styles.itemTime} >{item.time}</Text>
                        <Text style={styles.itemTitle} >{item.title}</Text>
                        {item.content.length > 0 ? <Text style={styles.itemContent} >{item.content}</Text> : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                            <Text style={styles.itemDescript} >{(item.comment.length > 0 ? (item.comment + '回复 ') : '') + (item.heart.length > 0 ? (item.heart + '赞 ') : '') + (item.picture.length > 0 ? (item.picture + '图片 ') : '')}</Text>
                        </View>

                    </View>
                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    };

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
                    this.getNewBoardExperience(this._page);
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
                        this.getNewBoardExperience(this._page);
                    }
                    }
                    onEndReached={() => {
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                            this.setState({
                                pullMoreLoading: true
                            });
                            this._page = this._page + 1;
                            this.getNewBoardExperience(this._page);
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
    get flatList() {
        return {
            // flex: 1,
        }
    },
    get itemContainer() {
        return {
            flex: 1,
            flexDirection: 'column',
            padding: global.constants.Padding,
            backgroundColor: global.colors.whiteColor
        }
    },
    get itemName() {
        return {
            marginLeft: 10,
            fontSize: global.configures.fontSize15,
            color: global.colors.fontColor
        }
    },
    get itemTime() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize13,
            color: global.colors.gray2Color
        }
    },
    get itemTitle() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize17,
            fontWeight: 'bold',
            color: global.colors.fontColor
        }
    },
    get itemContent() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize15,
            color: global.colors.fontColor
        }
    },
    get itemDescript() {
        return {
            marginTop: 10,
            marginLeft: -2,
            fontSize: global.configures.fontSize13,
            color: global.colors.gray2Color
        }
    },
}
