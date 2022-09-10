import axios from 'axios'

const baseUrl = ''

const get = async (newRes) => {
    console.log('serviceen')
    console.log(newRes)
    /* const response = await axios.get(baseUrl, newRes)
    console.log(response.data)
    return response.data */
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { get }/*   */