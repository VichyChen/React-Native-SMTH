/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
    TouchableHighlight,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';

import {
    NetworkManager,
    DateUtil,
    SeperatorLine,
    HorizontalSeperatorLine,
    SectionHeader,
    CellBackground,
    LoginView,
    LoadingView,
    Screen,
    Toast,
    ToastUtil,
    AvatorImage
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';
import cio from 'cheerio-without-node-native';
import AutoHeightImage from 'react-native-auto-height-image';

var _array;

export default class NewPictureListScreen extends Component {

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
        this.doubleClickHotScreenNotification = DeviceEventEmitter.addListener('DoubleClickHotScreenNotification', () => {
            if (this.props.selected == true) {
                this.setState({
                    pullLoading: true,
                });
                setTimeout(() => {
                    this.refs.flatList.scrollToOffset({ offset: -64, animated: true })
                }, 50);
                setTimeout(() => {
                    this._page = 1;
                    this.getNewAlbum(this._page);
                }, 1000);
            }
        });

        this.getNewAlbum(this._page);
    }

    componentWillUnmount() {
        this.doubleClickHotScreenNotification.remove();
    }

    getNewAlbum(page) {
        NetworkManager.getNewAlbum(page, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('div[class=container]').last().html());

            var array = [];
            if (page != 1) {
                array = array.concat(this.state.dataArray);
            }
            this.$('div[class=row]').each(function (i, elem) {
                this.$ = cio.load(elem);
                var images = this.$('ul[class=list-inline]').html();
                var attachment_list = [];
                if (images != null) {
                    this.$ = cio.load(this.$('ul[class=list-inline]').html(), { decodeEntities: false });
                    this.$('li').each(function (i, elem) {
                        this.$ = cio.load(elem, { decodeEntities: false });
                        attachment_list.push({
                            key: attachment_list.length,
                            url: this.$('img').attr('src')
                        });
                    });
                }

                this.$ = cio.load(elem);
                array.push({
                    key: i + ((page - 1) * 20),
                    id: this.$('div[class=caption]').children().first().children().first().attr('href').split('/')[2],
                    title: this.$('div[class=caption]').children().first().children().first().text(),
                    boardName: this.$('p').first().children().first().text(),
                    boardTitle: this.$('p').first().children().first().next().text(),
                    time: this.$('p').first().text().split('#')[3],
                    attachment_list: attachment_list,
                });
            });

            this.setState({
                dataArray: array,
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: global.screen.none,
            });

        }, (error) => {
            ToastUtil.info(error);
            this.setState({
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.textImage : global.screen.none,
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

    _renderItem = ({ item }) => (
        <CellBackground
            onPress={() => {
                this.props.navigation.navigate('newThreadDetailScreen', { id: item.id });
            }}
        >
            <View>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    {

                        item.attachment_list.length == 1 ? (
                            <View style={[styles.imageView, {
                                marginTop: global.constants.Padding,
                                width: (global.constants.ScreenWidth - global.constants.Padding * 2) * 0.5,
                                backgroundColor: global.colors.backgroundGrayColor
                            }]} >
                                <AutoHeightImage
                                    style={{}}
                                    width={(global.constants.ScreenWidth - global.constants.Padding * 2) * 0.5}
                                    imageURL={'https://exp.newsmth.net' + item.attachment_list[0].url}
                                />
                            </View>
                        ) : (
                                item.attachment_list.length == 4 ? (
                                    <View style={[styles.imageView, { width: (global.constants.ScreenWidth - (global.constants.Padding * 2)) * 0.7 }]} >
                                        {
                                            item.attachment_list.map((image) => {
                                                return (
                                                    <Image style={[styles.image, {
                                                        width: Math.floor((((global.constants.ScreenWidth - (global.constants.Padding * 2)) * 0.8) - 30) / 3),
                                                        height: Math.floor((((global.constants.ScreenWidth - (global.constants.Padding * 2)) * 0.8) - 30) / 3),
                                                    }]} source={{ uri: 'https://exp.newsmth.net' + image.url, cache: 'force-cache' }} />
                                                );
                                            })
                                        }
                                    </View>
                                ) : (
                                        <View style={[styles.imageView, { width: (global.constants.ScreenWidth - (global.constants.Padding * 2)) * 0.8 }]} >
                                            {
                                                item.attachment_list.map((image) => {
                                                    return (
                                                        <Image style={[styles.image, {
                                                            width: Math.floor((((global.constants.ScreenWidth - (global.constants.Padding * 2)) * 0.8) - 30) / 3),
                                                            height: Math.floor((((global.constants.ScreenWidth - (global.constants.Padding * 2)) * 0.8) - 30) / 3),
                                                        }]} source={{ uri: 'https://exp.newsmth.net' + image.url, cache: 'force-cache' }} />
                                                    );
                                                })
                                            }
                                        </View>

                                    )
                            )
                    }
                    <Text style={styles.itemTime} >{item.time}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                        <Text style={[styles.itemBoard, { paddingTop: 1 }]} >{item.boardName}</Text>
                        <Text style={[styles.itemBoard, { marginLeft: 8, marginRight: 8, paddingTop: 3 }]} >{item.boardTitle}</Text>
                    </View>
                </View>
                <SeperatorLine />
            </View>
        </CellBackground>
    );

    render() {
        return (
            <View style={styles.container}>
                <HorizontalSeperatorLine />
                <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                    this.setState({
                        screenStatus: global.screen.loading,
                    });
                    this._page = 1;
                    this.getNewAlbum(this._page);
                }} >
                    <FlatList
                        ref="flatList"
                        data={this.state.dataArray}
                        renderItem={this._renderItem}
                        removeClippedSubviews={false}
                        extraData={this.state}
                        style={styles.flatList}
                        onRefresh={() => {
                            this.setState({
                                pullLoading: true
                            });
                            this._page = 1;
                            this.getNewAlbum(this._page);
                        }
                        }
                        onEndReached={() => {
                            if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                                this.setState({
                                    pullMoreLoading: true
                                });
                                this._page = this._page + 1;
                                this.getNewAlbum(this._page);
                            }
                        }}
                        onEndReachedThreshold={4}
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
        }
    },
    get itemContainer() {
        return {
            padding: global.constants.Padding,
            backgroundColor: global.colors.whiteColor,
        }
    },
    get itemTitle() {
        return {
            lineHeight: global.constants.LineHeight,
            fontSize: global.configures.fontSize17,
            fontWeight: 'bold',
            color: global.colors.fontColor
        }
    },
    get imageView() {
        return {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        }
    },
    get image() {
        return {
            marginRight: 10,
            marginTop: 10,
            backgroundColor: global.colors.backgroundGrayColor,
        }
    },
    get itemTime() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize13,
            color: global.colors.gray2Color
        }
    },
    get itemBoard() {
        return {
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

}