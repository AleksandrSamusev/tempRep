import apiClient from '../api.js';

export default {
    createRun(run) {
        return apiClient.post(`/runs`, run);
    },
    getAllRuns() {
        return apiClient.get(`/runs`);
    }
}