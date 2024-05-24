import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './RegisterComponents/Register';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
