import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../ZustandStores/authStore';
import { Copyright } from './Copyright';

function Login() {
  const [codigoEmpleado, setCodigoEmpleado] = useState('');
  const { setUser, login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/empleados/${codigoEmpleado}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ condEmpleado: codigoEmpleado }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }

      const userData = await response.json();
      if(userData)
      {
        setUser(userData);
        login();
        navigate('/dashboard'); 
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{p:0}}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="condEmpleado"
                label="Código de Empleado"
                name="condEmpleado"
                autoComplete="condEmpleado"
                autoFocus
                value={codigoEmpleado}
                onChange={(e) => setCodigoEmpleado(e.target.value)}

              />
            </Grid>
          </Grid>  
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Ingresar
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signup" variant="body2">
                {"¿No tienes una cuenta? Regístrate"}
              </Link>
            </Grid>
          </Grid>          
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}

export default Login;
