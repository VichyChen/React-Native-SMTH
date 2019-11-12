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
    AvatorImage,
    SeperatorLine,
    LoadingView,
    Screen,
    CellBackground,
    NavigationBar,
    Button,
    ToastUtil,
    ReactNavigation
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';

import cio from 'cheerio-without-node-native';
import HTMLView from 'react-native-htmlview';
import AutoHeightImage from 'react-native-auto-height-image';
import { CachedImage } from "react-native-img-cache";

export default class NewSMTHSearchThreadScreen extends Component {

    _board = '';
    _title = '';
    _author = '';

    constructor(props) {
        super(props);
        this.state = {
            board: '',
            title: '',
            author: '',
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'搜索帖子'}
                    navigation={this.props.navigation}
                    showBackButton={true}
                    showBottomLine={true}
                />

                {/* <TextInput
                    style={styles.textInput}
                    underlineColorAndroid={'transparent'}
                    clearButtonMode={'while-editing'}
                    autoCorrect={false}
                    spellCheck={false}
                    autoCapitalize={'none'}
                    onChangeText={(text) => {
                        this.setState({
                            board: text
                        });
                        _board = text;
                    }}
                    value={this.state.board}
                    placeholder={'板块'}
                /> */}

                <TextInput
                    style={styles.textInput}
                    underlineColorAndroid={'transparent'}
                    clearButtonMode={'while-editing'}
                    autoCorrect={false}
                    spellCheck={false}
                    autoCapitalize={'none'}
                    onChangeText={(text) => {
                        this.setState({
                            title: text
                        });
                        this._title = text;
                    }}
                    value={this.state.title}
                    placeholder={'标题'}
                />

                <TextInput
                    style={styles.textInput}
                    underlineColorAndroid={'transparent'}
                    clearButtonMode={'while-editing'}
                    autoCorrect={false}
                    spellCheck={false}
                    autoCapitalize={'none'}
                    onChangeText={(text) => {
                        this.setState({
                            author: text
                        });
                        this._author = text;
                    }}
                    value={this.state.author}
                    placeholder={'作者'}
                />

                <Button
                    style={styles.moreLikeButton}
                    onPress={() => {
                        ReactNavigation.navigate(this.props.navigation, 'newSMTHSearchThreadResultScreen', {
                            board: this.props.navigation.state.params.board,
                            title: this._title,
                            author: this._author
                        });
                    }}
                    text='搜索'
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
    get textInput() {
        return {
            marginLeft: global.constants.Margin,
            marginRight: global.constants.Margin,
            height: 44,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
}