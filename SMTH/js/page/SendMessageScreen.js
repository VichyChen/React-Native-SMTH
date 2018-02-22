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
    NavigatorTitleButton,
    SectionBlankHeader,
    ToastUtil,
    Screen
} from '../config/Common';

var _user
var _title;
var _content;

export default class SendMessageScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '发送短信',
        headerRight: navigation.state.params ? navigation.state.params.headerRight : null
    });

    constructor(props) {
        super(props);

        var content = '';

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

    componentDidMount() {
        this.setBarItemButton();
    }

    setBarItemButton() {
        this.props.navigation.setParams({
            headerRight: (
                <NavigatorTitleButton
                    color={global.colors.whiteColor}
                    fontSize={16}
                    onPressClick={() => {
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
                    }}
                    title='发送' />
            )
        })
    }

    render() {
        return (
            <Screen showLoading={this.state.isLoading} loadingType={'clear'} >
                <ScrollView style={[styles.container, { height: Dimensions.get('window').height - 64 }]} keyboardDismissMode={'on-drag'} >
                    <Text style={styles.user}>用户：</Text>
                    <TextInput
                        ref="titleTextInput"
                        style={styles.titleInput}
                        underlineColorAndroid={'transparent'}
                        autoCorrect={false}
                        spellCheck={false}
                        onChangeText={(text) => { this.setState({ user: text }); _user = text; }}
                        value={this.state.user}
                    />
                    <Text style={styles.title}>标题：</Text>
                    <TextInput
                        ref="titleTextInput"
                        style={styles.titleInput}
                        underlineColorAndroid={'transparent'}
                        autoCorrect={false}
                        spellCheck={false}
                        autoCapitalize={'none'}
                        onChangeText={(text) => { this.setState({ title: text }); _title = text; }}
                        value={this.state.title}
                    />
                    <Text style={styles.content}>内容：</Text>
                    <TextInput
                        style={styles.contentInput}
                        underlineColorAndroid={'transparent'}
                        multiline={true}
                        autoFocus={false}
                        autoCorrect={false}
                        spellCheck={false}
                        autoCapitalize={'none'}
                        selection={this.state.selection}
                        onSelectionChange={(event) => this.setState({ selection: event.nativeEvent.selection })}
                        onFocus={() => this.setState({ selection: { start: 0, end: 0 } })}
                        onChangeText={(text) => { this.setState({ content: text }); _content = text; }}
                        value={this.state.content}
                    />
                </ScrollView>
            </Screen>
        )
    }
}

var styles = {
    get container() {
        return {
            backgroundColor: global.colors.backgroundGrayColor,
            padding: 13,
        }
    },
    get user() {
        return {
            marginBottom: 10,
            fontSize: global.configures.fontSize17,
            color: global.colors.gray1Color,
        }
    },
    get title() {
        return {
            marginTop: 10,
            marginBottom: 10,
            fontSize: global.configures.fontSize17,
            color: global.colors.gray1Color,
        }
    },
    get titleInput() {
        return {
            height: 35,
            padding: 0,
            backgroundColor: global.colors.whiteColor,
            borderColor: global.colors.clearColor,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get content() {
        return {
            marginTop: 10,
            marginBottom: 10,
            fontSize: global.configures.fontSize17,
            color: global.colors.gray1Color,
        }
    },
    get contentInput() {
        return {
            height: 150,
            padding: 0,
            backgroundColor: global.colors.whiteColor,
            borderColor: global.colors.clearColor,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            textAlignVertical: 'top'
        }
    },
}
