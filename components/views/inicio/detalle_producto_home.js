import React from 'react';
import { StyleSheet, View, Dimensions, BackHandler, AsyncStorage } from 'react-native';
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
    Spinner,
    Toast,
    Footer
  } from "native-base";

import HeaderCustom from '../fijos/header';
import api from '../../services/fetchProductos';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;

export default class DetalleHome extends React.Component {

    constructor(props) {
        super(props);
        this.backButtonClick = this.backButtonClick.bind(this);
        this.state = {
        productos: [],
        filterProductos: [],
        cat: null,     
        error: null,
        loading: true,
        showToast: false
        }

        this.arrayholder = [];
        this.blurSuscription = null;
        this.milista = [];
      }

    async componentDidMount() {
        
        const mpid = this.props.navigation.state.params.mpid;
        const productos = await api.fetchBuscarPorId(mpid);

        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });

        this.setState({ productos: productos.data, loading: false });

        //this.verificarLista(mpid);
        
    }

    componentWillMount() {
    }

    componentWillUnmount(){
    } 

    verificarLista = async (id) => {
      const exist = await AsyncStorage.getItem(id);
      let newList = JSON.parse(exist);

      if(!newList) {
        newList = [];
      } else {
        newList.map((result, i, store) => {
            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let value = store[i][1];
            console.log(key + " - " + value);
          });
      }
    }

    backButtonClick(){
      if(this.props.navigation && this.props.navigation.goBack){
        console.log("button click");
        if(this.props.navigation.state.params.flag === 'Inicio') {
          this.props.navigation.navigate('Inicio');
          return true;
        } else {
          this.props.navigation.goBack();
          return true;
        }
        
      }
      return false;
    }

    filtrarProductos = (termino, mpid) => {
        const filtro = this.state.productos.filter(producto => producto.producto === termino && producto.marca_producto_id == mpid);
        //this.arrayholder = filtro;
        console.log(filtro)
        this.setState({ filterProductos: filtro });
    }

    _agregarLista = async (id) => {
    
      // const item = {
      //   "device_id": Constants.installationId,
      //   "marca_producto_id": id,
      // };

      // const exist = await AsyncStorage.getItem(id);
      // let newList = JSON.parse(exist);

      // if(!newList) {
      //   newList = [];
      // }

      // newList.push(item);
     
      // await AsyncStorage.setItem('lista ', JSON.stringify(newList) )
      //       .then( ()=>{
      //       console.log("‘It was saved successfully’")
      //       } )
      //       .catch( ()=>{
      //       console.log("‘There was an error saving the product’")
      //       } );
          
      // const nuevo = await AsyncStorage.getItem(id);
      // let ni = JSON.parse(nuevo);

      // for (let index = 0; index < ni.length; index++) {
      //       console.log(" ni['device_id'] " +  ni[index].marca_producto_id);

      // }

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
              <Item style={{borderBottomColor: 'transparent', margin: 8}}>
                  <Button transparent style={styles.botonMilista}
                        onPress={() => this._agregarLista(prod[index].marca_producto_id)}>
                      <Icon name="plus" type="FontAwesome" style={{ color: "#78BE20"}}/>
                      <Text style={styles.textoMilista}>AÑADIR A MI LISTA</Text>
                  </Button>
              </Item>
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
  searchBar: {
    backgroundColor: '#78BE20'
  }
});