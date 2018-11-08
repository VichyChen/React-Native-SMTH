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
    NavigationBar
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';

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
        NetworkManager.net_GetMail(this.props.navigation.state.params.message.position, (result) => {
            this.setState({
                screenStatus: global.screen.none,
                author_id: result['mail'].author_id,
                subject: result['mail'].subject,
                time: result['mail'].time,
                body: result['mail'].body.trim(),
            });
        }, (error) => {
            ToastUtil.info(error);
            this.setState({
                screenStatus: global.screen.textImage,
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
                <Screen
                    showLoading={this.state.viewLoading}
                    loadingType={'background'}
                    text={this.state.screenText}
                    onPress={() => {
                        this.setState({
                            viewLoading: true,
                            loadingType: 'background',
                            screenText: null
                        });
                        this.net_GetMail();
                    }}
                >
                    <ScrollView style={{ height: Dimensions.get('window').height - 64, }}>
                        <Text style={styles.subject}>
                            {this.state.subject}
                        </Text>
                        <HorizontalSeperatorLine />
                        <View style={{ flexDirection: 'row', padding: 13, backgroundColor: global.colors.whiteColor }}>
                            <AvatorImage
                                style={styles.avator}
                                widthAndHeight={40}
                                borderRadius={20}
                                onPressClick={() => {
                                    this.props.navigation.navigate('userScreen', { id: this.state.author_id });
                                }}
                                uri={NetworkManager.net_getFace(this.state.author_id)} />
                            <View style={{ height: 42 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 24 }}>
                                    <Text style={styles.author}>{this.state.author_id}</Text>
                                </View>
                                <Text style={styles.time}>{DateUtil.formatTimeStamp(this.state.time)}</Text>
                            </View>
                        </View>
                        <Text style={styles.body}>{this.state.body}</Text>
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
            fontWeight: 'bold',
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

