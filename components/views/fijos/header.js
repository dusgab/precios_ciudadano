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
            <Body style={styles.body}>
              <Thumbnail square small source={icono} />
              <Title style={styles.texto}>Precios Correntinos</Title>
            </Body>
          </Header>
          );
        }
    }

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#78BE20',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 20, 
    textAlign: 'center',
    fontWeight: 'bold'
  }
});