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
} from 'react-native';

import {
    NetworkManager,
    NavigatorTitleButton,
    ToastUtil,
    Screen,
    NavigationBar,
    HorizontalSeperatorLine
} from '../config/Common';

var _title;
var _content;

export default class NewPostThreadScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
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
                        NetworkManager.net_PostArticle(this.props.navigation.state.params.board, _title, _content, (result) => {
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
                    title='发布' />
            )
        })
    }

    save() {
        if (_title == null || _content == null) {
            ToastUtil.info('请输入标题和内容');
            return;
        }
        if (this.state.isLoading == true) return;
        this.setState({
            isLoading: true,
        });
        NetworkManager.getNewPost(this.props.navigation.state.params.id, (result) => {

            NetworkManager.postPostSave(this.props.navigation.state.params.id, _title, _content, (result) => {

                ToastUtil.info('发帖成功');
                setTimeout(() => {
                    this.props.navigation.goBack();
                }, 50);

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

                <NavigationBar title='发帖'
                    navigation={this.props.navigation}
                    showCancelButton={true}
                    showBottomLine={true}
                    rightButtonTitle={'确定'}
                    rightButtonOnPress={() => {
                        this.save();
                    }}
                />

                <ScrollView style={styles.scrollView} keyboardDismissMode={'on-drag'} >

                    <View style={styles.container} >

                        <TextInput
                            ref="titleTextInput"
                            style={styles.titleInput}
                            underlineColorAndroid={'transparent'}
                            autoFocus={true}
                            autoCorrect={false}
                            spellCheck={false}
                            placeholder={'输入文章主题'}
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
                            autoCorrect={false}
                            spellCheck={false}
                            placeholder={'输入文章正文'}
                            placeholderTextColor={global.colors.gray3Color}
                            autoCapitalize={'none'}
                            onFocus={() => this.setState({ selection: { start: 0, end: 0 } })}
                            onChangeText={(text) => { this.setState({ content: text }); _content = text; }}
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
            // backgroundColor: global.colors.themeColor,
            paddingTop: global.constants.Padding,
            paddingLeft: global.constants.Padding + 6,
            paddingRight: global.constants.Padding + 6,
        }
    },
    get titleInput() {
        return {
            height: 35,
            paddingBottom: global.constants.Padding,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get contentInput() {
        return {
            height: 200,
            paddingTop: global.constants.Padding,
            borderColor: global.colors.clearColor,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            textAlignVertical: 'top'
        }
    },
}
