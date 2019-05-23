import React from 'react';
import { StyleSheet, View, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { Font } from 'expo';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Card,
  Text,
  CardItem,
  Thumbnail,
  Left,
  Right,
  Body,
  Spinner
} from "native-base";

const WIDTH = Dimensions.get('window').width;
const icono = require('../../../assets/icon2.png');
const SIZE = WIDTH * 0.06;

export default class HeaderCustom extends React.Component {

    async componentDidMount() {

        await Font.loadAsync({
          'Roboto': require("native-base/Fonts/Roboto.ttf"),
          'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
          'Roboto_bold': require("native-base/Fonts/Roboto_bold.ttf")
        });        
    }

      render() {
          return (
            <Header style={styles.header}>
            <Body style={styles.body}>
              <Image source={icono} resizeMode='contain' style={{flex:1, height: 40, width: WIDTH}}/>
            </Body>
          </Header>
          );
        }
    }

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    width: WIDTH,
    flexDirection: 'row',
  }
});