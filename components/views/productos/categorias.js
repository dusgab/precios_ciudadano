import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Constants, Font } from 'expo';
import {
  Container,
  Header,
  Content,
  Icon,
  Card,
  Text,
  CardItem,
  Left,
  Right,
  Body,
  Thumbnail,
  Spinner
} from "native-base";

import api from '../../services/fetchProductos';

const almacen = require('../../../assets/almacen.png');
const bebidas = require('../../../assets/bebidas.png');
const carniceria = require('../../../assets/carniceria.png');
const farmacia = require('../../../assets/farmacia.png');
const fiambreria = require('../../../assets/fiambreria.png');
const frutas = require('../../../assets/frutas-verduras.png');
const lacteos = require('../../../assets/lacteos.png');
const limpieza = require('../../../assets/limpieza.png');
const panaderia = require('../../../assets/panaderia.png');
const perfumeria = require('../../../assets/perfumeria.png');


const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;

export default class Categorias extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        loading: false,      
        categorias: [],      
        error: null,
        loading: true
        }
     
        this.arrayholder = [] ;
      }
    
      async componentDidMount() {
    
        const categorias = await api.fetchCategoria();

        await Font.loadAsync({
          'Roboto': require("native-base/Fonts/Roboto.ttf"),
          'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
          'Roboto_bold': require("native-base/Fonts/Roboto_bold.ttf")
        }); 
        
        this.setState({ categorias: categorias.data, loading: false });
      
    }

    Capitalize(str){
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
    viewCategoriasListado = () => {
      let botones = []
      let cat = this.state.categorias;
      
      let icono = require('../../../assets/almacen.png');

      for (let index = 0; index < cat.length; index++) {
        
        const nombre = cat[index].nombre;

        switch(nombre) {
 
          case 'almacen':
            icono = almacen;
            break;
          
          case 'bebidas':
            icono = bebidas;
            break;
     
          case 'carniceria':
            icono = carniceria;
            break;
     
          case 'perfumeria':
            icono = perfumeria;
            break;
          
          case 'fiambreria':
            icono = fiambreria;
            break;

          case 'frutas y verduras':
            icono = frutas;
            break;  

          case 'lacteos':
            icono = lacteos;
            break;

          case 'limpieza':
            icono = limpieza;
            break;

          case 'panaderia':
            icono = panaderia;
            break;

          case 'productos farmacéuticos':
            icono = farmacia;
            break;

          default:
            icono = require('../../../assets/almacen.png');
            break;
        
          }

          botones.push(
            <CardItem button bordered onPress={() => this.props.navigation.navigate('Productos', {id: cat[index].id})}
              key={"categoria_" + index}
              style={{ flex: 1, marginTop: 2 }}
            >
              <Left style={{ flex: 1 }}>
                <Thumbnail square  source={icono} style={{ width: 25, height: 25, resizeMode: 'contain' }}/>
              </Left>
              <Body style={{ flex: 7 }}>
                <Text style={styles.categoria}>{this.Capitalize(cat[index].nombre)}</Text>
              </Body>
              <Right style={{ flex: 2 }}>
                <Icon 
                  name="arrow-right"
                  type="FontAwesome"
                    />
              </Right>
            </CardItem>
          )
      }
      
      return <Container style={styles.containerCard}>
              <Header style={styles.header}>
                <Body style={styles.bodyheader}>
                  <Text style={styles.textoheader}>Categorías</Text>
                </Body>
              </Header>
              <Content padder>
                <Card style={styles.mb}>
                  {botones}
                </Card>
              </Content>
            </Container>
    }

    render() {
      if (this.state.loading) {
        return (
          <Container style={styles.container}>
            <Spinner color='#78BE20' />
          </Container>
        );
      }
      return (
        <View style={styles.container}>
          {this.state.categorias && this.viewCategoriasListado() }
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: BARRATOP,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: 'Roboto_medium',
    color: '#434343'
  },
  categoria: {
    fontFamily: 'Roboto_medium',
    fontSize: 16,
    textAlign: 'left',
    color: '#434343'
  },
  containerCard: {
    backgroundColor: "#F9F9F9",
    width: WIDTH,
  },
  mb: {
    marginBottom: 15
  },
  card: {
      flex: 1,
  },
  btnCard: {
      flex: 1,
  },
  texto: {
    color: 'gray',
    fontSize: 18, 
    marginLeft: 10, 
    textAlign: 'auto'
  }
});