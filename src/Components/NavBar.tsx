import { AppBar, Toolbar, Typography, Button, Badge, Menu, MenuItem, Box } from '@mui/material';
import { Link as RouterLink, useNavigate  } from 'react-router-dom';
import { useAuthStore } from '../ZustandStores/authStore';
import { useMyRequirementStore } from '../ZustandStores/myRequirementStore';
import { Requerimiento } from '../types';
import { useEffect, useState } from 'react';

function NavBar() {
  const { logout, user } = useAuthStore();
  const { requerimientos, addRequerimiento, clearState } = useMyRequirementStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    clearState();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRequirementClick = (id: number) => {
    navigate(`/dashboard/edit-requirement/${id}`);
    handleMenuClose();
  };

  const fetchRequerimientos = async () => {
    try {
      const response = await fetch(`http://localhost:8080/requerimientos/asignados/${user.condEmpleado}`);
      if (!response.ok) {
        throw new Error('Error al obtener los requerimientos');
      }
      const data = await response.json();
      // Almacenar los requerimientos en el estado global
      data.forEach((requerimiento: Requerimiento) => {
        addRequerimiento(requerimiento);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Verificar si el usuario es Analista General y obtener los requerimientos
    if (user && user.tiposCargos && user.tiposCargos.some(cargo => cargo.descTipoCargo === 'Analista General')) {
      fetchRequerimientos();
    }
  }, [user, addRequerimiento]);

  // Verificar si el usuario tiene un cargo de Analista General
  const isAnalistaGeneral = user && user.tiposCargos && user.tiposCargos.some(cargo => cargo.descTipoCargo === 'Analista General');
  
  // Verificar si el usuario tiene un cargo de Analista Cliente
  const isAnalistaCliente = user && user.tiposCargos && user.tiposCargos.some(cargo => cargo.descTipoCargo === 'Analista Cliente');

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Grupo Selección App
        </Typography>
        {isAnalistaGeneral && (
          <>
            <Badge badgeContent={requerimientos.length} color="error">
              <Button onClick={handleMenuClick} color="inherit">Mis Requerimientos</Button>
            </Badge>
            <Menu
              id="requerimientos-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {requerimientos.map((requerimiento, index) => (
                <MenuItem key={index} onClick={() => handleRequirementClick(requerimiento.consecrequerimiento)}>
                  {requerimiento.desFuncion}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
        {isAnalistaCliente && (
          <Button component={RouterLink} to="/dashboard/createRequirement" color="inherit">Crear Requerimiento</Button>
        )}
        <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography variant="body1">
            Bienvenido, {user?.nomEmpleado} {user?.apelEmpleado}
          </Typography>
          <Typography variant="body2">
            Fecha de Ingreso: {user?.fechaIngre}
          </Typography>
        </Box>
        <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
