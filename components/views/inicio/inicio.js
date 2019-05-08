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
const icono = require('../../../assets/coca15.jpg');
const icono1 = require('../../../assets/galletita.jpg');
const icono2 = require('../../../assets/carne.png');

export default class Inicio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        productos: [],
        filterProductos: [],
        loading: true,
        showToast: false
        }

        this.arrayholder = [];
      }

    async componentDidMount() {

      const productos = await api.fetchProductosSupermecados();

      await Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
      });

      this.arrayholder = productos.data;
      console.log(this.arrayholder);
      this.setState({ productos: productos.data, loading: false });
      
    }

    SearchFilterFunction = (text) => {    
      console.log('filter');
      const newData = this.arrayholder.filter(item => {      
        const itemData = `${item.nombreProducto}`;
         const textData = text;
         console.log(itemData.indexOf(textData));
         return itemData.indexOf(textData) > -1;    
      });    
      this.setState({ filterProductos: newData });  
    };

    _render = () => {
        return (
            <Container style={styles.containerCard}>
            <HeaderCustom/>
            <Header searchBar rounded style={{backgroundColor: '#8DD322'}}>
                <Item >
                    <Input placeholder="Buscar Producto" onChangeText={(text) => this.SearchFilterFunction(text)}/>
                    <Button iconRight transparent primary >
                        <Icon active name='search' type="FontAwesome" style={{fontSize: 20, color: 'gray', paddingRight: 5, paddingBottom: 5}}/>
                    </Button>
                </Item>
            </Header>
            <Item style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text note style={styles.searchBarText}>Por ejemplo fideos, azúcar, harina, jabón líquido</Text>
            </Item>
            <Content >
            <Text style={styles.titulo}>Promociones</Text>
            <Content >
            <Text style={styles.subtitulo}>Almacén</Text>
            <Content horizontal={true} viewIsInsideTabBar={false}>
                <List thumbnail style={styles.list}>
                {datas2.map((data, i) => (
                <ListItem key={data.text} style={styles.listItem}>
                    <Left style={{flex: 2}}>
                    <Thumbnail square size={40} source={icono1} />
                    </Left>
                    <Body style={{flex: 8}}>
                    <Text>{data.text}</Text>
                    <Item style={styles.listItemPrecio}>
                      <Item style={styles.listItemPromo}>
                        <Text style={{color: "#FFF", paddingHorizontal: 7}}>Promo</Text>
                      </Item>
                      <Icon name="exclamation-circle" type="FontAwesome" style={{fontSize: 20, color: '#0098DA', paddingRight: 15}}
                          onPress={() =>
                              Toast.show({
                                text: "70% de descuento en la 2da unidad. Llevando 2 unidades pagás $ 25,00 cada uno. Promo válida desde 01/05/2019 hasta el 10/06/2019",
                                duration: 7000,
                                buttonText: "Ok",
                                type: "success"
                              })}/>
                      <Text note style={{textDecorationLine: 'line-through', color: 'gray', textAlign: 'right'}}>
                          $ {data.precio}
                      </Text>
                      <Text style={{alignSelf: 'flex-end', fontSize: 14}}>
                          $ {data.promo}
                      </Text>
                    </Item>
                    </Body>
                    
                </ListItem>
                ))}
            </List>
            </Content>
            <Text style={styles.subtitulo}>Bebidas</Text>
            <Content horizontal={true}>
                <List thumbnail style={styles.list}>
                {datas.map((data, i) => (
                <ListItem key={data.text} style={styles.listItem}>
                    <Left style={{flex: 2}}>
                    <Thumbnail square size={40} source={icono} />
                    </Left>
                    <Body style={{flex: 8}}>
                    <Text>{data.text}</Text>
                    <Item style={styles.listItemPrecio}>
                      <Item style={styles.listItemPromo}>
                        <Text style={{color: "#FFF", paddingHorizontal: 7}}>Promo</Text>
                      </Item>
                      <Icon name="exclamation-circle" type="FontAwesome" style={{fontSize: 20, color: '#0098DA', paddingRight: 15}}
                          onPress={() =>
                              Toast.show({
                                text: "70% de descuento en la 2da unidad. Llevando 2 unidades pagás $ 25,00 cada uno. Promo válida desde 01/05/2019 hasta el 10/06/2019",
                                duration: 7000,
                                buttonText: "Ok",
                                type: "success"
                              })}/>
                      <Text note style={{textDecorationLine: 'line-through', color: 'gray', textAlign: 'right'}}>
                          $ {data.precio}
                      </Text>
                      <Text style={{alignSelf: 'flex-end', fontSize: 14}}>
                          $ {data.promo}
                      </Text>
                    </Item>
                    </Body>
                    
                </ListItem>
                ))}
            </List>
            </Content>
            <Text style={styles.subtitulo}>Carnicería</Text>
            <Content horizontal={true}>
                <List thumbnail style={styles.list}>
                {datas3.map((data, i) => (
                <ListItem key={data.text} style={styles.listItem}>
                    <Left style={{flex: 2}}>
                    <Thumbnail square size={40} source={icono2} />
                    </Left>
                    <Body style={{flex: 8}}>
                    <Text>{data.text}</Text>
                    <Item style={styles.listItemPrecio}>
                      <Item style={styles.listItemPromo}>
                        <Text style={{color: "#FFF", paddingHorizontal: 7}}>Promo</Text>
                      </Item>
                      <Icon name="exclamation-circle" type="FontAwesome" style={{fontSize: 20, color: '#0098DA', paddingRight: 15}}
                          onPress={() =>
                              Toast.show({
                                text: "70% de descuento en la 2da unidad. Llevando 2 unidades pagás $ 25,00 cada uno. Promo válida desde 01/05/2019 hasta el 10/06/2019",
                                duration: 7000,
                                buttonText: "Ok",
                                position: "top",
                                type: "success"
                              })}/>
                      <Text note style={{textDecorationLine: 'line-through', color: 'gray', textAlign: 'right'}}>
                          $ {data.precio}
                      </Text>
                      <Text style={{alignSelf: 'flex-end', fontSize: 14}}>
                          $ {data.promo}
                      </Text>
                    </Item>
                    </Body>
                    
                </ListItem>
                ))}
            </List>
            </Content>
            </Content>
            </Content>
        </Container>
        );
    }

  _renderProductos = () => {
    let botones = [];
      let prod = this.state.filterProductos;
      console.log("view prodctos" + prod);
      for (let index = 0; index < prod.length; index++) {
          botones.push(
            <CardItem button bordered onPress={() => this.props.navigation.navigate('Detalle', {id: prod[index].id})}
                key={"categoria_" + index}
              >
                <Left style={{ flex: 2 }}>
                <Icon
                    active
                    name="store"
                    type="MaterialCommunityIcons"
                    style={{ color: "green" }}
                  />
                </Left>
                <Body style={styles.bodyCard}>
                    <Text>{prod[index].nombreProducto.toUpperCase()} {prod[index].peso.toUpperCase()}</Text>
                    <Text note>Desde $ {prod[index].precio_lista.toUpperCase()}</Text>
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
                <HeaderCustom/>
                <Header searchBar rounded style={{backgroundColor: '#8DD322'}}>
                  <Item >
                      <Input placeholder="Buscar Producto" onChangeText={(text) => this.SearchFilterFunction(text)}/>
                      <Button iconRight transparent primary >
                          <Icon active name='search' type="FontAwesome" style={{fontSize: 20, color: 'gray', paddingRight: 5, paddingBottom: 5}}/>
                      </Button>
                  </Item>
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
            <Spinner color='green' />
          </Container>
        );
      }
      return (
        <View style={styles.container}>
            {this.state.filterProductos && this._render() }
        </View>
      );
  }
}

const datas = [
    {
      text: "Gaseosa base Cola 1,5 litros COCA COLA",
      precio: "56,50 ",
      promo: "50,00"
    },
    {
      text: "Gaseosa base Cola 1,5 litros MANAOS",
      precio: "43,90 ",
      promo: "39,00"
    },
    {
      text: "Agua sin gas 1,5 litros VILLAVICENCIO",
      precio: "25,50 ",
      promo: "22,00"
    }
  ];

const datas2 = [
{
    text: "Galletitas dulces envasadas sin relleno 150g MANA",
    precio: "22,30 ",
    promo: "20,50"
},
{
    text: "Galletitas de agua envasadas 250g CRIOLLITAS",
    precio: "21,90 ",
    promo: "18,60"
},
{
    text: "Galletitas de agua envasadas 250g EXPRESS",
    precio: "22,90 ",
    promo: "18,80"
}
];

const datas3 = [
    {
        text: "Asado KG NOVILLO",
        precio: "180,50 ",
        promo: "150,00"
    },
    {
        text: "Asado KG NOVILLITO",
        precio: "240,48 ",
        promo: "200,00"
    },
    {
        text: "Pollo entero KG",
        precio: "95,00 ",
        promo: "78,50"
    }
    ];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 25
  },
  containerCard: {
    backgroundColor: "#FFF",
    width: WIDTH,
  },
  titulo: {
    fontSize: 26,
    color: 'black'
  },
  subtitulo: {
    fontSize: 20,
    color: 'gray'
  },
  searchBar: {
    backgroundColor: '#8DD322',
    //width: WIDTH,
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
    marginBottom: 5,
  },
  listItem: {
      width: WIDTH - 10,
      marginBottom: 5,
      borderStyle: 'solid',
      borderWidth: 4,
      borderColor: '#8DD322',
      borderRadius: 5
  },
  listItemPrecio: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderBottomColor: 'transparent',
  },
  listItemPromo: {
    borderColor: 'transparent',
    backgroundColor: 'red',
    marginRight: 10,
    borderRadius: 30
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