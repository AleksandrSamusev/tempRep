import apiClient from '../api.js'

export default {
    getBrands() {
        return apiClient.get('/brands');
    },

    getBrand(id) {
        return apiClient.get(`/brands/${id}`);
    },

    createBrand(brand) {
        return apiClient.post('/brands', brand);
    },

    updateBrand(id, brand) {
        return apiClient.patch(`/brands/${id}`, brand);
    },

    deleteBrand(id) {
        return apiClient.delete(`/brands/${id}`);
    }
}