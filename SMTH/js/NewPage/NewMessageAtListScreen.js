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
    Screen,
    HorizontalSeperatorLine,
    SeperatorLine,
    CellBackground,
    AvatorImage,
    DateUtil,
    NavigatorTitleButton,
    ToastUtil,
    ReactNavigation
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';
import cio from 'cheerio-without-node-native';

export default class NewMessageAtListScreen extends Component {

    page = 1;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
            totalCount: 0,
            totalPage: 0,
        }

        this.page = 1;
        this.getNewSMTHAt(this.page);
    }

    getNewSMTHAt(page) {
        NetworkManager.getNewSMTHAt(page, (result) => {
            this.$ = cio.load(result);
            var totalCount = this.$('li[class=page-pre]').first().children().first().text();

            this.$ = cio.load(this.$('table[class=m-table]').html());
            var dataArray = [];
            if (page != 1) {
                dataArray = dataArray.concat(this.state.dataArray);
            }
            this.$('tr').each(function (i, elem) {
                this.$ = cio.load(elem);
                if (i != 0) {
                    dataArray.push({
                        key: page * 20 + i,
                        user_id: this.$('td').first().next().children().first().text(),
                        board_id: this.$('td').first().next().next().children().first().text(),
                        subject: this.$('td').first().next().next().next().children().first().text(),
                        time: this.$('td').last().text(),
                        url: this.$('td').first().next().next().next().children().first().attr('href'),
                        isRead: true,
                    });
                }
            });

            this.setState({
                dataArray: dataArray,
                totalCount: totalCount,
                totalPage: totalCount % 20 == 0 ? (totalCount / 20) : (totalCount / 20 + 1),
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: dataArray.length == 0 ? global.screen.text : global.screen.none,
                screenText: dataArray.length == 0 ? '不存在任何文章' : null
            });
        }, (error) => {
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
                    ReactNavigation.navigate(this.props.navigation, 'threadDetail', { id: item.re_id, board: item.board_id, subject: item.subject })
                }}
            >
                <View>
                    <View style={{ padding: global.constants.Padding, backgroundColor: global.colors.whiteColor }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <AvatorImage style={styles.avator}
                                borderRadius={15}
                                widthAndHeight={30}
                                onPressClick={() => {
                                    ReactNavigation.navigate(this.props.navigation, 'newUserScreen', { id: null, name: item.user_id });
                                }}
                                uri={NetworkManager.net_getFace(item.user_id)} />
                            <Text style={[CommonCSS.listName, { marginLeft: 10 }]}>{item.user_id}</Text>
                        </View>
                        <Text style={[CommonCSS.listTime, { marginTop: 10 }]}>{item.time}</Text>
                        <Text style={[CommonCSS.listOnlyTitle, { marginTop: 10 }]}>{item.subject}</Text>

                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                            <Text style={[CommonCSS.listBoardEN]} >{item.board_id}</Text>
                            {
                                global.boards.all[item.board_id] == null ? null :
                                    (
                                        <Text style={[CommonCSS.listBoardCH, { marginLeft: 8 }]} >{global.boards.all[item.board_id].name}</Text>
                                    )
                            }
                        </View>
                    </View>
                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    };

    render() {
        return (
            <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                this.setState({
                    screenStatus: global.screen.loading,
                });
                this.getNewSMTHAt(this.page);
            }} >
                <View style={[styles.content]}>
                    <FlatList
                        ref="flatList"
                        data={this.state.dataArray}
                        renderItem={this._renderItem}
                        removeClippedSubviews={false}
                        extraData={this.state}
                        style={[styles.flatList]}
                        onRefresh={() => {
                            this.setState({
                                pullLoading: true
                            });
                            this.page = 1;
                            this.getNewSMTHAt(this.page);
                        }}
                        onEndReached={() => {
                            if (this.state.pullLoading == false && this.state.pullMoreLoading == false && this.page + 1 <= this.state.totalPage) {
                                this.setState({
                                    pullMoreLoading: true
                                });
                                this.page++;
                                this.getNewSMTHAt(this.page);
                            }
                        }}
                        onEndReachedThreshold={0.2}
                        refreshing={this.state.pullLoading}
                    />
                </View>
            </Screen>
        );
    }
}

var styles = {
    get tab() {
        return {
            height: 48,
        }
    },
    get scrollView() {
        return {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 64 - 48,
        }
    },
    get flatList() {
        return {
            // backgroundColor: global.colors.whiteColor
        }
    },
    get content() {
        return {

            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 64 - 48,
            backgroundColor: global.colors.whiteColor
        }
    },
    get avator() {
        return {
            width: 40,
            height: 40,
        }
    },
    get author() {
        return {
            marginLeft: 10,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get time() {
        return {
            marginLeft: 10,
            height: 19,
            fontSize: global.configures.fontSize14,
            color: global.colors.gray2Color,
        }
    },
    get body() {
        return {
            marginLeft: 13,
            marginRight: 13,
            marginBottom: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get board() {
        return {
            position: 'absolute',
            top: 13,
            right: 13,
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.backgroundGrayColor,
            borderRadius: 10,
        }
    },
}
