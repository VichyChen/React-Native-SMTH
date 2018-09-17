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
    Screen
} from '../config/Common';

var _title;
var _content;

export default class NewPostThreadScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: '发布帖子',
        headerRight: navigation.state.params ? navigation.state.params.headerRight : null
    });

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
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

    render() {
        return (
            <Screen showLoading={this.state.isLoading} loadingType={'clear'} >
                <ScrollView style={[styles.container, { height: Dimensions.get('window').height - 64 }]} keyboardDismissMode={'on-drag'} >
                    <Text style={styles.title}>标题：</Text>
                    <TextInput
                        ref="titleTextInput"
                        style={styles.titleInput}
                        underlineColorAndroid={'transparent'}
                        autoFocus={true}
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
                        autoCorrect={false}
                        spellCheck={false}
                        autoCapitalize={'none'}
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
