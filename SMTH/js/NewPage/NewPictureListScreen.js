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
    DeviceEventEmitter,
    Modal,
    ActivityIndicator
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
    AvatorImage,
    ReactNavigation,
    GDTNativeExpressView
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';
import cio from 'cheerio-without-node-native';
import AutoHeightImage from 'react-native-auto-height-image';
import { CommonCSS } from 'CommonCSS';
import { NativeModules } from 'react-native';
import uuid from 'uuid';
import { CachedImage } from "react-native-img-cache";

export default class NewPictureListScreen extends Component {

    _page = 1;
    _width = Math.floor((((global.constants.ScreenWidth - (global.constants.Padding * 2))) - 20) / 3);
    _height = Math.floor((((global.constants.ScreenWidth - (global.constants.Padding * 2))) - 20) / 3);
    _adTag = [300, 301, 302, 303];

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
            adheight: { '300': 0, '301': 0, '302': 0, '303': 0 },
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
                    var nativeExpressAdManager = NativeModules.GDTNativeExpressAdManager;
                    nativeExpressAdManager.remove(this._adTag);
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
                            url: this.$('img').attr('src'),
                        });
                    });
                }

                this.$ = cio.load(elem);
                var index = i + ((page - 1) * 20);
                array.push({
                    key: index,
                    type: 'image',
                    id: this.$('div[class=caption]').children().first().children().first().attr('href').split('/')[2],
                    title: this.$('div[class=caption]').children().first().children().first().text(),
                    boardName: this.$('p').first().children().first().text(),
                    boardTitle: this.$('p').first().children().first().next().text(),
                    time: this.$('p').first().text().split('#')[3],
                    attachment_list: attachment_list,
                });

                if ([10, 20, 30, 40].indexOf(index) != -1) {
                    array.push({
                        key: 'ad' + uuid.v4(),
                        type: 'ad',
                        adTag: { '10': 300, '20': 301, '30': 302, '40': 303 }[index.toString()],
                    });
                }
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
        if (item.type == 'ad') {
            return (
                <View>
                    <GDTNativeExpressView
                        style={{ height: this.state.adheight[item.adTag.toString()] }}
                        adType={1}
                        adTag={item.adTag}
                        onRenderSuccess={(event) => {
                            this.state.adheight[item.adTag.toString()] = event.nativeEvent.height;
                            this.setState({
                                adheight: this.state.adheight,
                            });
                        }}
                    />
                    <SeperatorLine />
                </View>
            );
        }
        else {
            return (
                <CellBackground
                    onPress={() => {
                        ReactNavigation.navigate(this.props.navigation, 'newThreadDetailScreen', { id: item.id });
                    }}
                >
                    <View>
                        <View style={styles.itemContainer}>
                            <Text style={CommonCSS.listOnlyTitle}>{item.title}</Text>

                            <View style={[styles.imageView, { width: (global.constants.ScreenWidth - (global.constants.Padding * 2)) + 10 }]} >
                                {
                                    item.attachment_list.length > 0 ?
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                var array = [];
                                                for (var i = 0; i < item.attachment_list.length; i++) {
                                                    array.push({
                                                        url: ('https://exp.newsmth.net/' + item.attachment_list[i].url)
                                                        // url: ('https://exp.newsmth.net/' + (item.attachment_list[i].url).replace('?w=300&amp;h=400', ''))
                                                    });
                                                }
                                                DeviceEventEmitter.emit('ShowImagesNotification', { images: array, index: 0 });
                                            }}>
                                            <CachedImage style={[styles.image, {
                                                width: this._width,
                                                height: this._height,
                                            }]} source={{ uri: 'https://exp.newsmth.net' + item.attachment_list[0].url }} />
                                        </TouchableWithoutFeedback>
                                        : null
                                }
                                {
                                    item.attachment_list.length > 1 ?
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                var array = [];
                                                for (var i = 0; i < item.attachment_list.length; i++) {
                                                    array.push({
                                                        url: ('https://exp.newsmth.net/' + item.attachment_list[i].url)
                                                        // url: ('https://exp.newsmth.net/' + (item.attachment_list[i].url).replace('?w=300&amp;h=400', ''))
                                                    });
                                                }
                                                DeviceEventEmitter.emit('ShowImagesNotification', { images: array, index: 1 });
                                            }}>
                                            <CachedImage style={[styles.image, {
                                                width: this._width,
                                                height: this._height,
                                            }]} source={{ uri: 'https://exp.newsmth.net' + item.attachment_list[1].url }} />
                                        </TouchableWithoutFeedback>
                                        : null
                                }
                                {
                                    item.attachment_list.length > 2 ?
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                var array = [];
                                                for (var i = 0; i < item.attachment_list.length; i++) {
                                                    array.push({
                                                        url: ('https://exp.newsmth.net/' + item.attachment_list[i].url)
                                                        // url: ('https://exp.newsmth.net/' + (item.attachment_list[i].url).replace('?w=300&amp;h=400', ''))
                                                    });
                                                }
                                                DeviceEventEmitter.emit('ShowImagesNotification', { images: array, index: 2 });
                                            }}>
                                            <CachedImage style={[styles.image, {
                                                width: this._width,
                                                height: this._height,
                                            }]} source={{ uri: 'https://exp.newsmth.net' + item.attachment_list[2].url }} />
                                        </TouchableWithoutFeedback>
                                        : null
                                }
                            </View>


                            {/* {

                                item.attachment_list.length == 1 ? (
                                    <View style={[styles.imageView, {
                                        marginTop: global.constants.Padding,
                                        width: (global.constants.ScreenWidth - global.constants.Padding * 2) * 0.66,
                                        backgroundColor: global.colors.backgroundGrayColor
                                    }]} >
                                        <AutoHeightImage
                                            style={{}}
                                            width={(global.constants.ScreenWidth - global.constants.Padding * 2) * 0.66}
                                            imageURL={'https://exp.newsmth.net' + item.attachment_list[0].url}
                                        />
                                    </View>
                                ) : (
                                        item.attachment_list.length == 4 ? (
                                            <View style={[styles.imageView, { width: (global.constants.ScreenWidth - (global.constants.Padding * 2)) * 0.7 }]} >
                                                {
                                                    item.attachment_list.map((image, i) => {
                                                        return (
                                                            <Image key={i} style={[styles.image, {
                                                                width: this._width,
                                                                height: this._height,
                                                            }]} source={{ uri: 'https://exp.newsmth.net' + image.url, cache: 'force-cache' }} />
                                                        );
                                                    })
                                                }
                                            </View>
                                        ) : (
                                                <View style={[styles.imageView, { width: (global.constants.ScreenWidth - (global.constants.Padding * 2)) + 10 }]} >
                                                    {
                                                        item.attachment_list.map((image, i) => {
                                                            return (
                                                                <Image key={i} style={[styles.image, {
                                                                    width: this._width,
                                                                    height: this._height,
                                                                }]} source={{ uri: 'https://exp.newsmth.net' + image.url, cache: 'force-cache' }} />
                                                            );
                                                        })
                                                    }
                                                </View>

                                            )
                                    )
                            } */}
                            <Text style={[CommonCSS.listTime, { marginTop: 5 }]} >{item.time}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                                <Text style={[CommonCSS.listBoardEN]} >{item.boardName}</Text>
                                <Text style={[CommonCSS.listBoardCH, { marginLeft: 8, marginRight: 8 }]} >{item.boardTitle}</Text>
                                {
                                    item.attachment_list.length <= 3 ? null :
                                        <Text style={CommonCSS.listDescript} >{item.attachment_list.length + '图片'}</Text>
                                }

                            </View>
                        </View>
                        <SeperatorLine />
                    </View>
                </CellBackground>
            );
        }
    }

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
                        initialNumToRender={5}
                        renderItem={this._renderItem}
                        removeClippedSubviews={true}
                        extraData={this.state}
                        style={styles.flatList}
                        onRefresh={() => {
                            this.setState({
                                pullLoading: true
                            });
                            var nativeExpressAdManager = NativeModules.GDTNativeExpressAdManager;
                            nativeExpressAdManager.remove(this._adTag);
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
            fontWeight: '600',
            color: global.colors.fontColor
        }
    },
    get imageView() {
        return {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginTop: 5,
            marginBottom: 10,
        }
    },
    get image() {
        return {
            marginRight: 10,
            marginTop: 10,
            // backgroundColor: global.colors.backgroundGrayColor,
        }
    },
}