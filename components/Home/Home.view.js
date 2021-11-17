import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Appbar from '../Appbar';
import LogoutModal from '../LogoutModal';
import LinearGradient from 'react-native-linear-gradient';

const {height, width} = Dimensions.get('window');

var configjson = require('../../config.json');

let token = '';

class Home extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: false,
      is_menu_opened: false,
      left_menu_vidth: new Animated.Value(width * -1),
      left_menu_vidth_original: width * -1,
      username: '',
      email: '',
      //pictures: [],
      infos: [],
    };
  }
  handleOpenButton(rfid_id, arduino_id) {
    {
      let formData = new FormData();
      formData.append('rfid_id', rfid_id);
      formData.append('arduino_id', arduino_id);

      const url = configjson.base_url + 'arduino_postman/open_door.php';

      this.setState({loading: true});
      const headers = {
        token: token,
      };

      fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers,
      }).then(response => {
        this.setState({loading: false});
        console.log('formData', formData);
        console.log('headers: ', headers);
        console.log('RES STATUS', response.status);
        if (response.status >= 300) {
          return;
        }
        response.json().then(res => {
          Alert.alert('Door', 'opened');
        });
      });
    }
  }

  componentDidMount() {
    this.getUser();
    this.getToken();
    const unsubscribe = this.props.navigation.addListener('willFocus', () => {
      if (token) this.getInfos();
    });
  }

  getUser = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const email = await AsyncStorage.getItem('email');
      this.setState({username, email});
    } catch (e) {
      console.log('ERROR:', e);
    }
  };
  getToken = async () => {
    try {
      token = await AsyncStorage.getItem('token');
      this.getInfos();
    } catch (e) {
      console.log('ERROR:', e);
    }
  };
  getInfos(refreshing) {
    const url =
      configjson.base_url + 'arduino_postman/rfid_manage.php?only_active=true';

    this.setState({loading: true, refreshing});

    console.log('TOKEN: ', token);
    const headers = {
      token: token,
    };

    fetch(url, {
      method: 'GET',
      headers: headers,
    }).then(response => {
      console.log('RES GETINFOS: ', response);
      if (response.status >= 300) {
        this.setState({loading: false, refreshing: false});
        return;
      }
      response.json().then(res => {
        console.log('RES: ', res);
        this.setState({infos: res, loading: false, refreshing: false});
      });
    });
  }

  openMenu = () => {
    if (!this.state.is_menu_opened) {
      Animated.timing(this.state.left_menu_vidth, {
        toValue: 0,
        duration: 250,
      }).start(() => {});
    } else {
      Animated.timing(this.state.left_menu_vidth, {
        toValue: this.state.left_menu_vidth_original,
        duration: 250,
      }).start(() => {});
    }
    this.setState({is_menu_opened: !this.state.is_menu_opened});
  };

  openLogout = () => {
    this.openMenu();
    this.setState({isLogoutModal: true});
  };

  handleLogoutModal = answer => {
    this.openMenu();
    this.setState({isLogoutModal: false, loading: true});

    if (answer) {
      const url = configjson.base_url + 'login_postman/logout0.php';

      fetch(url, {
        method: 'DELETE',
        headers: {
          token,
        },
      }).then(response => {
        this.setState({loading: false});
        console.log('RES: ', response);
        if (response.status >= 300) {
          Alert.alert('ERROR');
          return;
        }
        AsyncStorage.setItem('token', '');

        this.props.navigation.goBack();
      });
    }
  };

  renderLeftMenu() {
    return (
      <Animated.View
        style={{
          width: 250,
          height: '100%',
          position: 'absolute',
          left: this.state.left_menu_vidth,
        }}>
        <View style={{width: 200, backgroundColor: 'transparent'}}>
          <LinearGradient
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            colors={['#9C3F3F', '#FF0E0E']}>
            <TouchableWithoutFeedback
              style={{width: '100%', height: '100%'}}
              onPress={() => {
                this.openMenu();
              }}>
              <SafeAreaView
                style={{
                  height: '100%',
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    height: 70,
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.05,
                    shadowRadius: 5.41,
                    elevation: 4,
                    backgroundColor: 'transparent',
                  }}>
                  {/*<Image style={{ width: 250, height: 30 }} resizeMode="contain" source={require('../images/onemin_colored.png')} />*/}
                </View>

                <View>
                  <ScrollView
                    style={{width: '100%', marginBottom: 70}}
                    contentContainerStyle={{alignItems: 'center'}}
                    ref={ref => (this.scrollView = ref)}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                      //this.scrollView.scrollToEnd({ animated: true });
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        width: '100%',
                        marginTop: 30,
                        marginBottom: 10,
                        color: 'white',
                      }}>
                      {this.state.username}
                    </Text>

                    <Text
                      style={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        width: '100%',
                        marginBottom: 30,
                        marginTop: 0,
                        color: 'white',
                      }}>
                      {this.state.email}
                    </Text>

                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: 'white',
                      }}></View>

                    <TouchableOpacity
                      onPress={() => {
                        this.openMenu();
                        this.props.navigation.navigate('Manage');
                      }}
                      style={{
                        width: '100%',
                        height: 65,
                        justifyContent: 'center',
                        paddingLeft: 10,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                        Manage
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: 'white',
                      }}></View>

                    <TouchableOpacity
                      onPress={() => {
                        this.openMenu();
                        this.props.navigation.navigate('Images');
                      }}
                      style={{
                        width: '100%',
                        height: 65,
                        justifyContent: 'center',
                        paddingLeft: 10,
                      }}>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        {'Images'}
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: 'white',
                      }}></View>

                    <TouchableOpacity
                      onPress={() => {
                        this.openMenu();
                        this.props.navigation.navigate('Video');
                      }}
                      style={{
                        width: '100%',
                        height: 65,
                        justifyContent: 'center',
                        paddingLeft: 10,
                      }}>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        {'Video'}
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: 'white',
                      }}></View>

                    <TouchableOpacity
                      onPress={() => this.openLogout()}
                      style={{
                        width: '100%',
                        height: 65,
                        justifyContent: 'center',
                        paddingLeft: 10,
                      }}>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        {'Logout'}
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: 'white',
                      }}></View>
                  </ScrollView>
                </View>
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </LinearGradient>
        </View>
      </Animated.View>
    );
  }
  renderInfos(myText, myText2) {
    return (
      <View style={HomeStyles.mainView}>
        <Text style={HomeStyles.mainText}>{myText}</Text>
        <TouchableOpacity
          style={HomeStyles.touchable}
          onPress={() => this.props.navigation.navigate('Manage')}>
          <Text style={HomeStyles.blueText}>{myText2}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  renderDatas() {
    if (this.state.infos.length == 0 && !this.state.loading)
      return this.renderInfos(
        'You Seem to have no Arduino IDs listed',
        'Manage Arduino IDs here',
      );
    return (
      <View>
        {this.state.infos.length > 0 &&
          !this.state.loading &&
          this.renderInfos(
            'My RFID ID: ' + this.state.infos[0].rfid_id,
            'Manage User Arduino IDs here',
          )}
        <View style={HomeStyles.dashedBorder}>
          {this.state.infos.map((item, index) => {
            return (
              <View
                key={index}
                style={HomeStyles.container}
                onPress={() => {
                  this.props.navigation.navigate('Home');
                }}>
                <View style={{marginLeft: 15}}>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    {index + 1}. ARDUINO ID: {item.arduino_id}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.handleOpenButton(item.rfid_id, item.arduino_id);
                  }}>
                  <Text style={HomeStyles.openText}>Open</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={HomeStyles.topBorder}></View>
      </View>
    );
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: '#f1f2f3f4',
          height: '100%',
        }}>
        <Appbar
          openMenu={this.openMenu.bind(this)}
          show_menu={true}
          text={'Home'}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.getInfos(true)}
            />
          }>
          {this.renderDatas()}
        </ScrollView>

        {this.state.is_menu_opened ? (
          <TouchableWithoutFeedback
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#00000099',
              position: 'absolute',
            }}
            onPress={() => this.openMenu()}>
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#00000099',
                position: 'absolute',
              }}></View>
          </TouchableWithoutFeedback>
        ) : null}

        {this.renderLeftMenu()}
        <LogoutModal
          is_visible={this.state.isLogoutModal}
          handleAnswer={this.handleLogoutModal.bind(this)}
        />
      </View>
    );
  }
}

export default Home;

const HomeStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    width: '90%',
    height: 50,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#f2f2f2',
    borderRadius: 15,
    backgroundColor: '#FFFDFC',
  },
  openText: {
    height: 50,
    width: 60,
    backgroundColor: 'red',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  dashedBorder: {
    borderWidth: 2,
    borderRadius: 20,
    margin: 10,
    paddingTop: 20,
    borderColor: '#CDF1EB',
    borderStyle: 'dashed',
    marginBottom: 50,
  },
  mainView: {
    width: '90%',
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 50,
    borderBottomWidth: 2,
    borderColor: '#e2e2e2',
    paddingBottom: 10,
  },
  mainText: {
    paddingLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 15,
  },
  touchable: {
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'flex-start',
  },
  blueText: {
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3E8DF6',
  },
  topBorder: {
    alignSelf: 'center',
    width: '95%',
    borderTopWidth: 2,
    borderColor: '#e2e2e2',
  },
});
