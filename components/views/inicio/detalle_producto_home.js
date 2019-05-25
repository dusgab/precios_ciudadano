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

export default class DetalleHome extends React.Component {

    constructor(props) {
      super(props);

      this.props.navigation.addListener('didFocus', () => {
        if ( this.state.isMounted ) {
          this.verificarLista(this.props.navigation.state.params.mpid);
        }
      });

      this.state = {
        productos: [],
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

        const mpid = this.props.navigation.state.params.mpid;
        const productos = await api.fetchBuscarPorId(mpid);

        await Font.loadAsync({
          'Roboto': require("native-base/Fonts/Roboto.ttf"),
          'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
          'Roboto_bold': require("native-base/Fonts/Roboto_bold.ttf")
        });

        this.verificarLista(mpid);
        this.setState({ productos: productos.data, loading: false, isMounted: true, flag: 10, status });
        
    }

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
    }

    calcDistance = newLatLng => {
      const { miLatLng } = this.state;
      const res =  haversine(miLatLng, newLatLng) || 0;
      return res;
    };

    //Funcion para verificar si el producto se encuentra en Mi Lista por marca_producto _id
    verificarLista = async (id) => {
      
       var milista = [];
       const lista = await AsyncStorage.getItem('lista');

       milista = JSON.parse(lista);

       if(milista == null || milista.length == 0) {

         this.setState({ listaVacia: true, flag: 1, enlista: false });

       } else {

          for (let index = 0; index < milista.length; index++) {

              if(milista[index].marca_producto_id == id) {
                this.setState({ enlista: true, flag: 8  });
              } else {
                this.setState({ enlista: false, flag: 9  });
              }

          }
       }
    }

    //Funcion para eliminar un producto de Mi Lista por marca_producti_id
    _eliminarLista = async (id) => {
      var milista = [];
      const lista = await AsyncStorage.getItem('lista');
      milista = JSON.parse(lista);

      for (let index = 0; index < milista.length; index++) {

        if(milista[index].marca_producto_id == id) {
          milista.splice(index, 1);
          this.setState({ enlista: false });
        }

      }

      await AsyncStorage.setItem('lista', JSON.stringify(milista) )
            .then( ()=>{
              console.log("se almaceno lista")
            } )
            .catch( ()=>{
              console.log("error al guardar lista")
      } );

      Toast.show({
        text: "¡Producto eliminado de Mi Lista!",
        textStyle: { textAlign: "center", color: '#FFF' },
        duration: 1500,
        type: "success"
      });
    }

    //Funcion para agregar un producto a Mi Lista por marca_producto_id
    _agregarLista = async (id) => {
    
      var milista = [];
      const item = {
        "device_id": device_id,
        "marca_producto_id": id,
      };

      const lista = await AsyncStorage.getItem('lista');

      if ( lista == null ) {
        this.setState({ enlista: false, flag: 101 });
      } else {
        milista = JSON.parse(lista);
      }
      
      milista.push(item);

      await AsyncStorage.setItem('lista', JSON.stringify(milista) )
            .then( ()=>{
            console.log("se almaceno lista")
            this.setState({ enlista: true });
            } )
            .catch( ()=>{
            console.log("error al guardar lista")
            } );

      Toast.show({
        text: "¡Producto agregado a Mi Lista!",
        textStyle: { textAlign: "center", color: '#FFF' },
        duration: 1500,
        type: "success"
      });
    }

    //Funcion para crear los array con las cards a renderizar
    viewProductosListado = () => {
      let botones = [];
      let botones1 = [];
      let botones2 = [];
      let prod = this.state.productos;
      let last = prod.length - 1;
      let desde = 9999;
      let hasta = 0;
      
      for (let index = 0; index < prod.length; index++) {
        
        const distancia = 0;

        //Si el producto posee latitud y longitud y se concedieron los permisos de ubicación
        //muestro tarjetas con el cálculo de las distancias hacia los supermercados
        //sino solo se muestra la dirección
        if ( prod[index].latitud != null && prod[index].longitud != null && this.state.status === 'granted') {

          let lat = prod[index].latitud;
          let long = prod[index].longitud;

          const newLatLang = { latitude: lat, longitude: long };

          distancia = this.calcDistance(newLatLang);
          const dist = parseFloat(distancia).toFixed(2);

          /*Si no tiene promocion muestro otra tarjeta */
          if(prod[index].precio_promocion != null) {
            
            if(desde > prod[index].precio_promocion) {
              desde = prod[index].precio_promocion;
            }

            if(hasta < prod[index].precio_promocion) {
              hasta = prod[index].precio_promocion;
            }

            botones1.push(
              <CardItem button bordered 
                  key={"categoria_" + index + index}
                >
                  <Body style={styles.bodyCard}>
                    <Item style={{flexDirection: 'row', borderBottomColor: 'transparent'}}>
                      <Item style={{flex: 6, flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                        <Text style={styles.textoTitulo}>{prod[index].supermercado} </Text>
                      </Item>
                      <Item style={{flex: 4, flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                        <Text style={styles.textoPrecioPromo}>${prod[index].precio_promocion}</Text>
                        <Text style={styles.textoPrecioLista}>${prod[index].precio_lista}</Text>
                      </Item>
                    </Item>
                    <Item style={{flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                      <Text style={styles.texto}>{prod[index].promocion} {prod[index].descripcion_promo}</Text>
                      <Text style={styles.texto}>{prod[index].fecha_promo_final != null ? ("Válido hasta el " + prod[index].fecha_promo_final.substring(0, prod[index].fecha_promo_final.length -9)) : (prod[index].fecha_promo_final)}</Text>
                      <Text style={styles.texto}>Fecha relevada {prod[index].fecha_relevada}</Text>
                    </Item>
                    <Item style={{flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                      <Icon active name="map-marker" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 12, marginTop: 7, marginRight: 0 }}/>
                      <Text style={styles.textoUbicacion}>{prod[index].ubicacion}  a  {dist} km</Text>
                    </Item>
                  </Body>
                </CardItem>
              )
          } else if (prod[index].precio_lista != null) {

            if(desde > prod[index].precio_lista) {
              desde = prod[index].precio_lista;
            }

            if(hasta < prod[index].precio_lista) {
              hasta = prod[index].precio_lista;
            }

            botones2.push(
              <CardItem button bordered 
                  key={"promo_" + index + index}
                >
                  <Body style={styles.bodyCard}>
                    <Item style={{flexDirection: 'row', borderBottomColor: 'transparent'}}>
                      <Item style={{flex: 6, flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                        <Text style={styles.textoTitulo}>{prod[index].supermercado} </Text>
                      </Item>
                      <Item style={{flex: 4, flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                        <Text style={styles.textoPrecioPromoNull}>--</Text>
                        <Text style={styles.textoPrecioPromo}>${prod[index].precio_lista}</Text>
                      </Item>
                    </Item>
                    <Item style={{flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                      <Text style={styles.texto}>Fecha relevada {prod[index].fecha_relevada}</Text>
                    </Item>
                    <Item style={{flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                    <Icon active name="map-marker" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 12, marginTop: 7, marginRight: 0 }}/>
                      <Text style={styles.textoUbicacion}>{prod[index].ubicacion}  a  {dist} km</Text>
                    </Item>
                  </Body>
                </CardItem>
              )
          }
        
        } else {

          /*Si no tiene promocion muestro otra tarjeta */
          if(prod[index].precio_promocion != null) {
            
            if(desde > prod[index].precio_promocion) {
              desde = prod[index].precio_promocion;
            }

            if(hasta < prod[index].precio_promocion) {
              hasta = prod[index].precio_promocion;
            }

            
            
            botones1.push(
              <CardItem button bordered 
                  key={"categoria_" + index + index}
                >
                  <Body style={styles.bodyCard}>
                    <Item style={{flexDirection: 'row', borderBottomColor: 'transparent'}}>
                      <Item style={{flex: 6, flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                        <Text style={styles.textoTitulo}>{prod[index].supermercado} </Text>
                      </Item>
                      <Item style={{flex: 4, flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                        <Text style={styles.textoPrecioPromo}>${prod[index].precio_promocion}</Text>
                        <Text style={styles.textoPrecioLista}>${prod[index].precio_lista}</Text>
                      </Item>
                    </Item>
                    <Item style={{flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                      <Text style={styles.texto}>{prod[index].promocion} {prod[index].descripcion_promo}</Text>
                      <Text style={styles.texto}>{prod[index].fecha_promo_final != null ? ("Válido hasta el " + prod[index].fecha_promo_final.substring(0, prod[index].fecha_promo_final.length -9)) : (prod[index].fecha_promo_final)}</Text>
                      <Text style={styles.texto}>Fecha relevada {prod[index].fecha_relevada}</Text>
                    </Item>
                    <Item style={{flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                    <Icon active name="map-marker" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 12, marginTop: 7, marginRight: 0 }}/>
                      <Text style={styles.textoUbicacion}>{prod[index].ubicacion} </Text>
                    </Item>
                  </Body>
                </CardItem>
              )
          } else if (prod[index].precio_lista != null) {

            if(desde > prod[index].precio_lista) {
              desde = prod[index].precio_lista;
            }

            if(hasta < prod[index].precio_lista) {
              hasta = prod[index].precio_lista;
            }

            botones2.push(
              <CardItem button bordered 
                  key={"promo_" + index + index}
                >
                  <Body style={styles.bodyCard}>
                    <Item style={{flexDirection: 'row', borderBottomColor: 'transparent'}}>
                      <Item style={{flex: 6, flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                        <Text style={styles.textoTitulo}>{prod[index].supermercado} </Text>
                      </Item>
                      <Item style={{flex: 4, flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                        <Text style={styles.textoPrecioPromoNull}>--</Text>
                        <Text style={styles.textoPrecioPromo}>${prod[index].precio_lista}</Text>
                      </Item>
                    </Item>
                    <Item style={{flexDirection: 'column', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                      <Text style={styles.texto}>Fecha relevada {prod[index].fecha_relevada}</Text>
                    </Item>
                    <Item style={{flexDirection: 'row', borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                    <Icon active name="map-marker" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 12, marginTop: 7, marginRight: 0 }}/>
                      <Text style={styles.textoUbicacion}>{prod[index].ubicacion} </Text>
                    </Item>
                  </Body>
                </CardItem>
              )
          }
        }

        if (last == index) {
          
          botones.push(
            <Card style={styles.mb}
              key={"categoria_" + index}>
              <CardItem>
                  <Left style={{ flex: 2 }}>
                  <Icon
                      active
                      name="store"
                      type="MaterialCommunityIcons"
                      style={{ color: "#78BE20" }}
                    />
                  </Left>
                  <Body style={styles.bodyCard}>
                      <Text style={styles.textoTitulo}>{prod[index].producto} {prod[index].peso} {prod[index].marca}</Text>
                      <Item style={{flexDirection: 'row', borderBottomColor: 'transparent'}}>
                        <Item style={{flexDirection: 'row', flex: 9, borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                          <Text style={styles.textoPrecio}>Rango de precios ${desde}</Text>
                          <Icon name="arrow-right" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 18, marginLeft: 4, textAlign: 'center'}}/>
                          <Text style={styles.textoPrecio}>${hasta}</Text>
                        </Item>
                      </Item>
                      
                  </Body>
              </CardItem>
              {this.state.enlista ? 
                <Item style={{borderBottomColor: 'transparent', margin: 8}}>
                  <Button transparent style={styles.botonMilistaRem}
                        onPress={() => this._eliminarLista(prod[index].marca_producto_id)}>
                      <Icon name="trash-can-outline" type="MaterialCommunityIcons" style={{ color: "gray"}}/>
                      <Text style={styles.textoMilistaRem}>ELIMINAR DE MI LISTA</Text>
                  </Button>
                </Item>
                :
                <Item style={{borderBottomColor: 'transparent', margin: 8}}>
                  <Button transparent style={styles.botonMilista}
                        onPress={() => this._agregarLista(prod[index].marca_producto_id)}>
                      <Icon name="plus" type="FontAwesome" style={{ color: "#78BE20"}}/>
                      <Text style={styles.textoMilista}>AÑADIR A MI LISTA</Text>
                  </Button>
                </Item>
              }
              
            </Card>
          )
        }
      }
      return <Container style={styles.containerCard}>
              <Header style={styles.header}>
                <Body style={styles.bodyheader}>
                  <Text style={styles.textoheader}>Producto</Text>
                </Body>
              </Header>
              <Content padder style={{flex: 1}}>
                  {botones}
              <Header transparent>
                <Body style={{flex: 6}}>
                  <Text style={styles.textoSuper}>Supermercado</Text>
                </Body>
                <Right style={{flex: 4, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                  <Text style={styles.textoProPre}>Promo</Text>
                  <Text style={styles.textoProPre}>Lista</Text>
                </Right>
              </Header>
                <Card style={styles.mb}>
                  {botones1}
                  {botones2}
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
    flex: 8,
    flexDirection: 'column',
  },
  texto: {
    color: '#434343',
    fontSize: 12,
    textAlign: 'left',
    marginTop: 4,
    fontFamily: 'Roboto',
  },
  textoPrecio: {
    color: '#838181',
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  textoPrecioLista: {
    flex: 5,
    textDecorationLine: 'line-through',
    color: 'gray',
    textAlign: 'right',
    fontSize: 14,
    fontFamily: 'Roboto_medium',
  },
  textoPrecioPromo: {
    flex: 5,
    color: 'gray',
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'Roboto_bold',
  },
  textoPrecioPromoNull: {
    flex: 5,
    color: 'gray',
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'Roboto_bold',
  },
  textoPrecioND: {
    flex: 1,
    color: '#FF1024',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto_medium',
  },
  textoTitulo: {
    color: '#434343',
    fontSize: 16,
    fontFamily: 'Roboto_bold',
  },
  textoUbicacion: {
    color: '#707070',
    fontSize: 12,
    marginTop: 4,
    marginLeft: -7,
    fontFamily: 'Roboto',
  },
  textoMilista: {
    color: '#78BE20',
    fontFamily: 'Roboto_medium',
    fontSize: 14,
  },
  textoMilistaRem: {
    color: 'gray',
    fontFamily: 'Roboto_medium',
    fontSize: 14,
  },
  textoSuper: {
    textAlign: 'left',
    fontSize: 16,
    color: '#434343',
    fontFamily: 'Roboto_bold',
  },
  textoProPre: {
    flex: 5,
    textAlign: 'right',
    fontSize: 16,
    color: '#434343',
    fontFamily: 'Roboto_bold',
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