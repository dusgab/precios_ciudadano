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

export default class CompararLista extends React.Component {

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
        cat: null,     
        error: null,
        loading: true,
        showToast: false,
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

      this.lista = [];
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
           maximumAge: 30000,
         }
       );

      }
        
      this.verificarLista();
        
      const productos = await api.fetchListarProductosSupermercados();
      const supermercados = await api.fetchSupermercado();

        await Font.loadAsync({
          'Roboto': require("native-base/Fonts/Roboto.ttf"),
          'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
          'Roboto_bold': require("native-base/Fonts/Roboto_bold.ttf")
        });

      this.setState({ productos: productos.data, supermercados: supermercados.data, isMounted: true, flag: 10, status });

      this.calcularLista();

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

    calcularLista = () => {
      //let lista = [];
      let prod = this.state.productos;
      let supers = this.state.supermercados;
      let last = prod.length - 1;
      let desde = 9999;
      let hasta = 0;
      let count = 0;

      if (this.listaArray != null) {

        //POR CADA SUPERMERCADO
        for (let j = 0; j < supers.length; j++) {
          
          let total = 0;
          let cantidad = 0;
          let supers_id = null;

          //POR CADA PRODUCTO
          for (let index = 0; index < prod.length; index++) {

            //POR CADA ELEMENTO DE MI LISTA
            for (let ind = 0; ind < this.listaArray.length; ind++) {
          
              let minimo = 9999;
              let ps_id = null;
              let indice = null;
              
                if(this.listaArray[ind].marca_producto_id === prod[index].marca_producto_id && prod[index].supermercado_id === supers[j].id) {
                              
                  /*Si tiene promocion muestro otra tarjeta */
                  if(prod[index].precio_promocion != null) {
                    
                    if(minimo > prod[index].precio_promocion) {
                      minimo = prod[index].precio_promocion;
                      ps_id = prod[index].producto_supermercado_id;
                      supers_id = prod[index].supermercado_id;
                      indice = index;
                    }
                  } else {

                    if(minimo > prod[index].precio_lista) {
                      minimo = prod[index].precio_lista;
                      ps_id = prod[index].producto_supermercado_id;
                      supers_id = prod[index].supermercado_id;
                      indice = index;
                    }
                  }
                  cantidad++
                  total = total + minimo;
                } 
            }
          }

          if(total > 0) {
            const item = {
              "supermercado_id": supers_id,
              "cantidad": cantidad,
              "total": total,
            }
  
            this.lista.push(item);
          }          
        }
        this.setState({loading: false, });
      }
    }

    detalleComparar = (super_id, total) => {
      console.log("detalle comparar");
      this.props.navigation.navigate('DetalleLista', {super_id: super_id, total: total});
    }

    viewProductosListado = () => {
      let botones = [];
      let prod = this.state.productos;
      
      var obj = [...this.lista];
      obj.sort((a,b) => b.cantidad - a.cantidad);

      console.log("lenght obj " + obj.length);
      console.log(obj);

      for (let index = 0; index < obj.length; index++) {
        let cont = 0;
        for (let ind = 0; ind < prod.length; ind++) {

          const distancia = 0;

            if(obj[index].supermercado_id === prod[ind].supermercado_id && cont == 0) {
              cont++;
              let cantidad = this.listaArray.length - obj[index].cantidad;

              if ( prod[ind].latitud != null && prod[ind].longitud != null && this.state.status === 'granted') {

                let lat = prod[ind].latitud;
                let long = prod[ind].longitud;

                const newLatLang = { latitude: lat, longitude: long };

                distancia = this.calcDistance(newLatLang);
                const dist = parseFloat(distancia).toFixed(2);

                botones.push(
              
                  <CardItem bordered button key={"categoria_" + index + ind} style={{ flex: 1, marginTop: 2 }}
                              onPress={() => this.detalleComparar(prod[ind].supermercado_id, obj[index].total)}>
                      <Left style={{ flex: 2 }}>
                      <Icon
                          active
                          name="store"
                          type="MaterialCommunityIcons"
                          style={{ color: "#78BE20" }}
                        />
                      </Left>
                      <Body style={styles.bodyCard}>
                          <Text style={styles.textoTitulo}>{prod[ind].supermercado} </Text>
                          <Item style={{flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 0}}>
                            <Item style={{flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginLeft: 0}}>
                              {cantidad !== 0 ? <Text style={styles.textoFaltante}>Faltan {cantidad} productos</Text> : null}
                            </Item>
                            <Item style={{flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginLeft: 0}}>
                              <Icon active name="map-marker" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 12, marginTop: 1 }}/>
                              <Text style={styles.textoUbicacion}>{prod[ind].ubicacion} a {dist} km</Text>
                            </Item>
                          </Item>
                      </Body>
                      <Right style={{ flex: 2 }}>
                          <Item style={{flex: 1, borderBottomColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginLeft: 0}}>
                              <Text style={styles.textoPrecio}>Total ${parseFloat(obj[index].total).toFixed(2)}</Text>
                          </Item>
                      </Right>
                  </CardItem>
                )
              } else {

                botones.push(
                
                  <CardItem bordered button key={"categoria_" + index + ind} style={{ flex: 1, marginTop: 2 }}
                          onPress={() => this.detalleComparar(prod[ind].supermercado_id, obj[index].total)}>
                      <Left style={{ flex: 2 }}>
                      <Icon
                          active
                          name="store"
                          type="MaterialCommunityIcons"
                          style={{ color: "#78BE20" }}
                        />
                      </Left>
                      <Body style={styles.bodyCard}>
                          <Text style={styles.textoTitulo}>{prod[ind].supermercado} </Text>
                          <Item style={{flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 0}}>
                            <Item style={{flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginLeft: 0}}>
                            {cantidad !== 0 ? <Text style={styles.textoFaltante}>Faltan {cantidad} productos</Text> : null}
                            </Item>
                            <Item style={{flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginLeft: 0}}>
                              <Icon active name="map-marker" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 12, marginTop: 1 }}/>
                              <Text style={styles.textoUbicacion}>{prod[ind].ubicacion}</Text>
                            </Item>
                          </Item>
                      </Body>
                      <Right style={{ flex: 2 }}>
                          <Item style={{flex: 1, borderBottomColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginLeft: 0}}>
                              <Text style={styles.textoPrecio}>Total ${parseFloat(obj[index].total).toFixed(2)}</Text>
                          </Item>
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
                    <Text style={styles.textoheader}>Comparar Mi Lista</Text>
                  </Body>
                </Header>
                <Content padder style={{flex: 1}}>
                  <Item style={{borderBottomColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={styles.textoDestacado}>¡Ahorrá Más!</Text>
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
    marginTop: 4,
    fontFamily: 'Roboto'
  },
  textoPrecio: {
    color: 'gray',
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'Roboto_bold',
  },
  titulo: {
    color: '#434343',
    fontSize: 14,
    fontFamily: 'Roboto_bold'
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
    fontSize: 16,
    fontFamily: 'Roboto_medium'
  },
  textoUbicacion: {
    color: '#707070',
    fontSize: 12,
    marginLeft: -7,
    fontFamily: 'Roboto',
  },
  textoDestacado: {
    color: '#434343',
    fontSize: 14,
    fontFamily: 'Roboto_medium'
  },
  textoFaltante: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Roboto',
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