import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Constants, Font } from 'expo';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    Card,
    CardItem,
    Text,
    Item,
    Input,
    Thumbnail,
    Left,
    Right,
    Body, 
    Spinner
  } from "native-base";

import HeaderCustom from '../fijos/header';
import api from '../../services/fetchProductos';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;

export default class Estadistica extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        loading: true

        }
      }

    async componentDidMount() {

        await Font.loadAsync({
          'Roboto': require("native-base/Fonts/Roboto.ttf"),
          'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
          'Roboto_bold': require("native-base/Fonts/Roboto_bold.ttf")
        });

        this.setState({ loading: false });
        
    }

    async componentWillMount() {
      
    }

  render() {
    if (this.state.loading) {
      return (
        <Container style={styles.container}>
          <Spinner color='#78BE20' />
        </Container>
      );
    } else {
      return (
        <View style={styles.container}>
        <Container >
        <Header style={styles.header}>
          <Body style={styles.bodyheader}>
            <Text style={styles.textoheader}>Estadísticas</Text>
          </Body>
        </Header>
          <Content padder style={styles.content}>
            <Body style={styles.body}>
              <Icon
                  active
                  name="bar-chart-o"
                  type="FontAwesome"
                  style={{ color: "#78BE20" }}
              />
              <Text style={styles.texto}>ESTADISTICAS</Text>
              <Text style={styles.texto}>PROXIMAMENTE</Text>
            </Body>
          </Content>
        </Container>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: BARRATOP,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    width: WIDTH,
  },
  content: {
    flex: 1,
    backgroundColor: "#FFF",
    width: WIDTH,
    textAlign: 'center'
  },
  header: {
    backgroundColor: '#fff',
  },
  bodyheader: {
    flex: 1,
    width: WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoheader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Roboto_bold',
    color: '#434343'
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 100
  },  
  texto: {
    color: '#434343',
    fontSize: 24, 
    marginLeft: 10, 
    textAlign: 'center'
  }
});