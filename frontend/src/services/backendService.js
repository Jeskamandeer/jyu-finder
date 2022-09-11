import axios from 'axios'

const baseUrl = process.env.REACT_APP_BACKEND_URL

const get = async (newRes) => {
    console.log('serviceen')
    console.log(baseUrl)
    console.log(process.env)
    
    const response = await axios.get(baseUrl + "/get_freetimes", {params: newRes})
    console.log(response.data)
    
    return response.data
}

const getAll = async () => {
    const response = await axios.get(baseUrl + "/get_freetimes")
    
    return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { get, getAll }/*   */