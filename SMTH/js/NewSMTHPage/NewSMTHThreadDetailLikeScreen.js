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
    Slider
} from 'react-native';

import {
    NetworkManager,
    NavigatorTitleButton,
    ToastUtil,
    Screen,
    NavigationBar,
    HorizontalSeperatorLine,
    SeperatorLine,
    Button,
    ImageButton
} from '../config/Common';


export default class NewSMTHThreadDetailLikeScreen extends Component {
    _msg;
    _tag;

    constructor(props) {
        super(props);
        this.state = {
            fontSizeSlideValue: 0,
        }
        this._msg = '';
    }

    postNewSMTHLike() {
        NetworkManager.postNewSMTHLike(this.props.navigation.state.params.board, this.props.navigation.state.params.id, this.state.fontSizeSlideValue, this._msg, this._tag, (result) => {

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
    }

    render() {
        return (
            <View style={{ flex: 1, }}>
                <NavigationBar
                    title='我要Like！'
                    navigation={this.props.navigation}
                    showBackButton={true}
                    showBottomLine={true}
                    rightButtonTitle={'提交'}
                    rightButtonOnPress={() => {
                        if (this._msg.length == 0) return;
                        this.postNewSMTHLike();
                    }}
                />
                <Screen >
                    <ScrollView style={{}}>

                        <Text style={styles.title}>评分：{this.state.fontSizeSlideValue}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={-5}
                            maximumValue={5}
                            step={1}
                            minimumTrackTintColor={global.colors.gray3Color}
                            maximumTrackTintColor={global.colors.gray3Color}
                            value={this.state.fontSizeSlideValue}
                            onValueChange={(value) => {
                                this.setState({
                                    fontSizeSlideValue: value,
                                });
                            }}
                        />
                        <SeperatorLine />

                        <Text style={styles.title}>短评：</Text>
                        <TextInput
                            style={styles.contentInput}
                            underlineColorAndroid={'transparent'}
                            multiline={true}
                            autoCorrect={false}
                            spellCheck={false}
                            placeholder={'请输入短评，不超过30个字'}
                            placeholderTextColor={global.colors.gray3Color}
                            autoCapitalize={'none'}
                            onFocus={() => this.setState({ selection: { start: 0, end: 0 } })}
                            onChangeText={(text) => { this.setState({ content: text }); this._msg = text; }}
                            value={this.state.msg}
                        />
                        <SeperatorLine />

                        <Text style={styles.title}>标签：</Text>
                        <TextInput
                            style={styles.contentInput}
                            underlineColorAndroid={'transparent'}
                            multiline={true}
                            autoCorrect={false}
                            spellCheck={false}
                            placeholder={'请输入标签，不超过30个字'}
                            placeholderTextColor={global.colors.gray3Color}
                            autoCapitalize={'none'}
                            onFocus={() => this.setState({ selection: { start: 0, end: 0 } })}
                            onChangeText={(text) => { this.setState({ content: text }); this._tag = text; }}
                            value={this.state.tag}
                        />
                        <SeperatorLine />

                    </ScrollView>
                </Screen>
            </View>
        )
    }
}

var styles = {
    get title() {
        return {
            margin: global.constants.Padding,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get slider() {
        return {
            marginLeft: global.constants.Padding,
            marginBottom: global.constants.Padding,
            width: global.constants.ScreenWidth - global.constants.Padding * 2,
            height: 44,
        }
    },
    get contentInput() {
        return {
            height: 50,
            paddingLeft: global.constants.Padding,
            paddingRight: global.constants.Padding,
            marginBottom: global.constants.Padding,
            borderColor: global.colors.clearColor,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            textAlignVertical: 'top'
        }
    },

}
