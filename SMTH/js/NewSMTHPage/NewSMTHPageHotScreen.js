/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
    TouchableHighlight,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    Modal,
    ActivityIndicator
} from 'react-native';

import {
    NetworkManager,
    DateUtil,
    SeperatorLine,
    HorizontalSeperatorLine,
    SectionHeader,
    CellBackground,
    LoginView,
    LoadingView,
    Screen,
    Toast,
    ToastUtil,
    AvatorImage,
    LoginButtonView,
    ReactNavigation,
    NewLoginView,
    GDTNativeExpressView,
    NavigationBar
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';
import AsyncStorageManger from '../storage/AsyncStorageManger';
import { NativeModules } from 'react-native';
import uuid from 'uuid';
import cio from 'cheerio-without-node-native';
import Cookie from 'react-native-cookie';
import ImageViewer from 'react-native-image-zoom-viewer';
// import codePush from 'react-native-code-push'


export default class NewSMTHPageHotScreen extends Component {

    _array;
    _adSection = [0, 3, 7, 10];
    _adTag = [100, 101, 102, 103];
    _adTagDic = { '0': 100, '3': 101, '7': 102, '10': 103 };

    constructor(props) {
        super(props);

        this.state = {
            showImageViewer: false,
            login: true,
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
            showLogin: false,
            closeCallback: null,
            adheight: { '100': 0, '101': 0, '102': 0, '103': 0 },
        }

        this._array = ['知性感性', '休闲娱乐', '社会信息', '游戏运动', '电脑技术', '文化人文', '学术科学', '五湖四海', '国内院校', '系统与祝福'];

        this.loginNotification = DeviceEventEmitter.addListener('LoginNotification', (closeCallback) => {
            this.setState({
                showLogin: true,
                closeCallback: closeCallback,
            });
        });
        this.loginCloseNotification = DeviceEventEmitter.addListener('LoginCloseNotification', () => {
            this.setState({
                showLogin: false,
            });
        });
        this.loginSuccessNotification = DeviceEventEmitter.addListener('LoginSuccessNotification', () => {
            this.setState({
                login: true,
                showLogin: false,
            });
        });
        this.logoutNotification = DeviceEventEmitter.addListener('LogoutNotification', () => {
            this.setState({
                login: false,
                showLogin: false,
            });
        });
        this.doubleClickHotScreenNotification = DeviceEventEmitter.addListener('DoubleClickHotScreenNotification', () => {
            this.setState({
                pullLoading: true,
            });
            setTimeout(() => {
                this.refs.flatList.scrollToOffset({ offset: -64, animated: true })
            }, 50);
            setTimeout(() => {
                this.net_LoadSectionHot();
            }, 1000);
        });
        this.showImagesNotification = DeviceEventEmitter.addListener('ShowImagesNotification', (object) => {
            this.setState({
                showImageViewer: true,
                images: object.images,
                imageIndex: object.index,
            });
        });

        // AsyncStorageManger.getLogin().then(login => {
        //     global.login = login;
        //     if (login == true) {
        //         this.setState({
        //             login: login,
        //             screenStatus: global.screen.loading,
        //         });
        //         this.net_LoadSectionHot();
        //     }
        //     else {
        //         this.setState({
        //             login: login,
        //         });
        //     }
        // });


        // NetworkManager.getNewSMTHFirst(() => {

        //     this.setState({
        //         screenStatus: global.screen.loading,
        //     });
        //     this.net_LoadSectionHot();

        // }, (error) => {
        //     this.setState({
        //         isLoading: false,
        //     })
        // }, (errorMessage) => {
        //     this.setState({
        //         isLoading: false,
        //     })
        // });

        AsyncStorageManger.getLogin().then(login => {
            if (login == true) {
                AsyncStorageManger.getUsername().then(username => {
                    AsyncStorageManger.getPassword().then((password) => {
                        NetworkManager.postNewSMTHLogin(username, password, 99999, (result) => {
                            AsyncStorageManger.setLogin(true);
                            global.login = true;
                            global.current.username = username;
        
                            this.setState({
                                screenStatus: global.screen.loading,
                            });
                            this.net_LoadSectionHot();
        
                        }, (error) => {
                        }, (errorMessage) => {
                        });
                    });
                });        
            }
            else {
                this.setState({
                    screenStatus: global.screen.loading,
                });
                this.net_LoadSectionHot();
            }
        });


        // AsyncStorageManger.getUsername().then(username => {
        //     AsyncStorageManger.getPassword().then((password) => {
        //         NetworkManager.postNewSMTHLogin(username, password, 99999, (result) => {
        //             AsyncStorageManger.setLogin(true);
        //             global.login = true;
        //             global.current.username = username;

        //             this.setState({
        //                 screenStatus: global.screen.loading,
        //             });
        //             this.net_LoadSectionHot();


        //         }, (error) => {
        //         }, (errorMessage) => {
        //         });
        //     });
        // });


    }

    componentDidMount() {
        // codePush.sync();
      }
    
    componentWillUnmount() {
        this.loginNotification.remove();
        this.loginSuccessNotification.remove();
        this.logoutNotification.remove();
        this.doubleClickHotScreenNotification.remove();
        this.showImagesNotification.remove();
    }

    net_LoadSectionHot() {
        NetworkManager.getNewSMTHHome((result) => {

            //___________________今日十大___________________
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('div[id=top10]').html());
            var array = [];
            array.push({
                key: 'section' + 0,
                type: 'section',
                title: '今日十大',
            });
            this.$('li').each(function (i, elem) {
                this.$ = cio.load(elem);

                var subject = this.$('div').children().last().attr('title');
                var start = subject.lastIndexOf('(');
                var end = subject.lastIndexOf(')');
                var count = subject.substring(start + 1, end);
                subject = subject.substring(0, start);

                array.push({
                    key: this.$('div').children().first().attr('href').split('/')[3] + this.$('div').children().last().attr('href').split('/')[4],
                    type: 'row',
                    id: this.$('div').children().last().attr('href').split('/')[4],
                    subject: subject,
                    count: count,
                    board: this.$('div').children().first().attr('href').split('/')[3],
                    boardName: this.$('div').children().first().attr('title'),
                });
            });

            /*
            //___________________最近热帖___________________
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('div[id=hotspot]').html());
            array.push({
                key: 'section' + 1,
                type: 'section',
                title: '最近热帖',
            });
            this.$('li').each(function (i, elem) {
                this.$ = cio.load(elem);
                if (this.$('div').children().last().attr('href') != null && this.$('div').children().last().attr('title') != null) {
                    array.push({
                        key: 'ShiDa' + this.$('div').children().last().attr('href').split('/')[4],
                        type: 'row',
                        id: this.$('div').children().last().attr('href').split('/')[4],
                        subject: this.$('div').children().last().attr('title'),
                        count: '',
                        board: 'ShiDa',
                        boardName: this.$('div').children().first().children().first().text(),
                    });
                }
            });
            */

            //___________________其他板块________________________
            this.$ = cio.load(result);
            this.$('div[class=topics]').each(function (i, elem) {
                this.$ = cio.load(elem);
                if (i != 0) { // 0排除掉最近热帖
                    array.push({
                        key: 'section' + (i + 1),
                        type: 'section',
                        title: ['知性感性', '休闲娱乐', '社会信息', '游戏运动', '电脑技术', '文化人文', '学术科学', '五湖四海', '国内院校', '系统与祝福'][i - 1],
                    });
                    this.$('li').each(function (i1, elem1) {
                        this.$ = cio.load(elem1);
                        if (this.$('a').last().attr('href') != null) {

                            var subject = this.$('a').last().attr('title');
                            var start = subject.lastIndexOf('(');
                            var end = subject.lastIndexOf(')');
                            var count = subject.substring(start + 1, end);
                            subject = subject.substring(0, start);

                            array.push({
                                key: this.$('a').first().attr('href').split('/')[3] + this.$('a').last().attr('href').split('/')[4],
                                type: 'row',
                                id: this.$('a').last().attr('href').split('/')[4],
                                subject: subject,
                                count: count,
                                board: this.$('a').first().attr('href').split('/')[3],
                                boardName: this.$('a').first().text(),
                            });
                        }
                    });
                }
            });


            this.setState({
                dataArray: array,
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: global.screen.none,
            });
        }, (error) => {
            ToastUtil.info(error.message);
            this.setState({
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? (error.error == 10010 ? global.screen.try : global.screen.error) : global.screen.none,
                screenText: error.message,
            });
        }, (errorMessage) => {
            ToastUtil.info(errorMessage);
            this.setState({
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.networkError : global.screen.none,
            });
        });
    }

    _renderItem = ({ item }) => {
        if (item.type == 'section') {
            return (
                <View>
                    <SectionHeader title={item.title} color={global.colors.backgroundGrayColor} />
                </View>
            );
        }
        else if (item.type == 'ad') {
            return (
                <GDTNativeExpressView
                    style={{ height: this.state.adheight[item.adTag.toString()] }}
                    adType={0}
                    adTag={item.adTag}
                    onRenderSuccess={(event) => {
                        this.state.adheight[item.adTag.toString()] = event.nativeEvent.height;
                        this.setState({
                            adheight: this.state.adheight,
                        });
                    }}
                />
            );
        }
        else {
            return (
                <CellBackground
                    onPress={() => {
                        console.log('id:' + item.id);
                        console.log('board:' + item.board);
                        ReactNavigation.navigate(this.props.navigation, 'newSMTHThreadDetailScreen', { id: item.id, board: item.board })
                    }}
                >
                    <View>
                        <View style={styles.itemContainer}>

                            <Text style={CommonCSS.listOnlyTitle} >{item.subject}</Text>
                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                                <Text style={[CommonCSS.listBoardEN]} >{item.board}</Text>
                                {
                                    global.boards.all[item.board] == null ? null :
                                        (
                                            <Text style={[CommonCSS.listBoardCH, { marginLeft: 8 }]} >{global.boards.all[item.board].name}</Text>
                                        )
                                }
                                {/* <Text style={[CommonCSS.listDescript, { marginLeft: 10 }]} >{item.author_id}</Text> */}
                                {item.count > 0 ? (<Text style={[CommonCSS.listDescript, { marginLeft: 8 }]} >{item.count + '回复 '}</Text>) : null}

                            </View>

                        </View>
                        <SeperatorLine />
                    </View>
                </CellBackground>
            );
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar title={'天天水木'} showBottomLine={false} />


                <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                    this.setState({
                        screenStatus: global.screen.loading,
                    });
                    this.net_LoadSectionHot();
                }} >
                    <FlatList
                        ref="flatList"
                        data={this.state.dataArray}
                        renderItem={this._renderItem}
                        removeClippedSubviews={false}
                        extraData={this.state}
                        onRefresh={() => {
                            this.setState({
                                pullLoading: true
                            });
                            this.net_LoadSectionHot();
                        }}
                        refreshing={this.state.pullLoading}
                    />
                </Screen>

                {
                    this.state.showLogin == false ? null : (
                        <NewLoginView visible={true} closeCallback={this.state.closeCallback} />
                    )
                }
                {
                    this.state.showImageViewer == false ? null : (
                        <Modal visible={true} transparent={true}>
                            <ImageViewer
                                imageUrls={this.state.images}
                                index={this.state.imageIndex}
                                onClick={() => {
                                    this.setState({
                                        showImageViewer: false,
                                    });
                                }}
                                loadingRender={() => (
                                    <ActivityIndicator
                                        color={global.colors.whiteColor}
                                        size="small"
                                        style={{
                                            height: global.constants.ScreenHeight,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    />
                                )}
                            />
                        </Modal>
                    )
                }

            </View>
        )
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
        }
    },
    get subject() {
        return {
            paddingLeft: 13,
            paddingRight: 13,
            paddingTop: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            backgroundColor: global.colors.whiteColor
        }
    },
    get other() {
        return {
            flexDirection: 'row',
            padding: 13,
            backgroundColor: global.colors.whiteColor
        }
    },
    // board: {
    //   position: 'absolute',
    //   top: 13,
    //   right: 13,
    //   paddingTop: 3,
    //   paddingBottom: 3,
    //   paddingLeft: 5,
    //   paddingRight: 5,
    //   fontSize: global.configures.fontSize15,
    //   color: global.colors.gray2Color,
    //   backgroundColor: global.colors.backgroundGrayColor,
    //   borderRadius: 10,
    // },
    get board() {
        return {
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.backgroundGrayColor,
            borderRadius: 10,
        }
    },
    get avator() {
        return {
            width: 40,
            height: 40,
        }
    },
    // author: {
    //   marginLeft: 10,
    //   fontSize: global.configures.fontSize17,
    //   height: 20,
    //   color: global.colors.fontColor,
    // },
    get author() {
        return {
            fontSize: global.configures.fontSize15,
            paddingTop: 3,
            height: 20,
            color: global.colors.gray2Color,
        }
    },
    get time() {
        return {
            marginLeft: 10,
            marginTop: 4,
            height: 20,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
        }
    },
    get dot() {
        return {
            paddingTop: 3,
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize14,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.whiteColor
        }
    },
    get countView() {
        return {
            flexDirection: 'row',
            position: 'absolute',
            top: 15,
            right: 12
        }
    },
    get countImage() {
        return {
            width: 14,
            height: 14,
            marginTop: 2,
            marginRight: 3,
            tintColor: global.colors.gray2Color
        }
    },
    get count() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
        }
    },
    get itemContainer() {
        return {
            flex: 1,
            flexDirection: 'column',
            padding: global.constants.Padding,
            backgroundColor: global.colors.whiteColor
        }
    },
    get itemName() {
        return {
            marginLeft: 10,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color
        }
    },
    get itemTitle() {
        return {
            lineHeight: global.constants.LineHeight,
            fontSize: global.configures.fontSize17,
            fontWeight: '600',
            color: global.colors.fontColor
        }
    },
    get itemBoard() {
        return {
            // marginRight: 8,
            paddingLeft: 4,
            paddingRight: 4,
            alignItems: 'center',
            fontSize: global.configures.fontSize14,
            color: global.colors.redColor,
            borderColor: global.colors.redColor,
            borderWidth: 1,
            borderRadius: 2,
            height: 18,
            textAlign: 'center'
        }
    },
}