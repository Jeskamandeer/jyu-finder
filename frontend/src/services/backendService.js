import axios from 'axios'

const baseUrl = process.env.REACT_APP_BACKEND_URL

const get = async (newRes) => {
    const response = await axios.get(baseUrl + "/get_freetimes", {params: newRes})
    
    return response.data
}

const getAll = async () => {
    const response = await axios.get(baseUrl + "/get_freetimes")
    
    return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { get, getAll }/*   */