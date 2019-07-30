import axios from 'axios'
import cookies from 'vue-cookies'
import router from '../router'
import {Toast} from 'mint-ui'
import md5 from 'md5'

axios.interceptors.request.use(
  config => {
    config.baseURL = 'http://18.179.142.236:9000'
    config.withCredentials = true
    config.timeout = 5000
    let token = cookies.get('token')
    if (token) {
      config.headers = {
        'token': token
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    if (response.data.retCode === 501) {
      router.push('login')
      Toast({
        message: '请先登录',
        iconClass: 'el-icon-error'
      })
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

async function getAllOrders () {
  try {
    let response = await axios.get('/orders')
    return response.data.data || []
  } catch (e) {
    console.log(e)
  }
}

async function getParkingLotByBoyId (id) {
  try {
    let response = await axios.get(`/employees/${id}/parking-lots`)
    return response.data.data.pageContent || []
  } catch (e) {
    console.log(e)
  }
}

async function login (params) {
  try {
    params.password = md5(params.password)
    const response = await axios.post('/login', params)
    if (response.data.retCode === 200) {
      // set token
      cookies.set('token', response.data.data)
      return true
    }
    return false
  } catch (e) {
    console.log(e)
  }
}

async function getParkingBoyInformation () {
  try {
    const response = await axios.get('/employees/0')
    return response.data.data
  } catch (e) {
    console.log(e)
  }
}

async function updateOrder (params) {
  try {
    const response = await axios.patch('/orders', params)
    return response.data || []
  } catch (e) {
    console.log(e)
  }
}

async function getOrdersByEmployeeId (parkingBoyId, finishFlag) {
  try {
    let response = await axios.get(`/employees/${parkingBoyId}/orders?finish=${finishFlag}`)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const api = {
  getAllOrders,
  login,
  getParkingLotByBoyId,
  getParkingBoyInformation,
  updateOrder,
  getOrdersByEmployeeId
}
export default api
