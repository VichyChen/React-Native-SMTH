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
    StatusBar
} from 'react-native';

import {
    NetworkManager,
    NavigatorTitleButton,
    SectionBlankHeader,
    ToastUtil,
    HorizontalSeperatorLine,
    Screen,
    NavigationBar
} from '../config/Common';

var _user
var _title;
var _content;

export default class NewMessageSendScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            user: this.props.navigation.state.params == null ? '' : this.props.navigation.state.params.user,
            title: this.props.navigation.state.params == null ? '' : this.props.navigation.state.params.title,
            content: this.props.navigation.state.params == null ? '' : this.props.navigation.state.params.content,
        }
        _user = this.state.user;
        _title = this.state.title;
        _content = this.state.content;
    }

    PostMail() {
        if (_user.length == 0) {
            ToastUtil.info('请输入用户');
            return;
        }
        if (_title.length == 0 || _content.length == 0) {
            ToastUtil.info('请输入标题和内容');
            return;
        }
        if (this.state.isLoading == true) return;
        this.setState({
            isLoading: true,
        });
        NetworkManager.net_PostMail(_user, _title, _content, (result) => {
            this.props.navigation.goBack();
        }, (error) => {
            this.setState({
                isLoading: false,
            });
            ToastUtil.error(error);
        }, (errorMessage) => {
            this.setState({
                isLoading: false,
            });
            ToastUtil.error(errorMessage);
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />

                <NavigationBar
                    navigation={this.props.navigation}
                    title='消息'
                    showBackButton={true}
                    showBottomLine={true}
                    rightButtonTitle={'确定'}
                    rightButtonOnPress={() => {
                        this.PostMail();
                    }}
                />

                <Screen showLoading={this.state.isLoading} loadingType={'clear'} >
                    <ScrollView style={styles.scrollView} keyboardDismissMode={'on-drag'} >
                        <TextInput
                            ref="titleTextInput"
                            style={styles.titleInput}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            spellCheck={false}
                            placeholder={'输入用户名'}
                            placeholderTextColor={global.colors.gray3Color}
                            onChangeText={(text) => { this.setState({ user: text }); _user = text; }}
                            value={this.state.user}
                        />
                        <HorizontalSeperatorLine />
                        <TextInput
                            ref="titleTextInput"
                            style={styles.titleInput}
                            underlineColorAndroid={'transparent'}
                            autoCorrect={false}
                            spellCheck={false}
                            placeholder={'输入标题'}
                            placeholderTextColor={global.colors.gray3Color}
                            autoCapitalize={'none'}
                            onChangeText={(text) => { this.setState({ title: text }); _title = text; }}
                            value={this.state.title}
                        />
                        <HorizontalSeperatorLine />
                        <TextInput
                            style={styles.contentInput}
                            underlineColorAndroid={'transparent'}
                            multiline={true}
                            autoFocus={false}
                            autoCorrect={false}
                            spellCheck={false}
                            placeholder={'输入内容...'}
                            placeholderTextColor={global.colors.gray3Color}
                            autoCapitalize={'none'}
                            selection={this.state.selection}
                            onSelectionChange={(event) => this.setState({ selection: event.nativeEvent.selection })}
                            onFocus={() => this.setState({ selection: { start: 0, end: 0 } })}
                            onChangeText={(text) => { this.setState({ content: text }); _content = text; }}
                            value={this.state.content}
                        />
                    </ScrollView>
                </Screen>
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
    get scrollView() {
        return {
            backgroundColor: global.colors.whiteColor,
            paddingHorizontal: global.constants.Padding,
            height: global.constants.ScreenHeight - global.constants.NavigationBarHeight
        }
    },
    get titleInput() {
        return {
            height: 44,
            padding: 0,
            backgroundColor: global.colors.whiteColor,
            borderColor: global.colors.clearColor,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get contentInput() {
        return {
            height: 150,
            paddingTop: global.constants.Padding,
            backgroundColor: global.colors.whiteColor,
            borderColor: global.colors.clearColor,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            textAlignVertical: 'top'
        }
    },
}
