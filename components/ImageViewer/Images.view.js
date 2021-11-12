import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {TabRouter} from 'react-navigation';
import Appbar from '../Appbar';
import {useScrollToTop} from '@react-navigation/native';
import ImageView from 'react-native-image-viewing';
import LinearGradient from 'react-native-linear-gradient';

var configjson = require('../../config.json');
let token = '';
class ImagesView extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pictures: [],
      actualPage: 1,
      previousPage: 0,
      nextPage: 2,
      maxPage: 1,
      pageStep: 10,
    };
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    try {
      token = await AsyncStorage.getItem('token');
      this.getPictures();
    } catch (e) {
      console.log('ERROR:', e);
    }
  };

  getPictures() {
    const url = configjson.base_url + 'arduino_postman/pictures.php';

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
        Alert.alert('NO PICTURES');
        this.setState({loading: false});

        return;
      }

      response.json().then(res => {
        console.log('RES: ', res);
        this.setState({pictures: res, loading: false});
        this.setState({
          maxPage:
            Math.floor(this.state.pictures.length / this.state.pageStep) + 1,
        });
      });
    });
  }

  onMinus() {
    if (this.state.actualPage == 1) return;
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

  renderPages() {
    if (this.state.pictures.length == 0) return null;

    return (
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: '33%',
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => this.onMinus()}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'left',
            }}>
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
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}>
            {this.state.actualPage}
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
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'right',
            }}>
            Next {'>'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  setPageStep(num) {
    this.setState({
      pageStep: num,
    });
  }

  renderSize() {
    if (this.state.pictures.length == 0) return null;

    return (
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: '33%',
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => this.setPageStep(10)}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'left',
            }}>
            10
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '33%',
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => this.setPageStep(50)}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}>
            50
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '33%',
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => this.setPageStep(100)}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}>
            100
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    return (
      <View
        style={{
          backgroundColor: '#ffffff',
          height: '100%',
        }}>
        <Appbar
          show_back_button={true}
          text={'Images'}
          navigation={this.props.navigation}
        />
        {this.state.loading && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        )}

        <ScrollView>
          {this.state.pictures
            .slice(
              this.state.actualPage * this.state.pageStep - this.state.pageStep,
              this.state.actualPage * this.state.pageStep,
            )
            .map((item, index) => {
              const imgUrl =
                'https://danbalazs.hu/PHPproject/arduino/arduino_postman/uploads/' +
                item.img_name;
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: '100%',
                    height: 150,
                    marginBottom: 100,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('Image', {url: imgUrl});
                  }}>
                  <View style={{backgroundColor: '#f2f2f2'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      {item.img_name}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      {item.date_added}
                    </Text>
                    <Image
                      style={{width: '100%', height: '100%'}}
                      source={{uri: imgUrl}}
                      resizeMode="cover"
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          <LinearGradient
            start={{x: 1, y: 1}}
            end={{x: 1, y: 0}}
            colors={['#9C3F3F', '#FF0E0E']}>
            {this.renderPages()}
            {this.renderSize()}
          </LinearGradient>
        </ScrollView>
      </View>
    );
  }
}

export default ImagesView;
