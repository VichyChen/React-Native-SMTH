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
    Screen,
    Button,
    NavigationBar,
    SeperatorLine,
    HorizontalSeperatorLine
} from '../config/Common';

var _title;
var _content;

export default class NewReplyThreadScreen extends Component {
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
            content: content.length > 0 ? '\r【 在 ' + this.props.navigation.state.params.author + ' 的大作中提到: 】\r' + '' + content : '',
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
            <Screen showLoading={this.state.isLoading} loadingType={'clear'} >

                <NavigationBar title='回复'
                    navigation={this.props.navigation}
                    showBackButton={true}
                    showBottomLine={true}
                    rightButtonTitle={'确定'}
                    rightButtonOnPress={() => {
                        this.save();
                    }}
                />

                <ScrollView style={styles.scrollView} keyboardDismissMode={'on-drag'} >
                    <View style={styles.container} >

                        <Text style={styles.title} >Re: 要不要</Text>
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
