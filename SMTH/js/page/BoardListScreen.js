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

var from = 0;
var size = 20;

export default class BoardListScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params == undefined ? '版块' : (navigation.state.params.text == null ? navigation.state.params.id : navigation.state.params.text)}`,
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                {/* <NavigatorTitleButton style={styles.avator}
                    onPressClick={() => {
                        NetworkManager.net_JoinMember(navigation.state.params.id, (result) => {

                        });
                    }}
                    title='驻版' /> */}
                <NavigatorTitleButton
                    color={global.colors.whiteColor}
                    fontSize={16}
                    onPressClick={() => {
                        NetworkManager.net_AddFav(navigation.state.params.id, (result) => {
                            ToastUtil.info('收藏成功');
                        }, (error) => {
                            ToastUtil.error('收藏失败');
                        }, (errorMessage) => {
                            ToastUtil.error(errorMessage);
                        });
                    }}
                    title='收藏' />
                <NavigatorTitleButton
                    color={global.colors.whiteColor}
                    fontSize={16}
                    onPressClick={() => {
                        navigation.navigate('postThreadScreen', { board: navigation.state.params.id });
                    }}
                    title='发帖' />
            </View>
        ),
    });

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
        from = 0;
        this.net_LoadThreadList(from, size);
    }

    net_LoadThreadList(from, size) {
        NetworkManager.net_LoadThreadList(this.props.navigation.state.params == undefined ? '' : this.props.navigation.state.params.id, from, size, 2, (result) => {
            for (var i = 0; i < result['threads'].length; i++) {
                result['threads'][i].key = from + i;
            }
            this.setState({
                dataArray: from == 0 ? result['threads'] : this.state.dataArray.concat(result['threads']),
                pullLoading: false,
                pullMoreLoading: false,
                viewLoading: false,
                screenText: null
            });
        }, (error) => {
            if (this.state.viewLoading == true) {
                this.setState({
                    pullLoading: false,
                    pullMoreLoading: false,
                    viewLoading: false,
                    screenText: error
                });
            }
            else {
                ToastUtil.info(error);
                this.setState({
                    pullLoading: false,
                    pullMoreLoading: false,
                    viewLoading: false,
                    screenText: null
                });
            }
        }, (errorMessage) => {
            if (this.state.viewLoading == true) {
                this.setState({
                    pullLoading: false,
                    pullMoreLoading: false,
                    viewLoading: false,
                    screenText: errorMessage + '，请点击重试'
                });
            }
            else {
                ToastUtil.info(errorMessage);
                this.setState({
                    pullLoading: false,
                    pullMoreLoading: false,
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
                    this.net_LoadThreadList(from, size);
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
                        from = 0;
                        this.net_LoadThreadList(from, size);
                    }
                    }
                    onEndReached={() => {
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                            this.setState({
                                pullMoreLoading: true
                            });
                            from = from + size;
                            this.net_LoadThreadList(from, size);
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
            paddingLeft: 13,
            paddingRight: 13,
            paddingBottom: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            backgroundColor: global.colors.whiteColor
        }
    },
    get other() {
        return {
            flexDirection: 'row',
            padding: 13,
            backgroundColor: global.colors.whiteColor
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
            marginLeft: 10,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get time() {
        return {
            marginLeft: 10,
            height: 19,
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
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize14,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.whiteColor
        }
    },
}
