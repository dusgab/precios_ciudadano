import React from 'react';
import { StyleSheet, View, Dimensions, FlatList, TouchableOpacity } from 'react-native';
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
const icono = require('../../../assets/icono2.png');

export default class HeaderCustom extends React.Component {

    async componentDidMount() {

        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });        
    }

      render() {
          return (
            <Header style={styles.header}>
            <Left>
            <Thumbnail square small source={icono} />
            </Left>
            <Body>
              <Title style={styles.texto}>Precios Correntinos</Title>
            </Body>
          </Header>
          );
        }
    }

const styles = StyleSheet.create({
    header: {
    backgroundColor: '#8DD322',
  },
  texto: {
    color: '#fff',
    fontSize: 18, 
    marginLeft: 10, 
    textAlign: 'center'
  }
});