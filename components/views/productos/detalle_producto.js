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

      this.state = {
        productos: [],
        filterProductos: [],
        cat: null,     
        error: null,
        loading: true,
        showToast: false,
        enlista: false, //piñata
      }
    }

    async componentDidMount() {
        
        const mpid = this.props.navigation.state.params.mpid;
        const productos = await api.fetchBuscarPorId(mpid);
        
        //await AsyncStorage.clear();

        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });

        this.verificarLista(mpid); //piñata
        this.setState({ productos: productos.data, loading: false });
    }

    componentWillMount() {
    }

    componentWillUnmount(){
    } 

    verificarLista = async (id) => {
      //piñata
      var milista = [];
      const lista = await AsyncStorage.getItem('lista');

      if(lista == null) {
        console.log(" milista null");  
      } else {
        milista = JSON.parse(lista);
        for (let index = 0; index < milista.length; index++) {

          if(milista[index].marca_producto_id == id) {
            this.setState({ enlista: true });
          }
        }
      }
    }

    _eliminarLista = async (id) => {
      //piñata
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
        duration: 2000,
        type: "success"
      });
    }

    //Agregar un producto a Mi Lista
    _agregarLista = async (id) => {
    
      var milista = [];
      const item = {
        "device_id": device_id,
        "marca_producto_id": id,
      };

      const lista = await AsyncStorage.getItem('lista');
      
      if(lista == null) {
        console.log("exist null");
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

      const lista3 = await AsyncStorage.getItem('lista');
            milista = JSON.parse(lista3);

      for (let index = 0; index < milista.length; index++) {
            console.log(" ni " +  milista[index].marca_producto_id);
      }

      Toast.show({
        text: "¡Producto agregado a Mi Lista!",
        textStyle: { textAlign: "center", color: '#FFF' },
        duration: 2000,
        type: "success"
      });
    }

    viewProductosListado = () => {
      let botones = [];
      let botones1 = [];
      let botones2 = [];
      let prod = this.state.productos;
      let last = prod.length - 1;
      let desde = 9999;
      let hasta = 0;
      
      for (let index = 0; index < prod.length; index++) {
        
        
        /*Si tiene promocion muestro otra tarjeta */
        if(prod[index].precio_promocion != null) {
          
          if(desde > prod[index].precio_promocion) {
            desde = prod[index].precio_promocion;
          }

          if(hasta < prod[index].precio_promocion) {
            hasta = prod[index].precio_promocion;
          }
          
          console.log("desde" + desde);
          console.log("hasta" + hasta);
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
                    <Icon active name="map-marker" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 12, marginTop: 4 }}/>
                    <Text style={styles.textoUbicacion}>{prod[index].ubicacion}</Text>
                  </Item>
                </Body>
              </CardItem>
            )
        } else {

          if(desde > prod[index].precio_lista) {
            desde = prod[index].precio_lista;
          }

          if(hasta < prod[index].precio_lista) {
            hasta = prod[index].precio_lista;
          }

          console.log("desde" + desde);
          console.log("hasta" + hasta);
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
                    <Icon active name="map-marker" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 12, paddingTop: 4 }}/>
                    <Text style={styles.textoUbicacion}>{prod[index].ubicacion}</Text>
                  </Item>
                </Body>
              </CardItem>
            )
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
                <HeaderCustom/>
                <Content padder style={{flex: 1}}>
                    {botones}
                <Header transparent>
                  <Body style={{flex: 6}}>
                    <Text style={styles.textoSuper}>Supermercado</Text>
                  </Body>
                  <Right style={{flex: 4, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                    <Text style={styles.textoProPre}>Promo</Text>
                    <Text style={styles.textoProPre}>Precio</Text>
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
        {this.state.productos && this.viewProductosListado() }
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
    flex: 8,
    flexDirection: 'column',
  },
  texto: {
    color: '#434343',
    fontSize: 12,
    textAlign: 'left',
    marginTop: 4
  },
  textoPrecio: {
    color: '#838181',
    fontSize: 16,
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
    marginTop: 4,
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