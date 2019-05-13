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
    Spinner
  } from "native-base";

import HeaderCustom from '../fijos/header';
import api from '../../services/fetchProductos';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;

export default class Estadistica extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        productos: [],
        filterProductos: [],
        cat: null,     
        error: null,
        loading: true
        }

        this.arrayholder = [];
      }

    async componentDidMount() {
    
        //const productos = await api.fetchProductosSupermecados();

        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });

        this.setState({ loading: false });
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
      let prod = this.state.filterProductos;
      console.log("view detalle" + prod);
      for (let index = 0; index < prod.length; index++) {
          botones.push(
            <CardItem button bordered 
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
                    <Text>{prod[index].nombreProducto.toUpperCase()} {prod[index].nombreMarca.toUpperCase()} {prod[index].peso.toUpperCase()}</Text>
                    <Text note>Desde $ {prod[index].precio_lista.toUpperCase()} Hasta $ {prod[index].precio_lista.toUpperCase()}</Text>
                    <Text note>Fecha relevada {prod[index].ultimaActualizacion.toUpperCase()}</Text>
                </Body>
              </CardItem>
            )
        }
        return <Container style={styles.containerCard}>
                {/* <Header searchBar rounded style={styles.searchBar}>
                <Item>
                  <Icon active name="search" />
                  <Input placeholder="Buscar Producto" 
                      onChangeText={(text) => this.SearchFilterFunction(text)} />
                </Item>
                </Header> */}

                <HeaderCustom/>
                <Content padder>
                  <Card style={styles.mb}>
                    {botones}
                  </Card>
                </Content>
                <Content padder>
                <Header transparent>
                  <Body style={{flex: 8}}>
                    <Text>Donde comprar este producto</Text>
                  </Body>
                  <Right style={{flex: 2}}>
                    <Text>Precio</Text>
                  </Right>
                </Header>
                  <Card style={styles.mb}>
                  <CardItem button bordered>
                    <Left style={{ flex: 2 }}>
                    <Icon
                        active
                        name="shopping-bag"
                        type="FontAwesome"
                        style={{ color: "gray" }}
                      />
                    </Left>
                    <Body style={{ flex: 8 }}>
                        <Text>IMPULSO</Text>
                        <Text note>IRIGOYEN Y CORDOBA</Text>
                    </Body>
                    <Right style={{ flex: 2 }}>
                      <Text>$ 20,90</Text>
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
        {/* {this.state.productos && this.viewProductosListado() } */}
        <Icon
            active
            name="bar-chart-o"
            type="FontAwesome"
            style={{ color: "green" }}
        />
        <Text style={styles.texto}>ESTADISTICAS</Text>
        <Text style={styles.texto}>PROXIMAMENTE</Text>
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
    flex: 9,
    flexDirection: 'column',
    },
    texto: {
    color: '#434343',
    fontSize: 24, 
    marginLeft: 10, 
    textAlign: 'center'
    },
    searchBar: {
    backgroundColor: 'green'
    }
});