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
    DeviceEventEmitter,
    RefreshControl,
    StatusBar
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
    ReactNavigation
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';

import cio from 'cheerio-without-node-native';
import AsyncStorageManger from '../storage/AsyncStorageManger';

var _dataArray;

export default class NewFavouriteBoardScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: true,
            pullLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            isDeleting: false,
            editing: false,
            dataArray: [],
        }

        this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
            this.setState({});
        });
        this.loginSuccessNotification = DeviceEventEmitter.addListener('LoginSuccessNotification', () => {
            this.setState({
                login: true,
                screenStatus: global.screen.loading,
            });
            this.net_LoadFavorites();
        });
        this.logoutNotification = DeviceEventEmitter.addListener('LogoutNotification', () => {
            this.setState({
                login: false,
            });
        });

        AsyncStorageManger.getLogin().then(login => {
            global.login = login;
            if (login == true) {
                this.setState({
                    login: login,
                    screenStatus: global.screen.loading,
                });
                this.net_LoadFavorites();
            }
            else {
                this.setState({
                    login: login,
                });
            }
        });
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });
    }

    componentWillUnmount() {
        this.refreshViewNotification.remove();
        this.loginSuccessNotification.remove();
        this.logoutNotification.remove();
        this._navListener.remove();
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
                screenStatus: global.screen.none,
            });
        }, (error) => {
            ToastUtil.info(error.message);
            this.setState({
                pullLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? (error.error == 10010 ? global.screen.try : global.screen.error) : global.screen.none,
                screenText: error.message,
            });
        }, (errorMessage) => {
            ToastUtil.info(errorMessage);
            this.setState({
                pullLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.networkError : global.screen.none,
            });
        });
    }

    net_DelFav(item) {
        this.setState({
            isDeleting: true,
            screenStatus: global.screen.loadingClear,
        });
        NetworkManager.net_DelFav(item.id, (result) => {
            _dataArray.splice(item.key, 1);
            this.setState({
                dataArray: _dataArray,
                isDeleting: false,
                screenStatus: global.screen.none,
            });
        }, (error) => {
            ToastUtil.info(error.message);
            this.setState({
                isDeleting: false,
                screenStatus: global.screen.none,
            });
        }, (errorMessage) => {
            ToastUtil.info(errorMessage);
            this.setState({
                isDeleting: false,
                screenStatus: global.screen.none,
            });
        });
    }

    render() {
        return (
            <View style={styles.container}>

                <NavigationBar title='收藏'
                    showBottomLine={true}
                    rightButtonTitle={this.state.login == false ? null : (this.state.editing == true ? '完成' : '编辑')}
                    rightButtonOnPress={() => {
                        this.setState({
                            editing: !this.state.editing,
                        });
                    }}
                />

                <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                    this.setState({
                        screenStatus: global.screen.loading,
                    });
                    this.net_LoadFavorites();
                }} >
                    {
                        this.state.login == false
                            ?
                            <LoginButtonView text={'需登陆才能查看收藏'} style={{ zIndex: 999, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
                            :
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.pullLoading} onRefresh={() => {
                                            this.setState({
                                                pullLoading: true
                                            });
                                            this.net_LoadFavorites();
                                        }}
                                    />
                                }
                            >
                                <View style={styles.rightView} >
                                    {
                                        this.state.dataArray.map((item, i) => {
                                            return (
                                                <View key={i} >
                                                    <Text style={CommonCSS.itemBoard} onPress={() => {
                                                        if (global.boards.all[item.id] == null) {
                                                            return;
                                                        }
                                                        ReactNavigation.navigate(this.props.navigation, 'newBoardListScreen', { id: global.boards.all[item.id].id, name: item.name, title: item.id });
                                                    }}>
                                                        {item.name}
                                                    </Text>
                                                    {
                                                        this.state.editing == true
                                                            ?
                                                            <ImageButton
                                                                style={styles.itemImage}
                                                                width={36}
                                                                height={36}
                                                                margin={16}
                                                                source={global.images.icon_minus}
                                                                onPress={() => { this.net_DelFav(item); }} />
                                                            :
                                                            null
                                                    }
                                                </View>
                                            );
                                        })
                                    }
                                </View>
                            </ScrollView>
                    }
                </Screen>
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
    get itemImage() {
        return {
            position: 'absolute',
            top: -5,
            right: -5,
        }
    },
}
