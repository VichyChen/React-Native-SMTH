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
        NetworkManager.getNewHot(this.props.section, page, () => {
            this.$ = cio.load(result);
            this.$ = cio.load('<ul class="article-list">...</ul>');
            var array = [];
            console.log('success');

            this.$('li').each(function (i, elem) {

                console.log(elem);

                // array.push({
                //     typeText: elem.children[0].children[0].data,
                //     type: elem.children[0].next.next.attribs.href.split('/')[1],
                //     href: elem.children[0].next.next.attribs.href,
                //     id: elem.children[0].next.next.attribs.href.split('/')[2],
                //     text: elem.children[0].next.next.children[0].data
                // });

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
                for (var i = 0; i < array.length; i++) {
                    array[i].key = i;
                }
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
                    this.props.navigation.navigate('threadDetail', { id: item.id, board: item.board_id, subject: item.subject })
                }}
            >
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', padding: 13 }}>
                        <AvatorImage
                            style={styles.avator}
                            borderRadius={20}
                            widthAndHeight={40}
                            onPressClick={() => {
                                this.props.navigation.navigate('userScreen', { id: item.author_id });
                            }}
                            uri={NetworkManager.net_getFace(item.author_id)} />
                        <View style={{ height: 42 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', height: 24 }}>
                                <Text style={styles.author}>{item.author_id}</Text>
                            </View>
                            <Text style={styles.time}>
                                {DateUtil.formatTimeStamp(item.time) + '     ' + item.count + '回复'}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.subject, {
                        color: item.flags.toUpperCase() == 'DNN D' ||
                            item.flags.toUpperCase() == 'DNY D' ||
                            item.flags.toUpperCase() == 'DNN@D' ? 'red' : global.colors.fontColor,
                        fontWeight: item.flags.toUpperCase() == 'DNN D' ||
                            item.flags.toUpperCase() == 'DNY D' ||
                            item.flags.toUpperCase() == 'DNN@D' ? 'bold' : 'normal'
                    }]}>{item.subject}</Text>

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
            <Screen
                showLoading={this.state.viewLoading}
                loadingType={'background'}
                text={this.state.screenText}
                onPress={() => {
                    this.setState({
                        viewLoading: true,
                        screenText: null
                    });
                    this.getNewHot(_page);
                }}
            >
                <FlatList
                    data={this.state.dataArray}
                    renderItem={this._renderItem}
                    removeClippedSubviews={false}
                    extraData={this.state}
                    style={{ backgroundColor: global.colors.backgroundGrayColor, }}
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
                            from = from + size;
                            this.getNewHot(_page);
                        }
                    }
                    }
                    onEndReachedThreshold={0.2}
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
            padding: 0,
            backgroundColor: global.colors.clearColor
        }
    },

}
