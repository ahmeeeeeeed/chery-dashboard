import axios from 'axios'
import { Api } from '../config/constants'
import { getJwt } from '../helpers/userdata'


const api = axios.create({ baseURL: Api.baseURL })


// This for the client side
api.interceptors.request.use((config) => {
	const jwt = getJwt()
	//console.log(jwt)

	if (jwt.token) {
		config.headers.Authorization = ''
		delete config.headers.Authorization
		config.headers.Authorization = `Bearer ${jwt.token}`
	}

	return config
})

export default api
