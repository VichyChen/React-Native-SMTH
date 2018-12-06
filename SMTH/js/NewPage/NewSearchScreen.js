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
    NavigatorTitleButton,
    BoardItems,
    ToastUtil,
    Screen,
    ReactNavigation,
    NavigationBar,
    TabPageView,
    NewSearchArticleScreen,
    NewSearchBoardScreen,
    NewSearchAccountScreen,
} from '../config/Common';

export default class NewSearchScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: false,
            keyword: null,
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <NavigationBar
                    navigation={this.props.navigation}
                    showBottomLine={false}
                    rightButtonTitle={'取消'}
                    rightButtonTitleColor={global.colors.gray1Color}
                    rightButtonOnPress={() => {
                        this.props.navigation.goBack();
                    }}
                >
                    <View style={styles.navigationView}>
                        <View style={styles.textInputView}>
                            <Image style={styles.searchImage} source={global.images.icon_search} />
                            <TextInput
                                style={styles.textInput}
                                placeholder={'输入关键字'}
                                clearButtonMode={'while-editing'}
                                onChangeText={(text) => {
                                    this.setState({ 
                                        search: false, 
                                        keyword: text
                                     });
                                }}
                                value={this.state.keyword}
                                returnKeyType={'search'}
                                autoCapitalize={'none'}
                                autoFocus={true}
                                onSubmitEditing={(event) => {
                                    this.setState({
                                        search: true,
                                        keyword: event.nativeEvent.text,
                                    });
                                    // this.net_QueryBoard(event.nativeEvent.text);
                                }}
                            />
                        </View>
                    </View>
                </NavigationBar>

                {
                    this.state.search == false ? null :
                        <TabPageView
                            titles={['文章', '版面', '用户']}
                            pages={[
                                (<NewSearchArticleScreen navigation={this.props.navigation} keyword={this.state.keyword} />),
                                (<NewSearchBoardScreen navigation={this.props.navigation} keyword={this.state.keyword} />),
                                (<NewSearchAccountScreen navigation={this.props.navigation} keyword={this.state.keyword} />),
                            ]}
                        />
                }
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
    get navigationView() {
        return {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        }
    },
    get textInputView() {
        return {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginLeft: global.constants.Margin,
            height: 28,
            width: global.constants.ScreenWidth - global.constants.Margin - 10 - 44 - 10,
            backgroundColor: global.colors.backgroundGrayColor,
            borderRadius: 4,
        }
    },
    get textInput() {
        return {
            marginLeft: 10,
            backgroundColor: global.colors.clearColor,
            height: 28,
            flex: 1,
            fontSize: global.configures.fontSize15,
            color: global.colors.fontColor,
        }
    },
    get searchImage() {
        return {
            marginLeft: 10,
            height: 18,
            width: 18,
            tintColor: global.colors.gray1Color,
        }
    },
}
