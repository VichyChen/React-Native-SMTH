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
    DeviceEventEmitter
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
    CellBackground
} from '../config/Common';

var _rightDataArray = [];
var _leftSelectedItem = 0;

export default class NewBoardScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pullLoading: false,
            viewLoading: true,
            loadingType: 'background',
            screenText: null,
            leftDataArray: global.current.sectionArray != null ? global.current.sectionArray : global.configures.sections,
            rightDataArray: [],
        }

        this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
            this.setState({});
        });

        this.getSections(this.state.leftDataArray[0].id);
    }

    componentWillUnmount() {
        this.refreshViewNotification.remove();
    }

    getSections(section_id) {
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
                    title: this.$('a').text(),
                    thread: this.$('span[class*=glyphicon-th-list]').parent().text(),
                    reply: this.$('span[class*=glyphicon-align-justify]').parent().text(),
                    user: this.$('span[class*=glyphicon-user]').parent().text(),
                });
            });

            this.setState({
                rightDataArray: _rightDataArray,
            });

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
                    this.setState({});
                    this.getSections(item.id);
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

                <NavigationBar title='板块' />

                <View style={styles.view} >

                    <View style={styles.leftView} >
                        <FlatList
                            removeClippedSubviews={false}
                            extraData={this.state}
                            data={this.state.leftDataArray}
                            renderItem={this._leftRenderItem}
                        />
                    </View>

                    <ScrollView>
                        <View style={styles.rightView} >
                            {
                                _rightDataArray.map((item) => {
                                    return (
                                        <CellBackground
                                            showSelect={false}
                                            onPress={() => {
                                                this.props.navigation.navigate('newBoardListScreen', { id: item.id, title: item.name });
                                            }}
                                        >
                                            <View style={styles.rightItemContainer} >
                                                <Text style={styles.rightItemTitle} >{item.name}</Text>
                                            </View>
                                        </CellBackground>
                                    );
                                })
                            }
                        </View>
                    </ScrollView>

                </View>
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
            color: global.colors.fontColor
        }
    },
    get leftItemTitleSelected() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.themeColor
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
