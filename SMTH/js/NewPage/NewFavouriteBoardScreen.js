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
    Dimensions,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';

import {
    NetworkManager,
    SeperatorLine,
    CellBackground,
    NavigatorTitleButton,
    ImageButton,
    LoadingView,
    Screen,
    ToastUtil,
    NavigationBar,
    LoginButtonView,
} from '../config/Common';

import cio from 'cheerio-without-node-native';
import AsyncStorageManger from '../storage/AsyncStorageManger';

var _dataArray;

export default class NewFavouriteBoardScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            viewLoading: false,
            loadingType: 'background',
            screenText: null,
            isDeleting: false,
            editing: false,
            dataArray: [],
            title: '编辑',
        }

        this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
            this.setState({});
        });
        this.loginSuccessNotification = DeviceEventEmitter.addListener('LoginSuccessNotification', () => {
            this.net_LoadFavorites();
        });
        this.logoutNotification = DeviceEventEmitter.addListener('LogoutNotification', () => {
            this.setState({});
        });

        //没登录
        if (global.login == false) {
            this.setState({});
        }
        else {
            this.setState({
                viewLoading: true,
                loadingType: 'background',
                screenText: null
            });
            this.net_LoadFavorites();
        }
    }

    componentWillUnmount() {
        this.refreshViewNotification.remove();
        this.loginSuccessNotification.remove();
        this.logoutNotification.remove();
    }

    net_LoadFavorites() {
        NetworkManager.net_LoadFavorites(0, (result) => {
            for (var i = 0; i < result['favorites'].length; i++) {
                result['favorites'][i].key = i;
            }
            _dataArray = result['favorites'];
            this.setState({
                dataArray: _dataArray,
                pullLoading: false,
                viewLoading: false,
                screenText: null
            });
        }, (error) => {
            if (this.state.viewLoading == true) {
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: error
                });
            }
            else {
                ToastUtil.info(error);
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: null
                });
            }
        }, (errorMessage) => {
            if (this.state.viewLoading == true) {
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: errorMessage + '，请点击重试'
                });
            }
            else {
                ToastUtil.info(errorMessage);
                this.setState({
                    pullLoading: false,
                    viewLoading: false,
                    screenText: null
                });
            }
        });
    }

    net_DelFav(item) {
        this.setState({
            isDeleting: true,
            loadingType: 'clear',
        });
        NetworkManager.net_DelFav(item.id, (result) => {
            _dataArray.splice(item.key, 1);
            this.setState({
                dataArray: _dataArray,
                isDeleting: false,
            });
        }, (error) => {
            ToastUtil.info(error);
            this.setState({
                isDeleting: false,
            });
        }, (errorMessage) => {
            ToastUtil.info(errorMessage);
            this.setState({
                isDeleting: false,
            });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <Screen
                    showLoading={this.state.viewLoading}
                    loadingType={'background'}
                    text={this.state.screenText}
                    onPress={() => {
                        this.setState({
                            viewLoading: true,
                            loadingType: 'background',
                            screenText: null
                        });
                        this.net_LoadFavorites();
                    }}
                >
                    <View style={styles.container}> */}
                {
                    global.login == false
                        ?
                        <LoginButtonView style={{ zIndex: 999, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
                        :
                        <ScrollView>
                            <View style={styles.rightView} >
                                {
                                    this.state.dataArray.map((item) => {
                                        return (
                                            <CellBackground
                                                showSelect={false}
                                                onPress={() => {
                                                    this.props.navigation.navigate('newBoardListScreen', { id: global.boards.all[item.id].id, name: item.name, title: item.id });
                                                }}
                                            >
                                                <View style={styles.itemContainer} >
                                                    <Text style={styles.itemTitle} >{item.name}</Text>
                                                    {
                                                        this.props.editing == true
                                                            ?
                                                            <ImageButton style={styles.itemImage} width={36} height={36} margin={16} source={global.images.icon_minus}
                                                                onPress={() => { this.net_DelFav(item); }} />
                                                            :
                                                            null
                                                    }
                                                </View>
                                            </CellBackground>
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
                }
                {/* </View>
                </Screen> */}
            </View >
        )
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            // flexDirection: 'column',
            backgroundColor: global.colors.clearColor
        }
    },
    get content() {
        return {
            flexDirection: 'row',
            alignItems: 'center',
            height: 44,
            backgroundColor: global.colors.whiteColor
        }
    },
    get deleteButton() {
        return {
            marginLeft: 0,
            marginRight: -13
        }
    },
    get board() {
        return {
            marginLeft: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            backgroundColor: global.colors.whiteColor,
        }
    },
    get arrow() {
        return {
            position: 'absolute',
            top: 13,
            right: 13,
            width: 10,
            height: 17,
        }
    },
    get rightView() {
        return {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingLeft: 15,
            paddingTop: 5,
            paddingBottom: 15,
        }
    },
    get itemContainer() {
        return {
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
            marginTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: global.colors.whiteColor,
            borderColor: '#EBEBEB',
            borderWidth: 1,
            borderRadius: 4,
        }
    },
    get itemTitle() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.gray1Color,
        }
    },
    get itemImage() {
        return {
            position: 'absolute',
            top: -15,
            right: -15,
            // width: 15,
            // height: 15
        }
    },
}
