/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
    TouchableHighlight,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';

import {
    NavigationBar,
    TabPageView,
    NewMessageMailListScreen,
    NewMessageSendMailListScreen,
    NewMessageReplyListScreen,
    NewMessageAtListScreen
} from '../config/Common';

export default class NewMessageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    navigation={this.props.navigation}
                    title='消息'
                    showBackButton={true}
                    showBottomLine={false}
                    rightButtonTitle={'私信'}
                    rightButtonOnPress={() => {
                        this.props.navigation.navigate('newMessageSendScreen', {  })
                    }}
                />
                <TabPageView titles={['收件箱', '发件箱', '回复我', '@我']}
                    pages={[
                        (<NewMessageMailListScreen navigation={this.props.navigation} />),
                        (<NewMessageSendMailListScreen navigation={this.props.navigation} />),
                        (<NewMessageReplyListScreen navigation={this.props.navigation} />),
                        (<NewMessageAtListScreen navigation={this.props.navigation} />)]}
                />
            </View>
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
}