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
    ReactNavigation
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';

import AsyncStorageManger from '../storage/AsyncStorageManger';

export default class NewMessageSendMailDetailScreen extends Component {

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

        this.net_GetMailSent();
    }

    net_GetMailSent() {
        NetworkManager.net_GetMailSent(this.props.navigation.state.params.message.position, (result) => {
            this.setState({
                screenStatus: global.screen.none,
                author_id: result['mail'].author_id,
                subject: result['mail'].subject,
                time: result['mail'].time,
                body: result['mail'].body.trim(),
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
                    title='消息'
                    showBackButton={true}
                    showBottomLine={true} />
                <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                    this.setState({
                        screenStatus: global.screen.loading,
                    });
                    this.net_GetMailSent();
                }} >
                    <ScrollView style={{ height: Dimensions.get('window').height - 64, }}>
                        <View style={{ flex: 1, padding: global.constants.Padding }}>
                            <Text style={CommonCSS.listTitle}>{this.state.subject}</Text>
                        </View>
                        <HorizontalSeperatorLine />
                        <View style={{ flex: 1, padding: global.constants.Padding }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: global.colors.whiteColor }}>
                                <AvatorImage style={styles.avator}
                                    borderRadius={15}
                                    widthAndHeight={30}
                                    onPressClick={() => {
                                        ReactNavigation.navigate(this.props.navigation, 'newUserScreen', { id: null, name: this.state.author_id });
                                    }}
                                    uri={NetworkManager.net_getFace(this.state.author_id)} />
                                <Text style={[CommonCSS.listName, { marginLeft: 10 }]} >{this.state.author_id}</Text>
                            </View>
                            <Text style={[CommonCSS.listTime, { marginTop: 10 }]}>{DateUtil.formatTimeStamp(this.state.time)}</Text>
                            <Text style={[CommonCSS.content, { marginTop: 10 }]}>{this.state.body}</Text>
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
}

