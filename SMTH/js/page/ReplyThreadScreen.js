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
    DeviceEventEmitter
} from 'react-native';

import {
    NetworkManager,
    NavigatorTitleButton,
    SectionBlankHeader,
    ToastUtil,
    Screen
} from '../config/Common';

var _title;
var _content;

export default class ReplyThreadScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '回复帖子',
        headerRight: navigation.state.params ? navigation.state.params.headerRight : null
    });

    constructor(props) {
        super(props);

        var content = '';
        if (this.props.navigation.state.params.body.length > 0) {
            var array = this.props.navigation.state.params.body.split('\n');
            console.log(array);
            for (var i = 0; i < array.length - 2; i++) {
                if (i == 1) {
                    if (array.length == 4 && array[1] == '--' && array[2].length == 0 && array[3].length == 0) {

                    } else {
                        content += '\n: ' + array[i];
                    }
                }
                else if (i == 2) {
                    if (array.length == 5 && array[2] == '--' && array[3].length == 0 && array[4].length == 0) {

                    } else {
                        content += '\n: ' + array[i];
                    }
                }
                else if (i == 3) {
                    if (array.length > 4) {
                        content += '\n: ...................'
                    } else if (array.length == 4 && array[3].length != 0) {
                        content += '\n: ' + array[i];
                    }
                    else {

                    }
                    break;
                }
                else {
                    content += (i == 0 ? ': ' : '\n: ') + array[i];
                }
            }
        }

        this.state = {
            isLoading: false,
            title: 'Re: ' + this.props.navigation.state.params.subject,
            content: content.length > 0 ? '\r【 在 ' + this.props.navigation.state.params.author + ' 的大作中提到: 】\r' + '' + content : '',
        }
        _title = this.state.title;
        _content = this.state.content;
    }

    componentDidMount() {
        this.setBarItemButton('编辑');
    }

    setBarItemButton(title) {
        this.props.navigation.setParams({
            headerRight: (
                <NavigatorTitleButton
                    color={global.colors.whiteColor}
                    fontSize={16}
                    onPressClick={() => {
                        if (_title == null || _content == null) {
                            ToastUtil.info('请输入标题和内容');
                            return;
                        }
                        if (this.state.isLoading == true) return;
                        this.setState({
                            isLoading: true,
                        });
                        NetworkManager.net_ReplyArticle(this.props.navigation.state.params.board, this.props.navigation.state.params.id, _title, _content, (result) => {
                            DeviceEventEmitter.emit('ThreadRefreshNotification', this.props.navigation.state.params.mid);
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
                    title='回复' />
            )
        })
    }

    render() {
        return (
            <Screen showLoading={this.state.isLoading} loadingType={'clear'} >
                <ScrollView style={[styles.container, { height: Dimensions.get('window').height - 64 }]} keyboardDismissMode={'on-drag'} >
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
                        autoFocus={true}
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
    get title() {
        return {
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
