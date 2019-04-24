import URL from '../config';

export default {
    async fetchProductoSupermecado() {
        try {
            let response = await fetch(URL + 'producto_supermercado');
            let responseJsonData = await response.json();
            return responseJsonData;
        }
    catch(e) {
        console.log(e)
    }

    },
    async fetchProductos() {
        try {
                let response = await fetch('http://13.90.59.76/ApiKaraoke/public/api/videos');
                let responseJsonData = await response.json();
                return responseJsonData;
            }
        catch(e) {
            console.log(e)
        }
    },
    async fetchCategoria() {
        try {
            let response = await fetch(URL + 'categoria');
            let responseJsonData = await response.json();
            return responseJsonData;
        }
    catch(e) {
        console.log(e)
    }

    },
}