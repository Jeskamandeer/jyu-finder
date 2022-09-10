import axios from 'axios'

const baseUrl = 'http://localhost:8080/get_freetimes'

const get = async (newRes) => {
    console.log('serviceen')
    console.log(newRes)
    const response = await axios.get(baseUrl, {params: newRes})
    console.log(response.data)
    return response.data
}

const getAll = async () => {
    const response = await axios.get('http://localhost:8080/get_freetimes')
    return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { get, getAll }/*   */