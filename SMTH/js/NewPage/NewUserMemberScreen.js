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
    Dimensions
} from 'react-native';

import {
    NetworkManager,
    AvatorImage,
    SeperatorLine,
    LoadingView,
    Screen,
    CellBackground,
    NavigationBar,
} from '../config/Common';
import cio from 'cheerio-without-node-native';

export default class NewUserMemberScreen extends Component {

    _page = 1;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            viewLoading: true,
            screenText: null,
            dataArray: [],
        }

        this.getNewAccountMembers(this._page);
    }

    getNewAccountMembers(page) {
        NetworkManager.getNewAccountMembers(this.props.id, page, (result) => {
            this.$ = cio.load(result, { decodeEntities: false });
            this.$ = cio.load(this.$('ul[class=list-group]').html());

            var dataArray = [];
            if (page != 1) {
                dataArray = dataArray.concat(this.state.dataArray);
            }
            this.$('li').each(function (i, elem) {
                this.$ = cio.load(elem);

                dataArray.push({
                    key: dataArray.length,
                    id: this.$('div[class=board-summary]').children().first().children().first().attr('href').split('/')[2],
                    boardTitle: this.$('div[class=board-summary]').children().first().children().first().text(),
                    boardName: this.$('div[class=board-summary]').children().last().children().first().text(),
                });
            });

            this.setState({
                dataArray: dataArray,
                pullLoading: false,
                pullMoreLoading: false,
                viewLoading: false,
                screenText: null
            });

        }, (error) => {

        }, (errorMessage) => {

        });
    }


    render() {
        return (
            <View style={styles.container} >
                <ScrollView>
                    <View style={styles.rightView} >
                        {
                            this.state.dataArray.map((item) => {
                                return (
                                    <CellBackground
                                        showSelect={false}
                                        onPress={() => {
                                            this.props.navigation.navigate('newBoardListScreen', { id: item.id, name: item.boardName, title: item.boardTitle });
                                        }}
                                    >
                                        <View style={styles.rightItemContainer} >
                                            <Text style={styles.rightItemTitle} >{item.boardName}</Text>
                                        </View>
                                    </CellBackground>
                                );
                            })
                        }
                    </View>
                </ScrollView>
            </View >
        )
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            flexDirection: 'column',
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