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
    AvatorImage,
    ReactNavigation,
    GDTNativeExpressView
} from '../config/Common';

import { CommonCSS } from 'CommonCSS';

import cio from 'cheerio-without-node-native';
import { NativeModules } from 'react-native';
import uuid from 'uuid';

count = 0;

export default class NewSMTHBoardDetailScreen extends Component {

    _page = 1;
    _adTag = [400, 401, 402, 403];

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
            adheight: { '400': 0, '401': 0, '402': 0, '403': 0 },
        }
        count++;

        this.getNewSMTHBoardThreadList();
    }

    componentWillUnmount() {
        if (count == 1) {
            var nativeExpressAdManager = NativeModules.GDTNativeExpressAdManager;
            nativeExpressAdManager.remove(this._adTag);
        }
        count--;
    }

    getNewSMTHBoardThreadList() {
        NetworkManager.getNewSMTHBoardThreadList(this.props.board, 1, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('span[class=n-right]').html());

            var dataArray = [];
            this.$('a').each(function (i, elem) {
                this.$ = cio.load(elem);
                console.log(this.$().parent().html().split('">')[1].split('</a>')[0]);
                dataArray.push({
                    admin: this.$().parent().html().split('">')[1].split('</a>')[0],
                });
            });

            this.$ = cio.load(result);

            this.setState({
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: global.screen.none,
                totalThreadCount: this.$('li[class=page-pre]').first().children().first().text(),
                todayCount: this.$('span[class=n-left]').text().split('今日帖数')[1].split(' 版面积分')[0],
                onlineCount: this.$('span[class=n-left]').text().split('人在线[')[0].split('本版当前共有')[1],
                maxOnlineCount: this.$('span[class=n-left]').children().first().text(),
                maxOnlineCountTime: this.$('span[class=n-left]').children().first().attr('title'),
                boardScore: this.$('span[class=n-left]').text().split('版面积分:')[1],
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
                        adType={0}
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
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <AvatorImage
                                    style={styles.avator}
                                    borderRadius={20}
                                    widthAndHeight={40}
                                    onPressClick={() => {
                                        ReactNavigation.navigate(this.props.navigation, 'userScreen', { id: item.authorID });
                                    }}
                                    uri={NetworkManager.net_getFace(item.authorID)} />

                                <Text style={[CommonCSS.listName, { marginLeft: 10 }]} >{item.authorID}</Text>
                            </View>
                            <Text style={[CommonCSS.listTime, { marginTop: 10 }]} >{item.time}</Text>
                            <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{item.title}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                                <Text style={[CommonCSS.listDescript, { marginTop: 10, marginLeft: -2, }]} >{(item.score.length > 0 ? (item.score + '评分 ') : '') + (item.like.length > 0 ? (item.like + 'Like ') : '') + (item.comment.length > 0 ? (item.comment + '回复 ') : '')}</Text>
                            </View>
                        </View>
                        <SeperatorLine />
                    </View>
                </CellBackground>
            )
        }
    };

    render() {
        return (
            <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                this.setState({
                    screenStatus: global.screen.loading,
                });
                this._page = 1;
                this.getNewSMTHBoardThreadList();
            }} >
                <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{'totalThreadCount:'+this.state.totalThreadCount}</Text>
                <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{'todayCount:'+this.state.todayCount}</Text>
                <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{'onlineCount:'+this.state.onlineCount}</Text>
                <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{'maxOnlineCount:'+this.state.maxOnlineCount}</Text>
                <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{'maxOnlineCountTime:'+this.state.maxOnlineCountTime}</Text>
                <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{'boardScore:'+this.state.boardScore}</Text>



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
}
