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
    SectionBlankHeader,
    AvatorImage,
    TitleValueItem,
    SeperatorLine,
    DateUtil,
    LoadingView,
    Screen,
    NavigatorTitleButton,
    CellBackground
} from '../config/Common';
import AsyncStorageManger from '../storage/AsyncStorageManger';

import cio from 'cheerio-without-node-native';

export default class UserThreadScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.id + ' 的主题',
    });

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            viewLoading: true,
            loadingType: 'background',
            screenText: null,
            dataArray: [],
        }


        this.getUserThread();
    }

    getUserThread() {
        NetworkManager.getUserThread(this.props.navigation.state.params.id, 1, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('.list').html());
            var array = [];
            this.$('tr').each(function (i, elem) {
                if (i != 0) {
                    array.push({
                        subject: elem.children[0].next.next.next.children[1].attribs.title,
                        board_id: elem.children[0].next.next.next.children[1].attribs.href.split('?')[1].split('&')[0].split('=')[1],
                        boardName: elem.children[5].children[0].children[0].data,
                        id: elem.children[0].next.next.next.children[1].attribs.href.split('?')[1].split('&')[1].split('=')[1],
                        time: elem.children[5].next.next.children[0].data,
                        author_id: elem.children[8].next.children[0].attribs.href.split('?')[1].split('=')[1],
                        count: elem.children[15].next == undefined ||
                            elem.children[15].next.next == undefined ||
                            elem.children[15].next.next.children[0] == undefined ? '0' : elem.children[15].next.next.children[0].data,
                    });
                }
            });

            if (array.length == 0) {
                this.setState({
                    dataArray: array,
                    pullLoading: false,
                    viewLoading: false,
                    screenText: this.props.navigation.state.params.id + ' 没有发布过主题'
                });
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
            if (this.state.viewLoading == true) {
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: error
                });
            }
            else {
                ToastUtil.info(error);
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: null
                });
            }
        }, (errorMessage) => {
            if (this.state.viewLoading == true) {
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: errorMessage + '，请点击重试'
                });
            }
            else {
                ToastUtil.info(errorMessage);
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: null
                });
            }
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
                    <Text style={styles.subject}>{item.subject}</Text>
                    <View style={styles.other}>
                        <Text style={styles.board}>{unescape(item.boardName)}</Text>
                        <Text style={styles.dot}>{' • ' + item.time + ' • ' + item.count + ' 回复'}</Text>
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
                loadingType={this.state.loadingType}
                text={this.state.screenText}
                onPress={() => {
                    this.setState({
                        viewLoading: true,
                        loadingType: 'background',
                        screenText: null
                    });
                    this.getUserThread();
                }}
            >
                <FlatList
                    data={this.state.dataArray}
                    renderItem={this._renderItem}
                    removeClippedSubviews={false}
                    extraData={this.state}
                    style={{ height: global.constants.ScreenHeight - 64 }}
                    onRefresh={() => {
                        this.setState({
                            pullLoading: true
                        });
                        this.getUserThread();
                    }
                    }
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
    get avator() {
        return {
            width: 40,
            height: 40,
        }
    },
    get subject() {
        return {
            padding: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get other() {
        return {
            flexDirection: 'row',
            paddingBottom: 13,
            paddingLeft: 13,
            paddingRight: 13,
        }
    },
    get board() {
        return {
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
    get author() {
        return {
            fontSize: global.configures.fontSize15,
            paddingTop: 3,
            height: 20,
            color: global.colors.gray2Color,
        }
    },
    get time() {
        return {
            marginLeft: 10,
            marginTop: 4,
            height: 20,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
        }
    },
    get countView() {
        return {
            flexDirection: 'row',
            position: 'absolute',
            top: 13,
            right: 13
        }
    },
    get countImage() {
        return {
            width: 14,
            height: 14,
            marginTop: 2,
            marginRight: 3,
            tintColor: global.colors.gray2Color
        }
    },
    get count() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
        }
    },
    get dot() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
        }
    },
}