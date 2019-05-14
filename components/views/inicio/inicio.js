import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Constants, Font } from 'expo';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Card,
    CardItem,
    Item,
    Input,
    Thumbnail,
    Left,
    Right,
    Body,
    Icon,
    List,
    ListItem,
    Spinner,
    Toast
  } from "native-base";

import api from '../../services/fetchProductos';
import HeaderCustom from '../fijos/header';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const icono = require('../../../assets/coca15.jpg');
const icono1 = require('../../../assets/galletita.jpg');
const icono2 = require('../../../assets/carne.png');

export default class Inicio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        promociones: [],
        categorias: [],
        filterProductos: [],
        search: null,
        loading: true,
        showToast: false
        }

        this.searchInput = React.createRef();
        this.arrayholder = [];
      }

    async componentDidMount() {

      const categorias = await api.fetchCategoria();
      const promociones = await api.fetchPromociones();

      await Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
      });

      // this.arrayholder = productos.data;
      // console.log(this.arrayholder);
       this.setState({ promociones: promociones.data, categorias: categorias.data, loading: false });
      
    }

    _handlePress = () => {
      this.searchInput.current._root.clear();
      const text = this.state.search;
      this.props.navigation.navigate('Buscar', {prod: text});
    };

    Capitalize(str){
      return str.charAt(0).toUpperCase() + str.slice(1);
      }

    _render = () => {
        return (
            <Container style={styles.containerCard}>
            <HeaderCustom/>
            <Header searchBar transparent style={{marginBottom: 18}}>
              <Body style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.titulo}>Buscar producto</Text>
                <Item style={styles.searchBar}>
                    {/* <Input placeholder="Buscar Producto" onChangeText={(text) => this.SearchFilterFunction(text)}/> */}
                    <Input placeholder="Ej. fideos" 
                            onChangeText={(text) => this.setState({search:text})}
                            ref={this.searchInput}/>
                    <Button iconRight transparent primary onPress={() => this._handlePress()}>
                        <Icon active name='search' type="FontAwesome" style={{fontSize: 20, color: 'gray'}}/>
                    </Button>
                </Item>
              </Body>
            </Header>
            <Content style={styles.containerBody}>
            <Text style={styles.tituloPromo}>Promociones</Text>
            
            <List style={styles.listCat}>
              {this.state.categorias.map((cat, i) => (
                <Content style={styles.containerPromos} key={i}>
                  <Text style={styles.tituloCat}>{this.Capitalize(cat.nombre)}</Text>
                  <Content horizontal={true} contentContainerStyle={styles.contentContainer}>
                  
                    <ListItem key={"categoria_" + cat.categoria_id} style={{flexDirection: 'column', borderBottomColor: 'transparent', marginLeft: 6}}>
                    
                      <List thumbnail style={styles.list}>
                        {this.state.promociones.map((data, j) => {
                            if (data.precio_promocion != null) {
                              if (cat.nombre === data.categoria) {
                                return (
                                  <ListItem key={"promocion_" + j + i} style={styles.listItem} 
                                  onPress={() => this.props.navigation.push('Detalle', {id: data.producto, mpid: data.marca_producto_id, flag: 'Inicio'})}
                                  >
                                    <Left style={{flex: 2}}>
                                      <Thumbnail square size={40} source={icono1} />
                                    </Left>
                                    <Body style={{flex: 8, flexDirection: 'column'}}>
                                      <Text style={styles.textoProd}>{data.producto} {data.peso}</Text>
                                      <Text style={styles.textoProd}>{data.marca}</Text>
                                      <Text style={styles.textoProd}>{data.supermercado}</Text>
                                      <Item style={styles.listItemPrecio}>
                                        <Item style={styles.listItemPromo}>
                                          <Text style={{color: "#FFF", paddingHorizontal: 7, paddingVertical: 3, fontSize: 16, fontWeight: '500', textAlign: 'center'}}>Promo</Text>
                                        </Item>
                                        <Icon name="exclamation-circle" type="FontAwesome" style={{fontSize: 22, color: '#0098DA', paddingRight: 15}}
                                            onPress={() =>
                                                Toast.show({
                                                  text: <Text>{(data.fecha_promo_final != null) ? (data.promocion + " " + data.descripcion_promo + " - Válido hasta el " + data.fecha_promo_final.substring(0, data.fecha_promo_final.length -9)) : (data.promocion + " " + data.descripcion_promo + " - Válido hasta el ")}</Text>,
                                                  duration: 7000,
                                                  buttonText: "Ok",
                                                  type: "success"
                                                })}/>
                                        <Text style={styles.textoPrecioLista}>
                                            $ {data.precio_lista}
                                        </Text>
                                        <Text  style={styles.textoPrecioPromo}>
                                            $ {data.precio_promocion}
                                        </Text>
                                      </Item>
                                    </Body>
                                  </ListItem> 
                                );
                              }
                            } else {
                              return (
                                <ListItem key={"promocion_" + j + i} style={styles.listItem}>
                                  <Left style={{flex: 2}}>
                                    <Icon name="ban" type="FontAwesome" style={{fontSize: 60, color: '#838181'}}/>
                                  </Left>
                                  <Body style={{flex: 8, flexDirection: 'column'}}>
                                    <Text style={styles.textoProd}>Categoría sin Promociones</Text>
                                  </Body>
                                </ListItem> 
                              );
                            }
                        })
                        }
                      </List>
                </ListItem>
                </Content>
                </Content>
              ))}
            </List>
            </Content>
        </Container>
        );
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
            {this._render() }
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 25
  },
  header: {
    flex: 3
  },
  containerCard: {
    backgroundColor: "#FFF",
    width: WIDTH,
  },
  containerBody: {
  },
  contentContainer: {
    justifyContent: 'flex-start',
    alignContent: 'flex-start'
  },
  containerPromos: {
    flexDirection: 'column',
  },  
  titulo: {
    fontSize: 22,
    color: '#434343',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  tituloPromo: {
    flex: 7,
    fontSize: 20,
    color: '#434343',
    marginBottom: 8,
    marginLeft: 12,
    fontWeight: 'bold'
  },
  tituloCat: {
    fontSize: 18,
    color: '#434343',
    fontWeight: 'bold',
    marginBottom: 2,
    marginLeft: 12,
  },
  textoProd: {
    fontSize: 16,
    color: '#434343',
    fontWeight: 'bold',
    textAlign: 'left'
  },
  subtitulo: {
    fontSize: 20,
    color: 'gray'
  },
  textoPrecioLista: {
    textDecorationLine: 'line-through',
    color: 'gray',
    textAlign: 'right',
    fontSize: 16,
    marginRight: 6
  },
  textoPrecioPromo: {
    color: '#434343',
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold'
  },
  searchBar: {
    borderStyle: 'solid',
    borderTopWidth: 3, 
    borderBottomWidth: 3, 
    borderLeftWidth: 3, 
    borderRightWidth: 3, 
    borderColor: '#78BE20',
    borderRadius: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 2
  },
  searchBarText: {
    color: 'gray',
    textAlign: 'auto'
  },
  top: {
    flex: 3,
    backgroundColor: "green",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
      flex: 2,
  },
  list: {
    flexDirection: 'row',
    borderBottomColor: 'transparent',
    marginLeft: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  listCat: {
    borderBottomColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  listItem: {
    marginLeft: 0,
    marginRight: 14,
    width: WIDTH - 40,
    height: HEIGHT / 5,
    marginBottom: 5,
    borderStyle: 'solid', 
    borderTopWidth: 3, 
    borderBottomWidth: 3, 
    borderLeftWidth: 3, 
    borderRightWidth: 3, 
    borderColor: 'transparent',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 2
},
  listItemPrecio: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderBottomColor: 'transparent',
    marginTop: 10,
  },
  listItemPromo: {
    borderColor: 'transparent',
    backgroundColor: '#ff3300',
    marginRight: 10,
    paddingHorizontal: 3,
    borderRadius: 30,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.6,
    // shadowRadius: 0,
    // elevation: 5
  },    
  botones: {
      flexDirection: 'row',
      alignItems: 'center',
    justifyContent: 'center',
  },
  botonesTexto: {
    flex: 1,
  }
});