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
    Spinner,
    Toast,
    Footer
  } from "native-base";

import HeaderCustom from '../fijos/header';
import api from '../../services/fetchProductos';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;

export default class Detalle extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        productos: [],
        filterProductos: [],
        cat: null,     
        error: null,
        loading: true,
        showToast: false
        }

        this.arrayholder = [];
      }

    async componentDidMount() {
    
        //const productos = await api.fetchProductosSupermecados();
        console.log(this.props.navigation.state.params.id);
        const productos = await api.fetchProductoBuscar(this.props.navigation.state.params.id);

        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });

        this.setState({ productos: productos.data, loading: false });
        //this.filtrarProductos(this.props.navigation.state.params.id);
        
    }

    async componentWillMount() {
      
    }

    filtrarProductos = (id) => {
        const filtro = this.state.productos.filter(producto => producto.id == id);
        //this.arrayholder = filtro;
        console.log(filtro)
        this.setState({ filterProductos: filtro });
    }

  //   SearchFilterFunction = (text) => {    
  //     const newData = this.arrayholder.filter(item => {      
  //       const itemData = `${item.nombreProducto}`;
  //        const textData = text;
  //        return itemData.indexOf(textData) > -1;    
  //     });    
  //     this.setState({ filterProductos: newData });  
  // };

    viewProductosListado = () => {
      let botones = [];
      let botones1 = [];
      let botones2 = [];
      let prod = this.state.productos;
      let last = prod.length - 1;
      console.log("last" + last);
      console.log("view detalle" + prod);
        botones.push(
          <Card style={styles.mb}
            key={"categoria_" + 0}>
          <CardItem>
              <Left style={{ flex: 2 }}>
              <Icon
                  active
                  name="store"
                  type="MaterialCommunityIcons"
                  style={{ color: "green" }}
                />
              </Left>
              <Body style={styles.bodyCard}>
                  <Text style={styles.textoTitulo}>{prod[0].producto} {prod[0].peso} {prod[0].marca}</Text>
                  <Item style={{flexDirection: 'row', borderBottomColor: 'transparent'}}>
                    <Item style={{flexDirection: 'row', flex: 9, borderBottomColor: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                      <Text style={styles.textoPrecio}>Rango de precios ${prod[0].precio_lista}</Text>
                      <Icon name="arrow-right" type="MaterialCommunityIcons" style={{ color: "gray", fontSize: 18, marginLeft: 4, textAlign: 'center'}}/>
                      <Text style={styles.textoPrecio}>${prod[last].precio_lista}</Text>
                      {/* <Text style={styles.texto}>Fecha relevada {prod[0]["fecha relevada"].toUpperCase()}</Text> */}
                    </Item>
                  </Item>
                  
              </Body>
            </CardItem>
              <Item style={{borderBottomColor: 'transparent', margin: 5}}>
                <Button transparent style={styles.botonMilista}
                     onPress={() =>
                        Toast.show({
                          text: "¡ Producto agregado a Mi Lista !",
                          textStyle: { textAlign: "center" },
                          duration: 2000,
                          type: "success"
                        })}>
                  <Icon name="plus" type="FontAwesome" style={{ color: "#78BE20"}}/>
                  <Text style={styles.textoMilista}>AÑADIR A MI LISTA</Text>
                </Button>
              </Item>
              </Card>
          )
      for (let index = 0; index < prod.length; index++) {
        /*Si tiene promocion muestro otra tarjeta */
        if(prod[index].precio_promocion != null) {
          botones1.push(
            <CardItem button bordered 
                key={"categoria_" + index + index}
              >
                {/* <Left style={{ flex: 2 }}>
                <Icon
                    active
                    name="store"
                    type="MaterialCommunityIcons"
                    style={{ color: "gray" }}
                  />
                </Left> */}
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
                    <Text style={styles.texto}>Válido hasta el {prod[index].fecha_promo_final.substring(0, prod[index].fecha_promo_final.length -9)}</Text>
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
          botones2.push(
            <CardItem button bordered 
                key={"promo_" + index + index}
              >
                {/* <Left style={{ flex: 2 }}>
                <Icon
                    active
                    name="store"
                    type="MaterialCommunityIcons"
                    style={{ color: "gray" }}
                  />
                </Left> */}
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
                    {/* <Text style={styles.texto}>{prod[index].promocion} {prod[index].descripcion_promo} - Valido hasta el {prod[index].fecha_promo_final.substring(0, prod[index].fecha_promo_final.length -9)}</Text> */}
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
        }
        return <Container style={styles.containerCard}>
                <HeaderCustom/>
                <Content padder style={{flex: 1}}>
                    {botones}
                {/* </Content>
                <Content style={{flex: 8}}> */}
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
    backgroundColor: "#FFF",
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
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: 'green'
  }
});