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
    NavigatorTitleButton
} from '../config/Common';

import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';

export default class NewMessageSendMailListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pullLoading2: false,
            viewLoading2: true,
            screenText2: null,
            dataArray: [],
            index: 0,
        }

        this.network(0);
    }

    network(index) {
        NetworkManager.net_LoadMailSentList(0, 20, (result) => {
            for (var i = 0; i < result['mails'].length; i++) {
                result['mails'][i].key = i;
            }
            this.setState({
                mailSentDataArray: result['mails'],
                pullLoading2: false,
                viewLoading2: false,
                screenText2: result['mails'].length == 0 ? '您没有任何邮件' : null
            });
            this.refs.flatList2.scrollToOffset({ offset: 0, animated: true });
        }, (error) => {
            if (this.state.viewLoading2 == true) {
                this.setState({
                    pullLoading2: false,
                    viewLoading2: false,
                    screenText2: error
                });
            }
            else {
                ToastUtil.info(error);
                this.setState({
                    pullLoading2: false,
                    viewLoading2: false,
                    screenText2: null
                });
            }
        }, (errorMessage) => {
            if (this.state.viewLoading2 == true) {
                this.setState({
                    pullLoading2: false,
                    viewLoading2: false,
                    screenText2: errorMessage + '，请点击重试'
                });
            }
            else {
                ToastUtil.info(errorMessage);
                this.setState({
                    pullLoading2: false,
                    viewLoading2: false,
                    screenText2: null
                });
            }
        });
    }

    _renderItem1 = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    this.props.navigation.navigate('newMessageSendMailDetailScreen', { message: item })
                }}
            >
                <View>
                    <View style={{ backgroundColor: global.colors.whiteColor }}>
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
                                    <Text style={styles.author}>
                                        {item.author_id}
                                    </Text>
                                </View>
                                <Text style={styles.time}>
                                    {DateUtil.formatTimeStamp(item.time)}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.body}>{item.subject}</Text>
                    </View>
                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    };

    render() {
        return (
            <View>
                <Screen showLoading={this.state.viewLoading2}
                    loadingType={'background'}
                    text={this.state.screenText2}
                    onPress={() => {
                        this.setState({
                            viewLoading2: true,
                            screenText2: null
                        });
                        this.network(1);
                    }}
                >
                    <View style={[styles.content]}>
                        <FlatList
                            ref="flatList2"
                            data={this.state.mailSentDataArray}
                            renderItem={this._renderItem1}
                            removeClippedSubviews={false}
                            extraData={this.state}
                            style={[styles.flatList]}
                            onRefresh={() => {
                                this.setState({
                                    pullLoading2: true
                                });
                                this.network(1);
                            }
                            }
                            refreshing={this.state.pullLoading2}
                        />
                    </View>
                </Screen>
            </View>
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
