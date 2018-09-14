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
    BoardItems,
    ImageButton,
    LoadingView,
    Screen,
    ToastUtil,
    NavigationBar,
    CellBackground
} from '../config/Common';

_rightDataArray = [];

export default class NewBoardScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params == undefined ? '版块' : navigation.state.params.text}`,
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                <ImageButton
                    color={global.colors.whiteColor}
                    width={44}
                    height={44}
                    margin={22}
                    source={global.images.icon_search}
                    onPress={() => {
                        navigation.navigate('searchBoardScreen', { id: '' })
                    }} />
            </View>
        ),
    });

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

        this.getSections(this.state.leftDataArray[0].key);
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
                    key: this.$('a').attr('href').split('/')[2],
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
                onPress={() => {
                    this.getSections(item.key);
                }}
            >
                <View style={styles.leftItemContainer}>
                    <Text style={styles.leftItemTitle} >{item.title}</Text>
                    <SeperatorLine />
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

                    {/* <View style={styles.rightView} >
                        <FlatList
                            removeClippedSubviews={false}
                            extraData={this.state}
                            data={this.state.rightDataArray}
                            renderItem={this._rightRenderItem}
                            horizontal={false}
                            numColumns={3}
                        />
                    </View> */}

                    <ScrollView>
                        <View style={styles.rightView} >
                            {
                                _rightDataArray.map((item) => {
                                    return (
                                        <CellBackground
                                            showSelect={false}
                                            onPress={() => {
                                                this.props.navigation.navigate('newBoardListScreen', { id: item.key, title: item.name });
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
    get leftView() {
        return {
            width: 80,
            backgroundColor: '#F5F5F5'
        }
    },
    get leftItemContainer() {
        return {
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5F5F5'
        }
    },
    get leftItemTitle() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.fontColor
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
            backgroundColor: '#F5F5F5',
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
