import apiClient from '../api.js'

export default {
    getUsers() {
        return apiClient.get('/users');
    },

    getUser(id) {
        return apiClient.get(`/users/${id}`);
    },

    createUser(user) {
        return apiClient.post('/users', user);
    },

    updateUser(id, user) {
        return apiClient.put(`/users/${id}`, user);
    },

    deleteUser(id) {
        return apiClient.delete(`/users/${id}`);
    },

    addDevice(id, device) {
      return apiClient.post(`/users/${id}/devices`, device);
    },

    updateDevice(userId, deviceId, device) {
        return apiClient.put(`/users/${userId}/devices/${deviceId}`, device);
    },

    updateAvailability(userId, availabilityPayload) {
        return apiClient.put(`/users/${userId}/availability`, availabilityPayload);
    }
}