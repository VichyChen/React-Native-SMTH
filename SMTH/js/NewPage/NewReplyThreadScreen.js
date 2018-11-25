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
    DeviceEventEmitter,
    StatusBar
} from 'react-native';

import {
    NetworkManager,
    NavigatorTitleButton,
    SectionBlankHeader,
    ToastUtil,
    Screen,
    Button,
    NavigationBar,
    SeperatorLine,
    HorizontalSeperatorLine,
} from '../config/Common';

var _title;
var _content;

export default class NewReplyThreadScreen extends Component {
    constructor(props) {
        super(props);

        var content = '';
        console.log('123asddasdasdasdsad:' + this.props.navigation.state.params.body);
        if (this.props.navigation.state.params.body.length > 0) {
            var body = this.props.navigation.state.params.body.replace('<p></p>', '');
            var array = body.split('</p>');
            console.log(array);
            for (var i = 0; i < array.length - 1; i++) {
                array[i] = array[i].replace('<p>', '').replace('</p>', '');
                if (i == 1) {
                    content += '\n: ' + array[i];
                }
                else if (i == 2) {
                    content += '\n: ' + array[i];
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
            // content = content.replace('<p>', '').replace('</p>', '');
        }
        console.log('content:' + content);

        this.state = {
            isLoading: false,
            content: content.length > 0 ? '\n【 在 ' + this.props.navigation.state.params.author + ' 的大作中提到: 】\n' + '' + content : '',
        }
        _content = this.state.content;
    }

    save() {
        if (_content == null) {
            ToastUtil.info('请输入标题和内容');
            return;
        }
        if (this.state.isLoading == true) return;
        this.setState({
            isLoading: true,
        });
        NetworkManager.getNewReply(this.props.navigation.state.params.id, (result) => {

            NetworkManager.postReplSave(this.props.navigation.state.params.id, _content, (result) => {

                DeviceEventEmitter.emit('NewThreadRefreshNotification', this.props.navigation.state.params.threadID);
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
            <View style={{ flex: 1, }}>
                <StatusBar barStyle="dark-content" />
                <NavigationBar title='回复'
                        navigation={this.props.navigation}
                        showBackButton={true}
                        showBottomLine={true}
                        rightButtonTitle={'确定'}
                        rightButtonOnPress={() => {
                            this.save();
                        }}
                    />

                <Screen showLoading={this.state.isLoading} loadingType={'clear'} >
                    <ScrollView style={styles.scrollView} keyboardDismissMode={'on-drag'} >
                        <View style={styles.container} >

                            <Text style={styles.title} >{'Re: ' + this.props.navigation.state.params.title}</Text>
                            <HorizontalSeperatorLine />

                            <TextInput
                                style={styles.contentInput}
                                underlineColorAndroid={'transparent'}
                                multiline={true}
                                autoFocus={true}
                                autoCorrect={false}
                                spellCheck={false}
                                placeholder={'输入文章正文...'}
                                placeholderTextColor={global.colors.gray3Color}
                                autoCapitalize={'none'}
                                selection={this.state.selection}
                                onSelectionChange={(event) => {
                                    this.setState({
                                        selection: event.nativeEvent.selection
                                    })
                                }}
                                onFocus={() => {
                                    this.setState({
                                        selection: { start: 0, end: 0 }
                                    })
                                }}
                                onChangeText={(text) => {
                                    this.setState({
                                        content: text
                                    });
                                    _content = text;
                                }}
                                value={this.state.content}
                            />
                        </View>
                    </ScrollView>
                </Screen>
            </View>
        )
    }
}

var styles = {
    get scrollView() {
        return {
            height: global.constants.ScreenHeight - global.constants.BottomSaveArea,
        }
    },
    get container() {
        return {
            flex: 1,
            paddingTop: global.constants.Padding,
            paddingLeft: global.constants.Padding + 6,
            paddingRight: global.constants.Padding + 6,
        }
    },
    get title() {
        return {
            paddingBottom: global.constants.Padding,
            fontSize: global.configures.fontSize17,
            color: global.colors.gray1Color,
        }
    },
    get contentInput() {
        return {
            height: 200,
            paddingTop: global.constants.Padding,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            textAlignVertical: 'top'
        }
    },
}
