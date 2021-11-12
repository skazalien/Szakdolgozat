import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Alert,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Appbar from '../Appbar';
import AnswerModal from '../AnswerModal';

var configjson = require('../../config.json');

let token = '';

class RFIDView extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: false,
      rfids: [],
      videos: [],
      currentArduino: '',
    };
  }

  componentDidMount() {
    this.getToken();
  }
  getToken = async () => {
    try {
      token = await AsyncStorage.getItem('token');
      this.getRFIDs();
      this.getVideos();
      console.log('TOKEN: ', token);
    } catch (e) {
      console.log('ERROR:', e);
    }
  };

  getVideos(refreshing) {
    const url = configjson.base_url + 'arduino_postman/arduino_devices.php';

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
        Alert.alert('NO INFOS');
        this.setState({loading: false, refreshing: false});

        return;
      }

      response.json().then(res => {
        console.log('RES Videos: ', res);
        this.setState({videos: res, loading: false, refreshing: false});
      });
    });
  }

  getRFIDs(refreshing) {
    const url = configjson.base_url + 'arduino_postman/rfid_change.php';

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
        Alert.alert('NO INFOS');
        this.setState({loading: false, refreshing: false});

        return;
      }

      response.json().then(res => {
        console.log('RES RFIDs: ', res);
        this.setState({rfids: res, loading: false, refreshing: false});
      });
    });
  }

  changeItem(rfid_id) {
    let formData = new FormData();
    formData.append('rfid_id', rfid_id);
    formData.append('changeRFID', true);

    const url = configjson.base_url + 'arduino_postman/rfid_change.php';

    this.setState({loading: true});

    const headers = {
      token: token,
    };

    console.log('formData: ', formData);
    console.log('headers: ', headers);

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: headers,
    }).then(response => {
      console.log('RES POST: ', response);
      response.json().then(res => {
        console.log('RES: ', res);
      });
    });
  }
  doModalText = () => {
    this.setState({answerModal: true});
  };
  handleModalAnswer = answer => {
    this.setState({answerModal: false, loading: true});

    if (answer || answer != '') {
      const url = configjson.base_url + 'arduino_postman/arduino_devices.php';
      let formData = new FormData();
      formData.append('arduino_id', this.state.currentArduino);
      formData.append('url', answer);
      console.log('Answer: ', answer);
      console.log('Arduino ID', this.state.currentArduino);

      const headers = {
        token: token,
      };

      fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers,
      }).then(response => {
        this.setState({loading: false});
        console.log('RES: ', response);
        if (response.status >= 300) {
          Alert.alert('ERROR');
          return;
        }
        response.json().then(res => {
          console.log('RES: ', res);
        });
      });
    }
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: '100%',
        }}>
        <Appbar
          show_back_button={true}
          text={'Admin Manager'}
          navigation={this.props.navigation}
        />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => (this.getRFIDs(true), this.getVideos(true))}
            />
          }>
          <View
            style={{
              width: '90%',
              marginLeft: 15,
              marginTop: 15,
              marginBottom: 10,
              borderBottomWidth: 2,
              borderColor: '#e2e2e2',
              paddingBottom: 10,
            }}>
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 15,
                fontWeight: 'bold',
                borderBottomWidth: 1,
                borderColor: '#e2e2e2',
                borderRadius: 15,
                color: '#002286',
              }}>
              RFID IDs to Reset
            </Text>
          </View>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 20,
              margin: 10,
              paddingTop: 20,
              borderColor: '#CDF1EB',
              borderStyle: 'dashed',
              marginBottom: 50,
            }}>
            {this.state.rfids.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
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
                    borderEndColor: '#black',
                    borderRadius: 15,
                    backgroundColor: '#FFFDFC',
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('Home');
                  }}>
                  <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      {index + 1}. RFID ID: {item}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.changeItem(item);
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={RFIDStyles.changeText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <View
            style={{
              width: '90%',
              marginLeft: 15,
              marginTop: 15,
              marginBottom: 10,
              borderBottomWidth: 2,
              borderColor: '#e2e2e2',
              paddingBottom: 10,
            }}>
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 15,
                fontWeight: 'bold',
                borderBottomWidth: 1,
                borderColor: '#e2e2e2',
                borderRadius: 15,
                color: '#002286',
              }}>
              Arduino IDs to Add Video Streaming to
            </Text>
          </View>
          <View
            style={{
              borderWidth: 2,
              borderRadius: 20,
              margin: 10,
              paddingTop: 20,
              borderColor: '#CDF1EB',
              borderStyle: 'dashed',
              marginBottom: 50,
            }}>
            {this.state.videos.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
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
                    borderEndColor: '#black',
                    borderRadius: 15,
                    backgroundColor: '#FFFDFC',
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('Home');
                  }}>
                  <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      {index + 1}. Arduino ID: {item.arduino_id}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          paddingLeft: 15,
                        }}>
                        URL:
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: '#3E8DF6',
                        }}>
                        {' https://'}
                        {item.video_url}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.doModalText(item.arduino_id),
                        this.setState({currentArduino: item.arduino_id});
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={RFIDStyles.changeText}>Change</Text>
                    <AnswerModal
                      is_visible={this.state.answerModal}
                      handleAnswer={this.handleModalAnswer.bind(this)}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default RFIDView;

const RFIDStyles = StyleSheet.create({
  changeText: {
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
});
