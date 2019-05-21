import React from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { Constants, Font } from 'expo';
import {
    Container,
    Header,
    Content,
    Button,
    Icon,
    Card,
    CardItem,
    Text,
    Item,
    Left,
    Right,
    Body, 
    Spinner,
    Toast,
  } from "native-base";

import HeaderCustom from '../fijos/header';
import api from '../../services/fetchProductos';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;
const device_id = Constants.installationId;

export default class DetalleHome extends React.Component {

    constructor(props) {
      super(props);
      this.props.navigation.addListener('didFocus', () => {
        
        if ( this.state.isMounted ) {
          console.log("ismounted on focus detalle lista");
          this.verificarLista();
        }
      });

      this.state = {
        productos: [],
        filterProductos: [],
        cat: null,     
        error: null,
        loading: true,
        showToast: false,
        enlista: false, //piñata
        flag: 0,
        isMounted: false
      }
    }

    async componentDidMount() {
        
      this.verificarLista();
        
      const productos = await api.fetchListarProductosSupermercados();

        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });

      this.setState({ productos: productos.data, loading: false, isMounted: true, flag: 10 });
    }

    verificarLista = async () => {
      var milista = [];
      const lista = await AsyncStorage.getItem('lista');
      if(lista == null) {
        this.setState({ listaVacia: true, flag: 1 });
      } else {
        milista = JSON.parse(lista);
        this.listaArray = milista;
        this.setState({ listaVacia: false, flag: 8 }); 
      }
    }

    viewProductosListado = () => {
      let botones = [];
      let prod = this.state.productos;
      let last = prod.length - 1;
      let desde = 9999;
      let hasta = 0;
      let count = 0;

      if (this.listaArray != null) {
        for (let ind = 0; ind < this.listaArray.length; ind++) {
          
          let minimo = 9999;
          let ps_id = null;
          let indice = null;
          for (let index = 0; index < prod.length; index++) {  
            if(this.listaArray[ind].marca_producto_id === prod[index].marca_producto_id) {
                            
              /*Si tiene promocion muestro otra tarjeta */
              if(prod[index].precio_promocion != null) {
                
                if(minimo > prod[index].precio_promocion) {
                  minimo = prod[index].precio_promocion;
                  ps_id = prod[index].producto_supermercado_id;
                  indice = index;
                }
              } else {

                if(minimo > prod[index].precio_lista) {
                  minimo = prod[index].precio_lista;
                  ps_id = prod[index].producto_supermercado_id;
                  indice = index;
                }
              }
            }
          }

          botones.push(
            
              <CardItem bordered key={"categoria_" + ps_id}>
                  <Left style={{ flex: 2 }}>
                  <Icon
                      active
                      name="store"
                      type="MaterialCommunityIcons"
                      style={{ color: "#78BE20" }}
                    />
                  </Left>
                  <Body style={styles.bodyCard}>
                      <Text style={styles.textoTitulo}>{prod[indice].producto} {prod[indice].peso} {prod[indice].marca} {prod[indice].supermercado}</Text>
                      <Item style={{flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                        <Text style={styles.texto}>Fecha relevada {prod[indice].fecha_relevada}</Text>
                        <Item style={{flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                          <Icon active name="map-marker" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 14, paddingTop: 14 }}/>
                          <Text style={styles.textoUbicacion}>{prod[indice].ubicacion}</Text>
                        </Item>
                      </Item>
                  </Body>
                  <Right style={{ flex: 2 }}>
                      <Item style={{flex: 1, borderBottomColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
                          <Text style={styles.textoPrecio}>${minimo}</Text>
                      </Item>
                  </Right>
              </CardItem>
          )
        }
      }  
        return <Container style={styles.containerCard}>
                <HeaderCustom/>
                <Content padder style={{flex: 1}}>
                  <Item style={{borderBottomColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={styles.textoDestacado}>Precios Destacados</Text>
                  </Item>
                  <Card style={styles.mb} >
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
        {this.state.flag && this.viewProductosListado() }
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
  bodyCard: {
    flex: 6,
    flexDirection: 'column',
  },
  texto: {
    color: '#434343',
    fontSize: 12,
    textAlign: 'left',
    marginTop: 4
  },
  textoPrecio: {
    color: 'gray',
    textAlign: 'right',
    fontSize: 18,
    fontWeight: 'bold'
  },
  textoDestacado: {
    color: "#78BE20",
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 2
  },
  textoPrecioLista: {
    flex: 5,
    textDecorationLine: 'line-through',
    color: 'gray',
    textAlign: 'right',
    fontSize: 14,
  },
  textoPrecioPromo: {
    flex: 5,
    color: 'gray',
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold'
  },
  textoPrecioPromoNull: {
    flex: 5,
    color: 'gray',
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold'
  },
  textoTitulo: {
    color: '#434343',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textoUbicacion: {
    color: '#707070',
    fontSize: 12,
    marginTop: 0,
  },
  textoMilista: {
    color: '#78BE20',
    fontWeight: '400',
    fontSize: 14,
  },
  textoMilistaRem: {
    color: 'gray',
    fontWeight: '400',
    fontSize: 14,
  },
  textoSuper: {
    textAlign: 'left',
    fontSize: 16,
    color: '#434343',
    fontWeight: 'bold'
  },
  textoProPre: {
    flex: 5,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold'
  },
  botonMilista: {
    borderColor: '#78BE20',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  botonMilistaRem: {
    borderColor: 'gray',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  searchBar: {
    backgroundColor: '#78BE20'
  }
});