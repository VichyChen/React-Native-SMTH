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
    ToastUtil,
    Screen,
    NavigationBar,
    HorizontalSeperatorLine,
    SeperatorLine,
    Button,
    ImageButton
} from '../config/Common';
import ImagePicker from 'react-native-image-picker';

var _title;
var _content;

export default class NewPostThreadScreen extends Component {

    _images = [];

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            images: [],
        }
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

            if (this._images.length > 0) {
                NetworkManager.postUpload(this._images, (result) => {

                    this.postReplSave();

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
            else {
                this.postReplSave();
            }

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

    postReplSave() {
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
    }

    render() {
        return (
            <View style={{ flex: 1, }}>

                <NavigationBar title='发帖'
                    navigation={this.props.navigation}
                    showBackButton={true}
                    showBottomLine={true}
                    rightButtonTitle={'确定'}
                    rightButtonOnPress={() => {
                        this.save();
                    }}
                />

                {
                    this._images.length == 8 ? null :
                        <Button
                            style={{ zIndex: 999, position: 'absolute', top: global.constants.TopSaveArea + 19, right: global.constants.Padding + 40, height: 44, }}
                            height={44}
                            text={'选择图片'}
                            fontColor={global.colors.themeColor}
                            onPress={() => {

                                ImagePicker.showImagePicker({
                                    title: '选择图片',
                                    takePhotoButtonTitle: '拍照',
                                    chooseFromLibraryButtonTitle: '相册',
                                    cancelButtonTitle: '取消',
                                    maxWidth: 800,
                                    maxHeight: 800,
                                    storageOptions: {
                                        path: 'images',
                                    },
                                }, (response) => {
                                    console.log('Response = ', response);

                                    if (response.didCancel) {
                                        console.log('User cancelled image picker');
                                    } else if (response.error) {
                                        console.log('ImagePicker Error: ', response.error);
                                    } else if (response.customButton) {
                                        console.log('User tapped custom button: ', response.customButton);
                                    } else {
                                        this._images.push(response);
                                        this.setState({
                                            images: this._images,
                                        });
                                    }
                                });
                            }} />
                }

                <Screen showLoading={this.state.isLoading} loadingType={'clear'} >
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

                            <View style={styles.imageView} >
                                {
                                    this._images.map((item, i) => {
                                        return (
                                            <View key={i} >
                                                <Image style={styles.image} source={{ uri: item.uri }} />
                                                <ImageButton
                                                    style={styles.deleteImage}
                                                    width={36}
                                                    height={36}
                                                    margin={16}
                                                    source={global.images.icon_minus}
                                                    onPress={() => {
                                                        this._images.splice(i, 1);
                                                        this.setState({});
                                                    }} />
                                            </View>
                                        );
                                    })
                                }
                            </View>

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
        }
    },
    get titleInput() {
        return {
            height: 35,
            paddingLeft: global.constants.Padding,
            paddingRight: global.constants.Padding,
            paddingBottom: global.constants.Padding,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get contentInput() {
        return {
            height: 200,
            paddingTop: global.constants.Padding,
            paddingLeft: global.constants.Padding,
            paddingRight: global.constants.Padding,
            borderColor: global.colors.clearColor,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            textAlignVertical: 'top'
        }
    },
    get imageView() {
        return {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingTop: 5,
            paddingLeft: global.constants.Padding,
            paddingRight: 5,
        }
    },
    get image() {
        return {
            width: Math.floor((((global.constants.ScreenWidth - global.constants.Padding * 2)) - 30) / 4),
            height: Math.floor((((global.constants.ScreenWidth - global.constants.Padding * 2)) - 30) / 4),
            marginRight: 10,
            marginTop: 10,
        }
    },
    get deleteImage() {
        return {
            position: 'absolute',
            top: 0,
            right: 0,
        }
    },
}
