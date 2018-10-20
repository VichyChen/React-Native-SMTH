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

    componentDidMount() {
        this.setBarItemButton('编辑');
    }

    componentWillUnmount() {
        this.refreshViewNotification.remove();
        this.loginSuccessNotification.remove();
        this.logoutNotification.remove();
    }

    setBarItemButton(title) {
        this.props.navigation.setParams({
            headerRight: (
                <NavigatorTitleButton
                    color={global.colors.whiteColor}
                    fontSize={16}
                    title={title}
                    onPressClick={() => {
                        if (title == '编辑') {
                            this.setBarItemButton('完成');

                            this.setState({
                                dataArray: _dataArray,
                                editing: true
                            });

                        } else {
                            this.setBarItemButton('编辑');

                            this.setState({
                                dataArray: _dataArray,
                                editing: false
                            });
                        }
                    }}
                />
            )
        })
    }

    net_LoadFavorites() {
        NetworkManager.getNewHot('', 1, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('body').html());
            var srcipt = this.$('script').text();
            if (srcipt.length > 0) {
                var favouriteArray = JSON.parse(this.$('script').text()
                    .replace("\n        $(function () {\n            build_favorites($(\'#__favorites\'), ", '')
                    .replace(");\n        });\n    ", ''));
            }
            AsyncStorageManger.setFavouriteArray(favouriteArray);

            this.setState({});

        }, (error) => {

        }, (errorMessage) => {

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

    _renderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    if (this.state.editing == true) {

                    }
                    else {
                        this.props.navigation.navigate('boardListScreen', { id: item.id, text: item.name })
                    }
                }}
            >
                <View style={styles.container}>
                    <View style={styles.content}>
                        {this.state.editing == true ?
                            <ImageButton
                                style={styles.deleteButton}
                                width={44}
                                height={44}
                                margin={24}
                                onPress={() => {
                                    this.net_DelFav(item);
                                }}
                                source={global.images.icon_minus} /> : null}
                        <Text style={styles.board}>{item.name}</Text>
                    </View>
                    {this.state.editing == true ? null : <Image style={styles.arrow} source={global.images.icon_forward_arrow} />}
                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    };

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
                                            global.current.favouriteArray.map((item) => {
                                                return (
                                                    <CellBackground
                                                        showSelect={false}
                                                        onPress={() => {
                                                            this.props.navigation.navigate('newBoardListScreen', { id: item.id, name: item.title, title: item.name });
                                                        }}
                                                    >
                                                        <View style={styles.rightItemContainer} >
                                                            <Text style={styles.rightItemTitle} >{item.title}</Text>
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
    get rightItemContainer() {
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
    get rightItemTitle() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.gray1Color,
        }
    },
}
