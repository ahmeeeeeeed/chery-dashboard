import api from "./base";
import axios from 'axios'
import { Api } from '../config/constants'


/* export const login = async (email, password) => {
	const res = await api.post("/login", { email, password });
	return res;
};
 */

export const login = async (data) => {
  return await axios.post(`${Api.baseURL}/login`, data)
}
export const logout = async (data) => {
  return await api.post(`${Api.baseURL}/logout`, data)
}
