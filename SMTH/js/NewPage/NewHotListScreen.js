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

import codePush from 'react-native-code-push'
import cio from 'cheerio-without-node-native';

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
    NavigationBar
} from '../config/Common';


var _page = 1;

export default class NewHotListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            viewLoading: true,
            screenText: null,
            dataArray: [],
        }

        console.log('NewHotListScreen constructor');

        this.getNewHot(_page);
    }

    getNewHot(page) {
        NetworkManager.getNewHot(this.props.section, page, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('ul[class=article-list]').html());

            var array = [];
            this.$('li').each(function (i, elem) {
                this.$ = cio.load(elem);
                array.push({
                    key: this.$('a[class=article-subject]').attr('href').split('/')[2],
                    title: this.$('a[class=article-subject]').text(),
                });
            });

            if (array.length == 0) {
                if (this.state.viewLoading == true) {
                    this.setState({
                        pullLoading: false,
                        viewLoading: false,
                        screenText: '网络请求出错，请点击重试',
                    });
                }
                else {
                    this.setState({
                        pullLoading: false,
                        viewLoading: false,
                        screenText: null
                    });
                }
            }
            else {
                this.setState({
                    dataArray: array,
                    pullLoading: false,
                    viewLoading: false,
                    screenText: null
                });
            }
        }, (error) => {
            console.log('error111' + error);

        }, (errorMessage) => {
            console.log('errorMessage');

        });
    }


    _renderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    console.log('item.key:' + item.key);

                    this.props.navigation.navigate('newThreadDetailScreen', { id: item.key });
                }}
            >
                <View style={styles.container}>
                   
                   
                    <Text>{item.title}</Text>

                    {/* <Text style={[styles.subject, {
                        color: item.flags.toUpperCase() == 'DNN D' ||
                            item.flags.toUpperCase() == 'DNY D' ||
                            item.flags.toUpperCase() == 'DNN@D' ? 'red' : global.colors.fontColor,
                        fontWeight: item.flags.toUpperCase() == 'DNN D' ||
                            item.flags.toUpperCase() == 'DNY D' ||
                            item.flags.toUpperCase() == 'DNN@D' ? 'bold' : 'normal'
                    }]}>{item.subject + '(' + item.count + ')'}</Text>
                    <View style={styles.other}>
                        <Text style={styles.author}>{item.author_id}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.time}>{DateUtil.formatTimeStamp(item.time)}</Text>
                    </View> */}

                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    };

    render() {
        console.log('NewHotListScreen render');
        return (
            // <Screen
            //     showLoading={this.state.viewLoading}
            //     loadingType={'background'}
            //     text={this.state.screenText}
            //     onPress={() => {
            //         this.setState({
            //             viewLoading: true,
            //             screenText: null
            //         });
            //         this.getNewHot(_page);
            //     }}
            // >
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataArray}
                    renderItem={this._renderItem}
                    removeClippedSubviews={false}
                    extraData={this.state}
                    style={styles.flatList}
                    onRefresh={() => {
                        this.setState({
                            pullLoading: true
                        });
                        page = 1;
                        this.getNewHot(_page);
                    }
                    }
                    onEndReached={() => {
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                            this.setState({
                                pullMoreLoading: true
                            });
                            _page++;
                            this.getNewHot(_page);
                        }
                    }
                    }
                    onEndReachedThreshold={0.2}
                    refreshing={this.state.pullLoading}
                />
            </View>
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
            backgroundColor: global.colors.whiteColor
        }
    },
    
}
