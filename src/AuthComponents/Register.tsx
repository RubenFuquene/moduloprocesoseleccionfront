import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Cargo, CargoType, Empleado } from '../types';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useAuthStore } from '../ZustandStores/authStore';
import { useNavigate } from "react-router-dom";
import { Copyright } from './Copyright';

export default function Register() {
  const [cargoTypes, setCargoTypes] = useState<CargoType[]>([]);
  const [selectedCargo, setSelectedCargo] = useState('');
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [nomEmpleado, setNomEmpleado] = useState('');
  const [apelEmpleado, setApelEmpleado] = useState('');
  const [correo, setCorreo] = useState('');

  const { login, setUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Función para obtener los tipos de cargo desde el backend
    const fetchCargoTypes = async () => {
      const response = await fetch('http://localhost:8080/tipo-cargos');
      const data = await response.json();
      setCargoTypes(data);
    };

    fetchCargoTypes();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const empleado: Empleado = {
      condEmpleado: '',
      nomEmpleado,
      apelEmpleado,
      correo,
      fechaNac: birthDate ? birthDate.format('YYYY-MM-DD') : '',
      fechaIngre: dayjs().format('YYYY-MM-DD')
    };

    try {
      // Guardar empleado
      const empleadoResponse = await fetch('http://localhost:8080/empleados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleado),
      });

      if (!empleadoResponse.ok) {
        throw new Error('Error al guardar el empleado');
      }

      const empleadoData: Empleado = await empleadoResponse.json();

      // Guardar cargo
      const cargo: Cargo = {
        empleado: empleadoData,
        tipoCargo: { idTipoCargo: selectedCargo, descTipoCargo: '' },
        fechaInicioCargo: dayjs().format('YYYY-MM-DD'), // Fecha de inicio es hoy
        descCargo: 'New',
        conseCargo: 0
      };

      const cargoResponse = await fetch(`http://localhost:8080/empleados/${empleadoData.condEmpleado}/cargos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cargo),
      });

      if (!cargoResponse.ok) {
        throw new Error('Error al guardar el cargo');
      }

      console.log('Empleado y cargo guardados exitosamente');
      setUser(empleadoData);
      login();
      navigate("/");
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
          Registrarse
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Nombre"
                autoFocus
                value={nomEmpleado}
                onChange={(e) => setNomEmpleado(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Apellido"
                name="lastName"
                autoComplete="family-name"
                value={apelEmpleado}
                onChange={(e) => setApelEmpleado(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Correo"
                name="email"
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Fecha de Nacimiento"
                    value={birthDate}
                    onChange={(newValue) => setBirthDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={selectedCargo}
                onChange={(e) => setSelectedCargo(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Seleccionar tipo de cargo' }}
              >
                <MenuItem value="" disabled>
                  Seleccionar tipo de cargo
                </MenuItem>
                {cargoTypes.map((cargo) => (
                  <MenuItem key={cargo.idTipoCargo} value={cargo.idTipoCargo}>
                    {cargo.descTipoCargo}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                ¿Ya tienes una cuenta? Entrar
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}