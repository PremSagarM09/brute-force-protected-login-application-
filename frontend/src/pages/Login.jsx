import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material'
import CustomSnackbar from '../components/CustomSnackbar'
import { login } from '../api/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' })
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) errs.email = 'Enter a valid email'
    if (!password || password.length < 8) errs.password = 'Password must be at least 8 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await login(email, password)
      setSnack({ open: true, message: res.message || 'Login successful', severity: 'success' })
      // Navigate to welcome page with user name
      setTimeout(() => {
        navigate('/welcome', { state: { name: res.name || email } })
      }, 500)
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
      setSnack({ open: true, message: err.message || 'Login failed', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Brute Force Protected Login Application        
        </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
            <Typography variant="body2" color="red" >
             {errorMessage}
            </Typography>
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Box>
      </Paper>

      <CustomSnackbar
        open={snack.open}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        severity={snack.severity}
        message={snack.message}
      />
    </Container>
  )
}
