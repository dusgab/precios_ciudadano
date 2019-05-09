import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { Icon } from "native-base";

import Inicio from '../views/inicio/inicio';
import Detalle from '../views/productos/detalle_producto';
import Buscar from '../views/productos/buscarProductos';
import Productos from '../views/productos/productos';
import Categorias from '../views/productos/categorias';
import MiLista from '../views/lista/milista';
import Estadistica from '../views/estadisticas/estadisticas';
import App from '../../App';

const tintColor = "white";

const InicioStack = createStackNavigator({
  Inicio: {screen: Inicio}
},{
  headerMode: 'none',
});

const CategoriasStack = createStackNavigator({
    Categorias: {screen: Categorias},
    Productos: {screen: Productos},
    Detalle: {screen: Detalle},
    Buscar: {screen: Buscar},
  },{
    headerMode: 'none',
  });

const MiListaStack = createStackNavigator({
  Lista: {screen: MiLista}
},{
  headerMode: 'none',
});

const EstadisticaStack = createStackNavigator({
  Estadisticas: {screen: Estadistica}
},{
  headerMode: 'none',
});

// const ProductosStack = createStackNavigator({
//   Productos: {screen: Productos},
//   Detalle: {screen: Detalle},
// },{
//   headerMode: 'none',
// });

const tabBarBottom = createBottomTabNavigator(
  {
    Inicio: {screen: InicioStack,
          navigationOptions: {
            tabBarIcon: ({ focused, tintColor }) => {
                
                return <Icon name="home" type="FontAwesome" style={{ color: "white" }}/>;
          },
        },
      },
    Categorías: {screen: CategoriasStack,
        navigationOptions: {
          tabBarIcon: ({ focused, tintColor }) => {
              
              return <Icon name="shopping-basket" type="FontAwesome" style={{ color: "white" }}/>;
        },
      },
    },
    "Mi Lista": {screen: MiListaStack,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
            
            return <Icon name="star" type="FontAwesome" style={{ color: "white" }}/>;
        },
      },
    },
    "Estadísticas": {screen: EstadisticaStack,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
            
            return <Icon name="bar-chart" type="FontAwesome" style={{ color: "white" }}/>;
        },
      },
    },
  },
  {
    initialRouteName: 'Inicio',
    // navigationOptions: ({ navigation }) => ({
      
    //   tabBarIcon: () => {
    //     const { routeName } = navigation.state;
    //     let iconName;
    //     if (routeName === 'Inicio') {
    //            iconName = 'home';
    //     } else if (routeName === 'Categorias') {
    //        iconName = 'shopping-bag';
    //     }
    //     } else if (routeName === 'Karaoke') {
    //       iconName = 'videocam';
    //     } else if (routeName === 'Biblioteca') {
    //       iconName = 'library-music';
    //     } else if (routeName === 'Fiesta') {
    //       iconName = 'event-note';
    //     } else if (routeName === 'Chamiguito') {
    //       iconName = 'gamepad';
    //     }

    //     You can return any component that you like here! We usually use an
    //     icon component from react-native-vector-icons
    //     return <Icon name={iconName} color="white" type="MaterialCommunityIcons"/>;
    //   },
    // }),
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'gray',
      activeBackgroundColor: '#78BE20',
      style: {
        backgroundColor: '#133101',
        borderTopColor: '#78BE20', 
      }
    }
  }
);

const AppContainer = createAppContainer(tabBarBottom);

export default AppContainer;