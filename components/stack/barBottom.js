import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import Inicio from '../views/inicio/inicio';
import Detalle from '../views/productos/detalle_producto';
import Productos from '../views/productos/productos';
import Categorias from '../views/productos/categorias';
import App from '../../App';

const InicioStack = createStackNavigator({
  Inicio: {screen: Inicio}
},{
  headerMode: 'none',
});

const CategoriasStack = createStackNavigator({
    Categorias: {screen: Categorias},
    Productos: {screen: Productos},
    Detalle: {screen: Detalle},
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
    Inicio: InicioStack,
    Categorias: CategoriasStack
  },
  {
    initialRouteName: 'Inicio',
    navigationOptions: ({ navigation }) => ({
      
      tabBarIcon: () => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Inicio') {
               iconName = 'home';
        }
        if (routeName === 'Categorias') {
           iconName = 'shopping-bag';
        }
        // } else if (routeName === 'Karaoke') {
        //   iconName = 'videocam';
        // } else if (routeName === 'Biblioteca') {
        //   iconName = 'library-music';
        // } else if (routeName === 'Fiesta') {
        //   iconName = 'event-note';
        // } else if (routeName === 'Chamiguito') {
        //   iconName = 'gamepad';
        // }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Icon name={iconName} size={15} color={'white'}/>;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'gray',
      activeBackgroundColor: '#8CA853',
      style: {
        backgroundColor: '#133101',
        borderTopColor: '#8CA853', 
      }
    }
  }
);

const AppContainer = createAppContainer(tabBarBottom);

export default AppContainer;