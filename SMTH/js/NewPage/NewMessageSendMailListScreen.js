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
    ToastUtil
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';

export default class NewMessageSendMailListScreen extends Component {

    from = 0;
    size = 20;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
        }

        this.from = 0;
        this.net_LoadMailSentList(this.from, this.size);
    }

    net_LoadMailSentList(from, size) {
        NetworkManager.net_LoadMailSentList(from, size, (result) => {
            for (var i = 0; i < result['mails'].length; i++) {
                result['mails'][i].key = from + i;
            }
            this.setState({
                dataArray: from == 0 ? result['mails'] : this.state.dataArray.concat(result['mails']),
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: global.screen.none,
                screenText: result['mails'].length == 0 ? '您没有任何邮件' : null
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
                    this.props.navigation.navigate('newMessageSendMailDetailScreen', { message: item })
                }}
            >
                <View>
                    <View style={{ padding: global.constants.Padding, backgroundColor: global.colors.whiteColor }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <AvatorImage style={styles.avator}
                                borderRadius={15}
                                widthAndHeight={30}
                                onPressClick={() => {
                                    this.props.navigation.navigate('newUserScreen', { id: null, name: item.author_id });
                                }}
                                uri={NetworkManager.net_getFace(item.author_id)} />
                            <Text style={[CommonCSS.listName, { marginLeft: 10 }]}>{item.author_id}</Text>
                        </View>
                        <Text style={[CommonCSS.listTime, { marginTop: 10 }]}>{DateUtil.formatTimeStamp(item.time)}</Text>
                        <Text style={[CommonCSS.listOnlyTitle, { marginTop: 10 }]}>{item.subject}</Text>
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
                this.net_LoadMailSentList(this.from, this.size);
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
                            this.from = 0;
                            this.net_LoadMailSentList(this.from, this.size);
                        }}
                        onEndReached={() => {
                            if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                                this.setState({
                                    pullMoreLoading: true
                                });
                                this.from = this.from + this.size;
                                this.net_LoadMailSentList(this.from, this.size);
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
