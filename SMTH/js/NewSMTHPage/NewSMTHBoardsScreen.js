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
    DeviceEventEmitter,
    StatusBar
} from 'react-native';
import AsyncStorageManger from '../storage/AsyncStorageManger';

import cio from 'cheerio-without-node-native';

import {
    NetworkManager,
    NavigatorTitleButton,
    SeperatorLine,
    HorizontalSeperatorLine,
    BoardItems,
    ImageButton,
    LoadingView,
    Screen,
    ToastUtil,
    NavigationBar,
    CellBackground,
    ReactNavigation
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';

import {
    BoardListModel
} from 'ModelModule';

var _rightDataArray = [];
var _leftSelectedItem = 0;
var _catchDataArray = [];

export default class NewSMTHBoardsScreen extends Component {

    constructor(props) {
        super(props);


        var array = [];
        for (var i = 0; i < global.smthBoards.all[0].boards.length; i++) {
            this.$ = cio.load(global.smthBoards.all[0].boards[i]['t']);
            array.push({
                key: i,
                id: this.$('a').first().attr('href').split('/')[3],
                name: this.$('a').first().text(),
            });
        }

        this.state = {
            leftDataArray: global.smthBoards.all,
            rightDataArray: array,
        }

        this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
            this.setState({});
        });
    }

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
        });
    }

    componentWillUnmount() {
        this.refreshViewNotification.remove();
        this._navListener.remove();
    }

    getSectionsFromCatch(index) {
        var array = [];
        for (var i = 0; i < global.smthBoards.all[index].boards.length; i++) {
            this.$ = cio.load(global.smthBoards.all[index].boards[i]['t']);
            array.push({
                key: i,
                id: this.$('a').first().attr('href').split('/')[3],
                name: this.$('a').first().text(),
            });
        }
        this.refs.scrollView.scrollTo({ x: 0, y: 0, animated: false });
        this.setState({
            screenStatus: global.screen.none,
            rightDataArray: array
        });


        // BoardListModel.read(id).then((object) => {
        //     this.refs.scrollView.scrollTo({ x: 0, y: 0, animated: false });
        //     this.setState({
        //         screenStatus: object == null ? global.screen.loading : global.screen.none,
        //         rightDataArray: object == null ? [] : JSON.parse(object.json)
        //     });
        // if (_catchDataArray.indexOf(id) == -1) {
        //     this.getSections(key, id);
        // }
        // });
    }

    getSections(index, section_id) {
        NetworkManager.getNewSections(section_id, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('div[class=row]').html());

            _rightDataArray = [];
            this.$('div[class=board-data-summary]').each(function (i, elem) {
                this.$ = cio.load(elem);
                this.$ = cio.load(this.$('div[class=board-data-summary-name]').html());

                _rightDataArray.push({
                    key: i,
                    id: this.$('a').attr('href').split('/')[2],
                    name: this.$('span').text(),
                    title: this.$('a').first().text(),
                    // title: this.$().children().first().text(),
                    thread: this.$('span[class*=glyphicon-th-list]').parent().text(),
                    reply: this.$('span[class*=glyphicon-align-justify]').parent().text(),
                    user: this.$('span[class*=glyphicon-user]').parent().text(),
                });
            });

            if (_leftSelectedItem == index) {
                this.setState({
                    screenStatus: global.screen.none,
                    rightDataArray: _rightDataArray,
                });
            }

            if (_rightDataArray.length > 0) {
                BoardListModel.create(
                    section_id,
                    JSON.stringify(_rightDataArray)
                );

                if (_catchDataArray.indexOf(section_id) == -1) {
                    _catchDataArray.push(section_id);
                }
            }

        }, (error) => {

        }, (errorMessage) => {

        });
    }

    _leftRenderItem = ({ item }) => {
        return (
            <CellBackground
                showSelect={false}
                onPress={() => {
                    _leftSelectedItem = item.key;
                    this.getSectionsFromCatch(item.key);
                }}
            >
                <View>
                    <View style={item.key == _leftSelectedItem ? styles.leftItemContainerSelected : styles.leftItemContainer}>
                        <Text style={item.key == _leftSelectedItem ? styles.leftItemTitleSelected : styles.leftItemTitle} >{item.title}</Text>
                        {item.key == _leftSelectedItem ? <View style={styles.leftItemVerticalLine} /> : null}
                    </View>
                </View>
            </CellBackground>
        )
    };

    render() {
        return (
            <View style={styles.container} >

                <NavigationBar title='版块' showBottomLine={false} />

                <View style={styles.view} >

                    <View style={styles.leftView} >
                        <FlatList
                            removeClippedSubviews={false}
                            extraData={this.state}
                            data={this.state.leftDataArray}
                            renderItem={this._leftRenderItem}
                        />
                    </View>

                    <Screen status={this.state.screenStatus} >
                        <ScrollView ref='scrollView' >
                            <View style={styles.rightView} >
                                {
                                    this.state.rightDataArray.map((item, i) => {
                                        return (
                                            <Text key={i} style={CommonCSS.itemBoard} onPress={() => {
                                                ReactNavigation.navigate(this.props.navigation, 'newSMTHBoardScreen', { id: '', name: item.name, title: item.id });
                                            }}>
                                                {item.name}
                                            </Text>
                                        );
                                    })
                                }
                            </View>
                        </ScrollView>
                    </Screen>
                </View>
            </View >
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
    get view() {
        return {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: global.colors.whiteColor
        }
    },
    get verticalLine() {
        return {
            width: 1,
            backgroundColor: global.colors.seperatorColor,
        }
    },
    get leftView() {
        return {
            width: 80,
            backgroundColor: '#f9f9f9',
        }
    },
    get leftItemContainer() {
        return {
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
        }
    },
    get leftItemContainerSelected() {
        return {
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: global.colors.whiteColor,
        }
    },
    get leftItemTitle() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.fontColor,
        }
    },
    get leftItemTitleSelected() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.themeColor,
            fontWeight: '600',
        }
    },
    get leftItemVerticalLine() {
        return {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: global.colors.themeColor,
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
}
