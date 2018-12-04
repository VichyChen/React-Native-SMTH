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
    ImageButton
} from '../config/Common';
import ImagePicker from 'react-native-image-picker';

var _title;
var _content;

export default class NewReplyThreadScreen extends Component {

    _images = [];

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            images: [],
        }

        var content = '';

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
    }

    render() {
        return (
            <View style={{ flex: 1, }}>

                <NavigationBar title='回复'
                    navigation={this.props.navigation}
                    showBackButton={true}
                    showBottomLine={true}
                    rightButtonTitle={'确定'}
                    rightButtonOnPress={() => {
                        this.save();
                    }}
                />

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

                <Screen showLoading={this.state.isLoading} loadingType={'clear'} >
                    <ScrollView style={styles.scrollView} keyboardDismissMode={'on-drag'} >
                        <View style={styles.container} >

                            <Text style={styles.title} >{'Re: ' + this.props.navigation.state.params.title}</Text>
                            <SeperatorLine />

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
    get title() {
        return {
            paddingLeft: global.constants.Padding,
            paddingRight: global.constants.Padding,
            paddingBottom: global.constants.Padding,
            fontSize: global.configures.fontSize17,
            color: global.colors.gray1Color,
        }
    },
    get contentInput() {
        return {
            height: 200,
            paddingTop: global.constants.Padding,
            paddingLeft: global.constants.Padding,
            paddingRight: global.constants.Padding,
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
