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
    DeviceEventEmitter,
    Dimensions
} from 'react-native';

import {
    DateUtil,
    NetworkManager,
    AvatorImage,
    SectionBlankHeader,
    CellBackground,
    SeperatorLine,
    Screen,
    HorizontalSeperatorLine,
    NavigationBar,
    ReactNavigation,
    ToastUtil
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';

import AsyncStorageManger from '../storage/AsyncStorageManger';
import HTMLView from 'react-native-htmlview';

export default class NewMessageMailDetailScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            screenStatus: global.screen.loading,
            screenText: null,
            author_id: '',
            subject: '',
            time: '',
            body: '',
        }

        this.net_GetMail();
    }

    net_GetMail() {
        NetworkManager.getNewSMTHMailDetail(this.props.navigation.state.params.message.url, (result) => {

            var subject = result['content'].split('标&nbsp;&nbsp;题:')[1].split('<br /> 发信站:')[0];
            var author_id = result['content'].split('寄信人: ')[1].split('<br /> 标&nbsp;&nbsp;题:')[0].split(' (')[0];
            var time = result['content'].split('发信站: 水木社区 (')[1].split(') <br /> 来&nbsp;&nbsp;源:')[0].replace('&nbsp;&nbsp;', ' ');
            var content = '<p>' + result['content'].split(result['content'].split('<br />&nbsp;&nbsp;<br /> ')[0] + '<br />&nbsp;&nbsp;<br /> ')[1].replace('&nbsp;', '').replace('', '') + '</p>';

            this.setState({
                screenStatus: global.screen.none,
                author_id: author_id,
                subject: subject,
                time: time,
                body: content,
            });
        }, (error) => {
            ToastUtil.info(error.message);
            this.setState({
                screenStatus: global.screen.error,
            });
        }, (errorMessage) => {
            ToastUtil.info(errorMessage);
            this.setState({
                screenStatus: global.screen.networkError,
            });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    navigation={this.props.navigation}
                    title='收件箱'
                    showBackButton={true}
                    showBottomLine={true} 
                    rightButtonTitle={'回复'}
                    rightButtonOnPress={() => {
                        ReactNavigation.navigate(this.props.navigation, 'newMessageSendScreen', { user: this.state.author_id, title: 'Re:' + this.state.subject })
                    }} />
                <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                    this.setState({
                        screenStatus: global.screen.loading,
                    });
                    this.net_GetMail();
                }}
                >
                    <ScrollView style={{ height: Dimensions.get('window').height - 64, }}>
                        <View style={{ flex: 1, padding: global.constants.Padding }}>
                            <Text style={CommonCSS.listTitle}>{this.state.subject}</Text>
                        </View>
                        <HorizontalSeperatorLine />
                        <View style={{ flex: 1, padding: global.constants.Padding }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: global.colors.whiteColor }}>
                                <AvatorImage style={styles.avator}
                                    borderRadius={10}
                                    widthAndHeight={20}
                                    onPressClick={() => {
                                        ReactNavigation.navigate(this.props.navigation, 'newUserScreen', { id: null, name: this.state.author_id });
                                    }}
                                    uri={NetworkManager.net_getFace(this.state.author_id)} />
                                <Text style={[CommonCSS.listName, { marginLeft: 10 }]} >{this.state.author_id}</Text>
                            </View>
                            <Text style={[CommonCSS.listTime, { marginTop: 10 }]}>{this.state.time}</Text>
                            {/* <Text style={[CommonCSS.content, { marginTop: 10 }]}>{this.state.body}</Text> */}

                            <HTMLView style={[{ marginTop: 10, marginLeft: -2, marginRight: -2,  }]} stylesheet={styles.content} value={this.state.body} />

                        </View>
                    </ScrollView>
                </Screen>
            </View>
        );
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            backgroundColor: global.colors.whiteColor
        }
    },
    get subject() {
        return {
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 13,
            marginRight: 13,
            fontSize: global.configures.fontSize19,
            fontWeight: '600',
            color: global.colors.fontColor,
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
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get content() {
        return {
            p: {
                marginBottom: -15,
                lineHeight: global.constants.LineHeight,
                fontSize: global.configures.fontSize17,
                color: global.colors.fontColor,
            },
            a: {
                color: global.colors.fontColor,
            }
        }
    },
}

