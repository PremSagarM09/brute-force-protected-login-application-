import axios from 'axios'

export async function login(email, password) {
  // try to get public IP address (non-blocking; login proceeds if lookup fails)
  let ip
  try {
    const ipResp = await axios.get('https://api.ipify.org?format=json')
    ip = ipResp?.data?.ip
  } catch (e) {
    // If the IP lookup fails (CORS/network), continue without blocking login
    ip = undefined
  }

  try {
    const response = await axios.post('https://brute-force-protected-login-application-6tm0.onrender.com/api/auth/login', {
      email,
      password,
      ip_address: ip,
    })

    const data = response.data

    // Treat explicit success=false or status=false as an error
    if (response.status !== 200 || data?.status === false) {
      throw new Error(data?.message || 'Login failed')
    }

    return data
  } catch (err) {
    // Normalize axios errors
    if (err.response && err.response.data) {
      throw new Error(err.response.data.message || 'Login failed')
    }
    throw new Error(err.message || 'Network error')
  }
}
