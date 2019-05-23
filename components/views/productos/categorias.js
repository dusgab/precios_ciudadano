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
  Text,
  CardItem,
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

export default class Categorias extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        loading: false,      
        categorias: [],      
        error: null,
        loading: true
        }
     
        this.arrayholder = [] ;
      }
    
      async componentDidMount() {
    
        const categorias = await api.fetchCategoria();

        await Font.loadAsync({
          'Roboto': require("native-base/Fonts/Roboto.ttf"),
          'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf"),
          'Roboto_bold': require("native-base/Fonts/Roboto_bold.ttf")
        }); 

        this.setState({ categorias: categorias.data, loading: false });
      
    }

    Capitalize(str){
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
    viewCategoriasListado = () => {
      let botones = []
      let cat = this.state.categorias
      for (let index = 0; index < cat.length; index++) {
          botones.push(
            <CardItem button bordered onPress={() => this.props.navigation.navigate('Productos', {id: cat[index].id})}
              key={"categoria_" + index}
            >
              <Left>
                <Icon
                  active
                  name="store"
                  type="MaterialCommunityIcons"
                  style={{ color: "#78BE20" }}
                />
                <Text style={styles.categoria}>{this.Capitalize(cat[index].nombre)}</Text>
              </Left>
              <Right>
                <Icon 
                  name="arrow-right"
                  type="FontAwesome"
                    />
              </Right>
            </CardItem>
          )
      }
      return <Container style={styles.containerCard}>
              <Header style={styles.header}>
                <Body style={styles.bodyheader}>
                  <Text style={styles.textoheader}>Categorías</Text>
                </Body>
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
            <Spinner color='#78BE20' />
          </Container>
        );
      }
      return (
        <View style={styles.container}>
          {this.state.categorias && this.viewCategoriasListado() }
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
  categoria: {
    fontFamily: 'Roboto_medium',
    fontSize: 16,
    textAlign: 'left',
    color: '#434343'
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
  texto: {
    color: 'gray',
    fontSize: 18, 
    marginLeft: 10, 
    textAlign: 'auto'
  }
});