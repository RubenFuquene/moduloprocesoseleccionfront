import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Register from './AuthComponents/Register';
import RequirementForm from './RequirementComponents/RequirementForm' 
import { useAuthStore } from './ZustandStores/authStore';
import NavBar from './Components/NavBar';
import Login from './AuthComponents/Login';
import EditRequirementFormGeneralAnalist from './RequirementComponents/EditRequirementFormGeneralAnalist';

function App() {
  const { loggedIn } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={loggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas para usuarios logueados */}
        <Route path="/dashboard" element={loggedIn ? <><NavBar /> <Outlet /></> : <Navigate to="/login"/>}>
          <Route path="createRequirement" element={<RequirementForm />} />
          <Route path="edit-requirement/:id" element={<EditRequirementFormGeneralAnalist />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
