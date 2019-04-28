import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Constants } from 'expo';
import SingleCardView from 'react-native-simple-card';
import Icon from 'react-native-vector-icons/FontAwesome';

const WIDTH = Dimensions.get('window').width;

export default class Inicio extends React.Component {
  render() {
    return (
        <View style={styles.container}>
        <SingleCardView
            elevation={1}
            shadowColor="rgb(50,50,50)"
            shadowOpacity={1}
            margin={0}
            height={100}
            width={WIDTH - 10}
        >
            <View style={styles.card}>
                <View style={styles.top}>
                {/* <Image
                
                ></Image> */}
                <Icon name="shopping-bag" color="white" size={80}></Icon>
                    <View style={styles.botonesTexto}>
                        <Text style={{ padding: 10, fontSize: 24, color: '#fff' }}>
                            Precios Correntinos
                        </Text>
                        <Text style={{ padding: 10, fontSize: 16, color: '#fff' }}>
                            Los precios Cuidados al alcance de tu mano!
                        </Text>
                    </View>
                </View>
            </View>
        </SingleCardView>
        <SingleCardView
            elevation={1}
            shadowColor="rgb(50,50,50)"
            shadowOpacity={1}
            margin={0}
            height={80}
            width={WIDTH - 20}
        >
            <View style={styles.card}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Categorias')}
                    style={styles.btnCard}
                >
                <View style={styles.botones}>
                <Icon name="search" color="green" size={80}></Icon>
                    <View style={styles.botonesTexto}>
                        <Text style={{ padding: 10, fontSize: 18 }}>
                            Buscar Productos
                        </Text>
                        <Text style={{ padding: 10, fontSize: 10 }}>
                            Podrá buscar productos por Categoría
                        </Text>
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        </SingleCardView>
        <SingleCardView
            elevation={1}
            shadowColor="rgb(50,50,50)"
            shadowOpacity={1}
            margin={0}
            height={80}
            width={WIDTH - 20}
        >
            <View style={styles.card}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Promociones')}
                    style={styles.btnCard}
                >
                <View style={styles.botones}>
                <Icon name="tags" color="green" size={80}></Icon>
                    <View style={styles.botonesTexto}>
                        <Text style={{ padding: 10, fontSize: 18 }}>
                            Ver Promociones
                        </Text>
                        <Text style={{ padding: 10, fontSize: 10 }}>
                            Encontra las mejores promociones!
                        </Text>
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        </SingleCardView>
        <SingleCardView
            elevation={1}
            shadowColor="rgb(50,50,50)"
            shadowOpacity={1}
            margin={0}
            height={80}
            width={WIDTH - 20}
        >
            <View style={styles.card}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Ahorros')}
                    style={styles.btnCard}
                >
                <View style={styles.botones}>
                <Icon name="cart-arrow-down" color="green" size={80}></Icon>
                    <View style={styles.botonesTexto}>
                        <Text style={{ padding: 10, fontSize: 18 }}>
                            Ahorros Destacados
                        </Text>
                        <Text style={{ padding: 10, fontSize: 10 }}>
                            Las mejores ofertas están acá!
                        </Text>
                    </View>
                </View>
                </TouchableOpacity>
            </View>
        </SingleCardView>
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
  btnCard: {
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