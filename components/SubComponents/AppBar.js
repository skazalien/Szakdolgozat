// import React, {Component} from 'react';
// import {
//   Animated,
//   View,
//   Image,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   Dimensions,
//   ImageBackground,
//   Platform,
// } from 'react-native';

// import Localized from '../utils/Localized.js';

// const globalStyle = require('../resources/styles');
// let configjson = require('../app_config.json');

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;
// export const IOS_APPBAR_PADDING = screenHeight / screenWidth >= 2 ? 30 : 10;
// export const IOS_APPBAR_MARGIN = screenHeight / screenWidth >= 2 ? 10 : 0;
// export const APPBAR_MARGINBOTTOM = screenHeight / screenWidth >= 2 ? 30 : 10;

// class AppBar extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       is_showing_search_bar: false,
//       searchbar_width: new Animated.Value(0),
//       appbar_image: false,
//     };
//   }

//   componentDidMount() {
//     console.log(
//       'app_header_icons_color: ',
//       this.props.app_options.app_header_icons_color,
//     );
//     console.log('this.props.search: ', this.props.search);

//     if (
//       this.props.app_options.mobile_app_appbar_bg &&
//       this.props.app_options.mobile_app_appbar_bg != '' &&
//       this.props.app_options.mobile_app_appbar_bg != null
//     ) {
//       this.setState({
//         appbar_image: true,
//       });
//     }
//   }

//   renderDrawerButton = () => (
//     <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
//       <Image
//         style={[
//           globalStyle.backbutton,
//           {
//             tintColor: this.props.app_options.app_header_icons_color,
//             marginStart: this.state.appbar_image ? 30 : null,
//             marginBottom: this.state.appbar_image ? APPBAR_MARGINBOTTOM : null,
//           }, //ha képes appbar van csak akkor
//         ]}
//         source={require('../resources/menu.png')}
//       />
//     </TouchableOpacity>
//   );

//   renderCartButton = () => (
//     <TouchableOpacity
//       onPress={() =>
//         this.props.navigation.navigate('CartScreen', {isUpdating: true})
//       }>
//       <Image
//         style={[
//           globalStyle.cartbutton,
//           {
//             tintColor: this.props.app_options.app_header_icons_color,
//             marginEnd: this.state.appbar_image ? 30 : null,
//             marginBottom: this.state.appbar_image ? APPBAR_MARGINBOTTOM : null,
//           }, // ha képes appbar van csak akkor
//         ]}
//         source={require('../resources/shopping-cart-black-shape.png')}
//       />
//     </TouchableOpacity>
//   );

//   renderEmptyCartButton = () => (
//     <TouchableOpacity onPress={() => this.props.emptyCartCallback()}>
//       <Image
//         style={[
//           globalStyle.cartbutton,
//           {
//             tintColor: this.props.app_options.app_header_icons_color,
//             marginEnd: this.state.appbar_image ? 30 : null,
//             marginBottom: this.state.appbar_image ? APPBAR_MARGINBOTTOM : null,
//           }, //ha képes appbar van csak akkor
//         ]}
//         source={require('../resources/empty-cart.png')}
//       />
//     </TouchableOpacity>
//   );

//   backAction() {
//     if (this.props.confirm_back) {
//       this.props.backActionCallback();
//       return;
//     }

//     this.props.navigation.goBack();
//   }

//   renderBackButton = () => (
//     <TouchableOpacity onPress={this.backAction.bind(this)}>
//       <Image
//         style={[
//           globalStyle.backbutton,
//           {
//             tintColor: this.props.app_options.app_header_icons_color,
//             marginStart: this.state.appbar_image ? 30 : null,
//             marginBottom: this.state.appbar_image ? APPBAR_MARGINBOTTOM : null,
//           }, // csak akkor ha image-es az appbar
//         ]}
//         source={require('../resources/left-arrow.png')}
//       />
//     </TouchableOpacity>
//   );

//   renderLogoImage = () => {
//     let uri = '';
//     if (configjson.is_multi_restaurant) {
//       uri = this.props.app_options.headerlogo;
//       //console.log('RENDERLOGOIMAGE app_header_logo', uri);
//     } else {
//       uri = this.props.app_options.mobil_app_logo;
//       //console.log('RENDERLOGOIMAGE mobil_app_logo', uri);
//     }
//     if (this.props.is_rest_chooser) {
//       uri = this.props.app_options.menulogo;
//     }

//     //console.log('RENDERLOGOIMAGE', uri, this.props.app_options);
//     //ha image-es az appbar akkor masik style logo_for_img
//     return (
//       <Image
//         style={
//           this.state.appbar_image ? globalStyle.logo_for_img : globalStyle.logo
//         }
//         source={{uri: uri}}
//         resizeMode="contain"
//       />
//     );
//   };

//   renderAppBarName = name => (
//     <Text
//       style={[
//         globalStyle.appbarName,
//         {
//           color: this.props.app_options.app_header_icons_color,
//           fontFamily: configjson.fontFamilyBold,
//           marginBottom: this.state.appbar_image
//             ? screenHeight / screenWidth >= 2
//               ? 25
//               : null
//             : null, // csak ha image-es az appbar
//         },
//       ]}>
//       {name}
//     </Text>
//   );

//   renderPlaceholder = () => <View style={globalStyle.cartbutton} />;

//   renderSearchIncon = () => {
//     let img = require('../resources/search_icon.png');
//     if (this.state.is_showing_search_bar) {
//       img = require('../resources/cancel.png');
//     }
//     return (
//       <TouchableOpacity onPress={() => this.handleSearchButton()}>
//         <Image
//           style={[
//             globalStyle.cartbutton,
//             {
//               tintColor: this.props.app_options.app_header_icons_color,
//               marginEnd: this.state.appbar_image ? 30 : null,
//               marginBottom: this.state.appbar_image
//                 ? APPBAR_MARGINBOTTOM
//                 : null,
//             }, // csak akkor ha image-es az appbar
//           ]}
//           source={img}
//         />
//       </TouchableOpacity>
//     );
//   };

//   handleSearchButton = () => {
//     console.log('is_showing_search_bar: ', this.state.is_showing_search_bar);
//     if (!this.state.is_showing_search_bar) {
//       Animated.timing(this.state.searchbar_width, {
//         toValue: 200,
//         duration: 250,
//         useNativeDriver: false,
//       }).start(() => {});
//     } else {
//       Animated.timing(this.state.searchbar_width, {
//         toValue: 0,
//         duration: 250,
//         useNativeDriver: false,
//       }).start(() => {
//         this.setState({is_showing_search_bar: false});
//       });
//     }
//     if (!this.state.is_showing_search_bar) {
//       this.setState({is_showing_search_bar: true});
//     } else {
//       this.props.searchCallback('');
//     }
//   };

//   renderSearchBar = () => {
//     if (!this.props.search) {
//       return null;
//     }

//     if (!this.state.is_showing_search_bar) {
//       return null;
//     }

//     return (
//       <Animated.View style={{width: this.state.searchbar_width}}>
//         <TextInput
//           style={{
//             marginTop: 10,
//             width: '100%',
//             paddingLeft: 10,
//             //margin: 20,
//             justifyContent: 'flex-end',
//             height: 40,
//             borderColor: 'transparent',
//             borderWidth: 0,
//             borderRadius: 5,
//             //backgroundColor: '#ffffff33',
//             backgroundColor:
//               this.props.app_options.app_header_icons_color + '66',
//             color: this.props.app_options.app_header_bg_color,
//             marginBottom: this.state.appbar_image ? APPBAR_MARGINBOTTOM : null, // csak ha image-es az appbar
//           }}
//           underlineColorAndroid="transparent"
//           placeholder={Localized.search}
//           //editable={false}
//           placeholderTextColor={this.props.app_options.app_header_bg_color}
//           //color={this.props.app_options.app_header_bg_color}
//           autoCapitalize="none"
//           onChangeText={this.handleSearching}
//         />
//       </Animated.View>
//     );
//   };

//   handleSearching = text => {
//     console.log('SEARCH: ', text);
//     this.props.searchCallback(text);
//   };

//   measureView(event) {
//     if (this.props.heightCallback) {
//       this.props.heightCallback(event.nativeEvent.layout.height);
//     }
//   }

//   renderAppBar() {
//     let bg_color = this.props.app_options.app_header_bg_color;
//     let opacity = 1;
//     if (this.props.disable_bg) {
//       bg_color = '';
//       opacity = 0;
//     }

//     if (this.state.appbar_image === true) {
//       return (
//         <ImageBackground
//           style={{
//             height: screenHeight / 6.75,
//             width: '100%',
//             justifyContent: 'space-between',
//             borderRadius: 0,
//             paddingTop: Platform.OS === 'ios' ? IOS_APPBAR_PADDING : 0,
//             flexDirection: 'row',
//             alignItems: 'center',
//             marginTop: Platform.OS === 'ios' ? IOS_APPBAR_MARGIN : 0,
//             opacity: opacity,
//           }}
//           source={{uri: this.props.app_options.mobile_app_appbar_bg}}
//           onLayout={event => this.measureView(event)}
//           resizeMode="stretch">
//           {this.props.back_button ? this.renderBackButton() : null}
//           {this.props.drawer_button ? this.renderDrawerButton() : null}
//           {this.props.left_placeholder ? this.renderPlaceholder() : null}
//           {this.props.logo ? this.renderLogoImage() : null}
//           {this.props.app_bar_name && !this.state.is_showing_search_bar
//             ? this.renderAppBarName(this.props.app_bar_name)
//             : null}
//           {this.props.cart_button ? this.renderCartButton() : null}
//           {this.props.empty_cart_button ? this.renderEmptyCartButton() : null}
//           {this.props.right_placeholder ? this.renderPlaceholder() : null}
//           {this.renderSearchBar()}
//           {this.props.search ? this.renderSearchIncon() : null}
//         </ImageBackground>
//       );
//     } else {
//       return (
//         <View
//           style={[globalStyle.appbarcontainer, {backgroundColor: bg_color}]}
//           onLayout={event => this.measureView(event)}>
//           {this.props.back_button ? this.renderBackButton() : null}
//           {this.props.drawer_button ? this.renderDrawerButton() : null}
//           {this.props.left_placeholder ? this.renderPlaceholder() : null}
//           {this.props.logo ? this.renderLogoImage() : null}
//           {this.props.app_bar_name && !this.state.is_showing_search_bar
//             ? this.renderAppBarName(this.props.app_bar_name)
//             : null}
//           {this.props.cart_button ? this.renderCartButton() : null}
//           {this.props.empty_cart_button ? this.renderEmptyCartButton() : null}
//           {this.props.right_placeholder ? this.renderPlaceholder() : null}
//           {this.renderSearchBar()}
//           {this.props.search ? this.renderSearchIncon() : null}
//         </View>
//       );
//     }
//   }

//   render() {
//     return this.renderAppBar();
//   }
// }

// export default AppBar;
