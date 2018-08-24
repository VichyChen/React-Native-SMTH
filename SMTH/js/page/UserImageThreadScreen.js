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

export default class UserImageThreadScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.id + ' 的图片主题',
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

        this.getUserImageThread();
    }

    getUserImageThread() {
        NetworkManager.getUserImageThread(this.props.navigation.state.params.id, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('.images').html());
            var array = [];
            this.$('td[align=center]').each(function (i, elem) {
                array.push({
                    author_id: cio.load(elem)('table tr td div a').attr('title').split(',')[0].split(': ')[0] == '已删除' ? cio.load(elem)('table tr td div a').attr('title').split(',')[0].split(': ')[1] : cio.load(elem)('table tr td div a').attr('title').split(',')[0].split(': ')[0],
                    id: cio.load(elem)('table tr td div a').attr('href').split('?')[1].split('&')[1].split('=')[1],
                    subject: elem.children[5].children[1].children[0].data,
                    board_id: elem.children[3].children[1].attribs.href.split('?')[1].split('=')[1],
                    boardName: elem.children[3].children[1].children[0].data,
                    image: 'http://jinghuasoft.com/' + (cio.load(elem)('table tr td div a').attr('image-url')).replace(/.middle/, '.large'),
                    imageCount: cio.load(elem)('table tr td div span').text(),
                    count: elem.children[5].next.next.children[4].data,
                    remark: cio.load(elem)('div[align=center]').text(),
                });
            });

            if (array.length == 0) {
                this.setState({
                    dataArray: array,
                    pullLoading: false,
                    viewLoading: false,
                    screenText: this.props.navigation.state.params.id + ' 没有发布过图片主题'
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
                    <Image style={styles.image} resizeMode={'cover'} source={{ uri: item.image }} />
                    <View style={styles.cover}>
                        <Text style={styles.subject}>{item.subject}</Text>
                        <View style={styles.other}>
                            <Text style={styles.remark}>{unescape(item.boardName) + ' • ' + item.count + '回复' + ' • ' + item.imageCount}</Text>
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
                loadingType={this.state.loadingType}
                text={this.state.screenText}
                onPress={() => {
                    this.setState({
                        viewLoading: true,
                        loadingType: 'background',
                        screenText: null
                    });
                    this.getUserImageThread();
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
                        this.getUserImageThread();
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
    get cover() {
        return {
            backgroundColor: 'black',
            opacity: 0.6,
            position: 'absolute',
            bottom: 13,
            left: 13,
            width: global.constants.ScreenWidth - 26,
        }
    },
    get subject() {
        return {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize16,
            color: global.colors.whiteColor,
        }
    },
    get other() {
        return {
            flexDirection: 'row',
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 10,
        }
    },
    get image() {
        return {
            margin: 13,
            backgroundColor: global.colors.backgroundGrayColor,
            height: global.constants.ScreenWidth * 0.6,
            width: global.constants.ScreenWidth - 26,
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
    get remark() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.gray4Color,
        }
    },
}