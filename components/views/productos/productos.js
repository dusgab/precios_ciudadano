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

import api from '../../services/fetchProductos';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const BARRATOP = Constants.statusBarHeight;

export default class Productos extends React.Component {

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
    
        const productos = await api.fetchProductosSupermecados();

        await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });

        this.setState({ productos: productos.data, loading: false });
        this.filtrarProductos(this.props.navigation.state.params.id);
        
    }

    async componentWillMount() {
      
    }

    filtrarProductos = (cat_id) => {
        const filtro = this.state.productos.filter(producto => producto.nombreCategoria == cat_id);
        this.arrayholder = filtro;
        this.setState({ filterProductos: filtro });
    }

    SearchFilterFunction = (text) => {    
      const newData = this.arrayholder.filter(item => {      
        const itemData = `${item.nombreProducto}`;
         const textData = text;
         return itemData.indexOf(textData) > -1;    
      });    
      this.setState({ filterProductos: newData });  
  };

    viewProductosListado = () => {
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
                <Header searchBar rounded style={styles.searchBar}>
                <Item>
                  <Icon active name="search" />
                  <Input placeholder="Buscar Producto" 
                      onChangeText={(text) => this.SearchFilterFunction(text)} />
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
        color: 'gray',
        fontSize: 18, 
        marginLeft: 10, 
        textAlign: 'auto'
      },
      searchBar: {
        backgroundColor: 'green'
      }
    });