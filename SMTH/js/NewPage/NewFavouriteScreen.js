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
  TabPageView,
  NewFavouriteBoardScreen,
  NewFavouriteThreadScreen,
} from '../config/Common';

var _dataArray;

export default class NewFavouriteScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '收藏',
    headerRight: navigation.state.params ? navigation.state.params.headerRight : null
  });

  constructor(props) {
    super(props);
    this.state = {
      pullLoading: false,
      viewLoading: true,
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

    // this.net_LoadFavorites();
  }

  componentDidMount() {
    this.setBarItemButton('编辑');
  }

  componentWillUnmount() {
    this.refreshViewNotification.remove();
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
        <NavigationBar title='收藏' showBottomLine={false} />
        <TabPageView titles={['板块', '帖子']}
          pages={[
            (<NewFavouriteBoardScreen navigation={this.props.navigation} />),
            (<NewFavouriteThreadScreen navigation={this.props.navigation} />)]}
        />
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
