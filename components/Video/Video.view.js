import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import Appbar from '../Appbar';
import {WebView} from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import {whileStatement} from '@babel/types';

let token = '';
var configjson = require('../../config.json');
class VideoView extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      rotation: 0,
      video_urls: [],
      actualPage: 0,
      previousPage: -1,
      nextPage: 1,
      maxPage: 1,
    };
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    try {
      token = await AsyncStorage.getItem('token');
      this.getVideoURLs();
    } catch (e) {
      console.log('ERROR:', e);
    }
  };

  onMinus() {
    if (this.state.actualPage == 0) return;
    this.setState({
      actualPage: this.state.actualPage - 1,
      previousPage: this.state.previousPage - 1,
      nextPage: this.state.nextPage - 1,
    });
  }
  onPlus() {
    if (this.state.actualPage == this.state.maxPage) return;
    this.setState({
      actualPage: this.state.actualPage + 1,
      previousPage: this.state.previousPage + 1,
      nextPage: this.state.nextPage + 1,
    });
  }

  rotation(num) {
    this.setState({
      rotation: this.state.rotation + num,
    });
  }
  renderPages() {
    if (this.state.video_urls.length == 0) return null;

    return (
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          flexDirection: 'row',
          justifyContent: 'center',
          width: 100,
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            width: '33%',
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => this.onMinus()}>
          <Text style={{textAlign: 'left', color: 'white', fontWeight: 'bold'}}>
            {' '}
            {'<'} Back{' '}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            width: '33%',
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
            {this.state.actualPage + 1}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            width: '33%',
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => this.onPlus()}>
          <Text
            style={{textAlign: 'right', color: 'white', fontWeight: 'bold'}}>
            Next {'>'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  getVideoURLs() {
    const url = configjson.base_url + 'arduino_postman/videos.php';

    this.setState({loading: true});
    console.log('TOKEN: ', token);
    const headers = {
      token: token,
    };

    fetch(url, {
      method: 'GET',
      headers: headers,
    }).then(response => {
      console.log('RESP: ', response);
      if (response.status >= 300) {
        Alert.alert('No Videos');
        this.setState({loading: false});
        return;
      }

      response.json().then(res => {
        console.log('RES: ', res);
        this.setState({video_urls: res, loading: false});
        this.setState({
          maxPage: this.state.video_urls.length - 1,
        });
      });
    });
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: 'black',
          height: '100%',
          width: '100%',
        }}>
        <Appbar
          show_back_button={true}
          text={'VIDEO'}
          navigation={this.props.navigation}
        />
        {this.state.video_urls.length > 0 &&
          this.state.video_urls[this.state.actualPage] && (
            <WebView
              source={{
                uri:
                  'https://' +
                  this.state.video_urls[this.state.actualPage].video_url,
              }}
              style={{
                transform: [{rotate: this.state.rotation * 90 + 'deg'}],
              }}
            />
          )}
        {this.state.video_urls.length > 0 ? (
          <LinearGradient
            start={{x: 1, y: 1}}
            end={{x: 1, y: 0}}
            colors={['#9C3F3F', '#FF0E0E']}>
            <View>
              <View
                style={{
                  width: '100%',
                  height: 40,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity onPress={() => this.rotation(-1)}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Rotate Left
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.rotation(+1)}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Rotate Right
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {this.renderPages()}
          </LinearGradient>
        ) : (
          <View
            style={{
              height: '33%',
              width: '60%',
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold'}}>
              There's no Video Streaming available with your Arduino IDs
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default VideoView;
