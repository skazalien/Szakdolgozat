import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {TabRouter} from 'react-navigation';
import Appbar from '../Appbar';
import ImageView from 'react-native-image-viewing';

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
      });
    });
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: '100%',
        }}>
        <Appbar
          show_back_button={true}
          text={'Images'}
          navigation={this.props.navigation}
        />
        {this.state.pictures.length == 0 && !this.state.loading && (
          <Text>Yo</Text>
        )}
        <ScrollView>
          {this.state.pictures.map((item, index) => {
            const imgUrl =
              'http://192.168.0.161/PHPproject/arduino/arduino_postman/uploads/' +
              item.img_name;
            return (
              <TouchableOpacity
                key={index}
                style={{
                  width: '100%',
                  height: 150,
                  marginTop: 50,
                  marginBottom: 50,
                }}
                onPress={() => {
                  this.props.navigation.navigate('Image', {url: imgUrl});
                }}>
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
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

export default ImagesView;
