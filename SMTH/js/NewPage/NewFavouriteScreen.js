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


export default class NewFavouriteScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pullLoading: false,
      viewLoading: true,
      loadingType: 'background',
      screenText: null,
      editing: false,
    }

    this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
      this.setState({});
    });
  }

  componentWillUnmount() {
    this.refreshViewNotification.remove();
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
        <NavigationBar title='收藏' showBottomLine={false} rightButtonTitle={this.state.editing == true ? '完成' : '编辑'}
          rightButtonOnPress={() => {
            this.setState({
              editing: !this.state.editing,
            });
          }}
        />
        <TabPageView titles={['板块', '帖子']}
          pages={[
            (<NewFavouriteBoardScreen navigation={this.props.navigation} editing={this.state.editing} />),
            (<NewFavouriteThreadScreen navigation={this.props.navigation} editing={this.state.editing} />)]}
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
