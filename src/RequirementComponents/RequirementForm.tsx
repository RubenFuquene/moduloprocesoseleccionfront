import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import WorkIcon from '@mui/icons-material/Work';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { MenuItem, Select } from '@mui/material';
import { Empleado, Requerimiento } from '../types';
import { useAuthStore } from '../ZustandStores/authStore';

export default function RequirementForm() {
  const [desFuncion, setDesFuncion] = useState('');
  const [descCarreras, setDescCarreras] = useState('');
  const [nvacantes, setNvacantes] = useState('');
  const [salarioMin, setSalarioMin] = useState('');
  const [salarioMax, setSalarioMax] = useState('');
  const [analysts, setAnalysts] = useState<Empleado[]>([]);
  const [selectedAnalyst, setSelectedAnalyst] = useState('');

  const { user } = useAuthStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Buscar el empleado seleccionado en analysts
    const empleadoSeleccionado = analysts.find(analyst => analyst.condEmpleado === selectedAnalyst);

    const requerimiento: Requerimiento = {
      consecrequerimiento: 0, // Este valor será asignado por el backend
      empleado: {
        condEmpleado: user.condEmpleado,
        nomEmpleado: '',
        apelEmpleado: '',
        correo: '',
        fechaNac: '',
        fechaIngre: ''
      },
      empleadoSeleccionado: empleadoSeleccionado ? {
        condEmpleado: empleadoSeleccionado.condEmpleado,
        nomEmpleado: '',
        apelEmpleado: '',
        correo: '',
        fechaNac: '',
        fechaIngre: ''
      } : null,
      fechaRequerimiento: new Date(), // Fecha y hora actual
      salarioMax: Number(salarioMax),
      salarioMin: Number(salarioMin),
      desFuncion,
      descCarreras,
      nVacantes: Number(nvacantes),
      procesos: []
    };

    try {
      const response = await fetch('http://localhost:8080/requerimientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requerimiento),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el requerimiento');
      }

      const data = await response.json();
      console.log('Requerimiento guardado exitosamente', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  React.useEffect(() => {
    // Lógica para obtener la lista de analistas desde la API
    fetch('http://localhost:8080/empleados/analistas-generales')
      .then(response => response.json())
      .then(data => setAnalysts(data))
      .catch(error => console.error('Error fetching analysts:', error));
  }, []);

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
          <WorkIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Crear Requerimiento
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="desFuncion"
                label="Funciones del cargo"
                name="desFuncion"
                value={desFuncion}
                onChange={(e) => setDesFuncion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="descCarreras"
                label="Carreras Aceptadas"
                name="descCarreras"
                value={descCarreras}
                onChange={(e) => setDescCarreras(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="nvacantes"
                label="Vacantes Diponibles"
                name="nvacantes"
                type="number"
                value={nvacantes}
                onChange={(e) => setNvacantes(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="salarioMin"
                label="Salario Mínimo"
                name="salarioMin"
                type="number"
                value={salarioMin}
                onChange={(e) => setSalarioMin(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="salarioMax"
                label="Salario Máximo"
                name="salarioMax"
                type="number"
                value={salarioMax}
                onChange={(e) => setSalarioMax(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={selectedAnalyst}
                onChange={(e) => setSelectedAnalyst(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Seleccionar tipo de cargo' }}
              >
                <MenuItem value="" disabled>
                  Seleccionar el analista
                </MenuItem>
                {analysts.map((analista) => (
                  <MenuItem key={analista.condEmpleado} value={analista.condEmpleado}>
                    {analista.nomEmpleado + ' ' + analista.apelEmpleado}
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
            Crear Requerimiento
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Ir al Dashboard
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
