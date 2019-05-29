import React from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { Constants, Font, Permissions } from 'expo';
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
  import haversine from "haversine";

import api from '../../services/fetchProductos';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;
const device_id = Constants.installationId;

export default class DetalleLista extends React.Component {

    constructor(props) {
      super(props);
      this.props.navigation.addListener('didFocus', () => {
        
        if ( this.state.isMounted ) {
          this.verificarLista();
        }
      });

      this.state = {
        productos: [],
        supermercados: [],
        filterProductos: [],
        error: null,
        loading: true,
        enlista: false,
        flag: 0,
        isMounted: false,
        //Geo
        miLatLng: {
          latitude: 0,
          longitude: 0
        },
        status: null,
      }

      this.listaArray = [];
    }

    async componentDidMount() {

      //Permisos para geolocalizacion y calcular la distancia hacia los supermercados
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      if ( status === 'granted' ) {

       this.watchID = navigator.geolocation.watchPosition(
         position => {
           const { latitude, longitude } = position.coords;

           const miLatLng = {
             latitude,
             longitude
           };
           
           this.setState({ miLatLng });

         },
           error => console.log("error en wathc" + error),
         {
           enableHighAccuracy: true,
           timeout: 20000,
           maximumAge: 1000,
         }
       );

      }
        
      this.verificarLista();
      const productos = await api.fetchListarProductosSupermercados();

        await Font.loadAsync({
          'Roboto': require("native-base/Fonts/Roboto.ttf"),
          'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
          'Roboto_bold': require("native-base/Fonts/Roboto_bold.ttf")
        });

      this.setState({ productos: productos.data, isMounted: true, loading: false, flag: 10, status });

    }

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
    }

    calcDistance = newLatLng => {
      const { miLatLng } = this.state;
      const res =  haversine(miLatLng, newLatLng) || 0;
      return res;
    };

    verificarLista = async () => {
      console.log("verificar lista detalle lista");
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
        let super_id = this.props.navigation.state.params.super_id;
        let total = this.props.navigation.state.params.total;

        if (this.listaArray != null) {

            for (let ind = 0; ind < this.listaArray.length; ind++) {
            
                for (let index = 0; index < prod.length; index++) {

                    if(this.listaArray[ind].marca_producto_id === prod[index].marca_producto_id && super_id === prod[index].supermercado_id ) {
                            
                        let precio = 0;

                        if(prod[index].precio_promocion != null) {
                            precio = prod[index].precio_promocion;
                        } else {
                            precio = prod[index].precio_lista;
                        }

                        botones.push(
                            <CardItem bordered
                                key={"categoria_" + index + ind}
                                style={{ flex: 1, marginTop: 2, borderBottomColor: 'transparent' }}
                            >
                                <Body style={styles.bodyCard} >
                                    <Text style={styles.texto}>{prod[index].producto} {prod[index].marca} {prod[index].peso}</Text>
                                </Body>
                                <Right style={{ flex: 2 }}>
                                    <Text style={styles.texto}>${parseFloat(precio).toFixed(2)}</Text>
                                </Right>
                            </CardItem>
                        )
                    }
                }
            }
        }

        return <Container style={styles.containerCard}>
                <Header style={styles.header}>
                  <Body style={styles.bodyheader}>
                    <Text style={styles.textoheader}>Detalle de Mi Lista</Text>
                  </Body>
                </Header>
                <Content padder style={{flex: 1}}>
                  <Item style={{borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                      <Text style={styles.textoDestacado}>Productos</Text>
                  </Item>
                  <Card style={styles.mb} >
                    {botones}
                    <CardItem bordered key={"total_"} style={{ flex: 1, borderTopColor: '#e3e3e3', borderTopWidth: 0.5 }}>
                        <Right style={{ flex: 4 }}>
                            <Text style={styles.textoPrecio}>Total ${parseFloat(total).toFixed(2)}</Text>
                        </Right>
                    </CardItem>
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
    container: { //
      flex: 1,
      paddingTop: BARRATOP,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerCard: { //
      backgroundColor: "#F9F9F9",
      width: WIDTH,
    },
    header: { //
      backgroundColor: '#fff',
    },
    bodyheader: { //
      flex: 1,
      width: WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textoheader: { //
      textAlign: 'center',
      fontSize: 20,
      fontFamily: 'Roboto_bold',
      color: '#434343'
    },
    mb: { //
      marginBottom: 15
    },
    card: {
        flex: 1,
    },
    bodyCard: { //
      flex: 6,
      flexDirection: 'column',
    },
    texto: { //
      color: '#434343',
      fontSize: 12,
      textAlign: 'left',
      marginTop: 4,
      fontFamily: 'Roboto'
    },
    textoPrecio: { //
      color: 'gray',
      textAlign: 'right',
      fontSize: 14,
      fontFamily: 'Roboto_bold',
    },
    textoDestacado: { //
      color: '#434343',
      fontSize: 14,
      fontFamily: 'Roboto_medium',
      textAlign: 'left'
    }    
  });