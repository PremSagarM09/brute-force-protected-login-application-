import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Typography, Button, Box } from '@mui/material'

export default function Welcome() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || 'User'

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {name}!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          You have successfully signed in.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Sign out</Button>
      </Box>
    </Container>
  )
}
