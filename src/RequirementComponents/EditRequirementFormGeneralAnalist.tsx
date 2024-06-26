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
import { useState, useEffect } from 'react';
import { Chip, MenuItem, Select } from '@mui/material';
import { Disciplina, Empleado, Perfil, ProcesoRequerimiento, Requerimiento } from '../types';
import { useAuthStore } from '../ZustandStores/authStore';
import { useParams } from 'react-router-dom';
import { useMyRequirementStore } from '../ZustandStores/myRequirementStore';

export default function EditRequirementFormGeneralAnalist() {
  const { id } = useParams<{ id: string }>();
  const { requerimientos } = useMyRequirementStore();
  const [desFuncion, setDesFuncion] = useState('');
  const [descCarreras, setDescCarreras] = useState('');
  const [nvacantes, setNvacantes] = useState('');
  const [salarioMin, setSalarioMin] = useState('');
  const [salarioMax, setSalarioMax] = useState('');
  const [analysts, setAnalysts] = useState<Empleado[]>([]);
  const [selectedAnalyst, setSelectedAnalyst] = useState('');
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [selectedPerfil, setSelectedPerfil] = useState('');
  const [convocatoria, setConvocatoria] = useState('');
  const [invitacion, setInvitacion] = useState('');
  const [candidatos, setCandidatos] = useState([]);

  const requerimiento = requerimientos.find(req => req.consecrequerimiento === Number(id));

  useEffect(() => {
    if (requerimiento) {
      console.log(requerimiento.descCarreras);
      setDesFuncion(requerimiento.desFuncion);
      setDescCarreras(requerimiento.descCarreras);
      setNvacantes(requerimiento.nVacantes.toString());
      setSalarioMin(requerimiento.salarioMin ? requerimiento.salarioMin.toString() : '');
      setSalarioMax(requerimiento.salarioMax.toString());
      setSelectedAnalyst(requerimiento.empleadoSeleccionado?.condEmpleado || '');
      setSelectedPerfil(requerimiento.procesos.length ? requerimiento.procesos[requerimiento.procesos.length - 1].id?.idPerfil || '' : '')
      setConvocatoria(requerimiento.procesos[2] ? requerimiento.procesos[2].convocatoria || '' : '');

      const fetchCandidatos = async () => {
        try {
          const disciplina = disciplinas.find(dis => dis.idDisciplina === selectedDisciplina)
          const response = await fetch(`http://localhost:8080/candidatos/buscar/${disciplina?.descDisciplina}/${requerimiento.descCarreras}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error('Error al obtener los candidatos');
          }
      
          const data = await response.json();
          setCandidatos(data);
        } catch (error) {
          console.error('Error:', error);
        }
      };  

      fetchCandidatos();
    }
    console.log(requerimiento);
  }, [id, requerimientos]);

  useEffect(() => {
    if(selectedPerfil)
    {
      fetch(`http://localhost:8080/perfiles/perfil/${selectedPerfil}/disciplina`)
        .then(response => response.json())
        .then(data => setSelectedDisciplina(data.idDisciplina))
        .catch(error => console.error('Error fetching analysts:', error)); 
    }
  }, [selectedPerfil]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Construir el objeto de proceso de requerimiento
    const procesoRequerimiento: ProcesoRequerimiento = {
      id: {
        consecRequerimiento: requerimiento?.consecrequerimiento || 0,
        idPerfil: selectedPerfil,
        idFase: "0" + ((requerimiento?.procesos?.length || 0) + 1).toString(),
        consProceso: 0, // Este valor será asignado por el backend
      },
      condEmpleado: requerimiento?.empleadoSeleccionado?.condEmpleado || '',
      fechaInicio: undefined,
      fechaFin: null,
      convocatoria: convocatoria,
      invitacion: '',
      consecRequerimiento: 0,
      perfil: undefined,
      fase: undefined,
      consProceso: 0
    };

    try {
      // Realizar la solicitud para guardar el nuevo proceso de requerimiento
      const response = await fetch('http://localhost:8080/procesos-requerimiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(procesoRequerimiento),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el proceso de requerimiento');
      }

      const data = await response.json();
      console.log('Proceso de requerimiento guardado exitosamente', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Lógica para obtener la lista de analistas desde la API
    fetch('http://localhost:8080/empleados/analistas-generales')
      .then(response => response.json())
      .then(data => setAnalysts(data))
      .catch(error => console.error('Error fetching analysts:', error));

    // Lógica para obtener la lista de disciplinas desde la API
    fetch('http://localhost:8080/disciplinas')
      .then(response => response.json())
      .then(data => setDisciplinas(data))
      .catch(error => console.error('Error fetching disciplinas:', error));
  }, []);

  useEffect(() => {
    if (selectedDisciplina) {
      // Lógica para obtener la lista de perfiles según la disciplina seleccionada
      fetch(`http://localhost:8080/perfiles/disciplina/${selectedDisciplina}`)
        .then(response => response.json())
        .then(data => setPerfiles(data))
        .catch(error => console.error('Error fetching perfiles:', error));
    }
  }, [selectedDisciplina]);

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
          Procesar Requerimiento
        </Typography>
        <Grid container spacing={1} justifyContent="center">
          {[...Array(7).keys()].map((index) => (
            <Grid item key={index}>
              <Chip
                label={`Fase ${index + 1}`}
                color={index < (requerimiento?.procesos.length || 0) ? "primary" : "default"}
                variant={index < (requerimiento?.procesos.length || 0) ? "filled" : "outlined"}
              />
            </Grid>
          ))}
        </Grid>
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
                inputProps={{ 'aria-label': 'Seleccionar analista' }}
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
            <Grid item xs={12}>
              <Select
                fullWidth
                value={selectedDisciplina}
                onChange={(e) => setSelectedDisciplina(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Seleccionar disciplina' }}
              >
                <MenuItem value="" disabled>
                  Seleccionar disciplina
                </MenuItem>
                {disciplinas.map((disciplina) => (
                  <MenuItem key={disciplina.idDisciplina} value={disciplina.idDisciplina}>
                    {disciplina.descDisciplina}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={selectedPerfil}
                onChange={(e) => setSelectedPerfil(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Seleccionar perfil' }}
                disabled={!selectedDisciplina} // Deshabilitar si no se ha seleccionado una disciplina
              >
                <MenuItem value="" disabled>
                  Seleccionar perfil
                </MenuItem>
                {perfiles.map((perfil) => (
                  <MenuItem key={perfil.idPerfil} value={perfil.idPerfil}>
                    {perfil.descPerfil}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {requerimiento?.procesos.length >= 2 && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="convocatoria"
                  label="Convocatoria"
                  name="convocatoria"
                  value={convocatoria}
                  onChange={(e) => setConvocatoria(e.target.value)}
                />
              </Grid>
            )}
            {requerimiento?.procesos.length >= 3 && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="invitacion"
                  label="Invitación"
                  name="invitacion"
                  value={invitacion}
                  onChange={(e) => setInvitacion(e.target.value)}
                />
              </Grid>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Guardar Cambios
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
