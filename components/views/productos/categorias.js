import React from 'react';
import { StyleSheet, View, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Constants } from 'expo';
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
  Body
} from "native-base";

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
        }
     
        this.arrayholder = [] ;
      }
    
      async componentDidMount() {
    
        const categorias = await api.fetchCategoria();
        this.setState({ categorias: categorias.data });
      
    }
  
      viewCategoriasListado = () =>{
        let botones = []
        let cat = this.state.categorias
         console.log(cat)
        for (let index = 0; index < cat.length; index++) {
            botones.push(
              <CardItem button bordered onPress={() => this.props.navigation.navigate('Productos', {id: cat[index].nombre})}
                key={"categoria_" + index}
              >
                <Left>
                  <Icon
                    active
                    name="store"
                    type="MaterialCommunityIcons"
                    style={{ color: "green" }}
                  />
                  <Text>{cat[index].nombre.toUpperCase()}</Text>
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
                <Content padder>
                  <Card style={styles.mb}>
                  <CardItem header bordered >
                    <Text  style={color='green'}>Categorías</Text>
                  </CardItem>
                    {botones}
                  </Card>
                </Content>
              </Container>
      }

  render() {
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
    backgroundColor: 'gray',
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
  texto: {
    color: 'gray',
    fontSize: 18, 
    marginLeft: 10, 
    textAlign: 'auto'
  }
});