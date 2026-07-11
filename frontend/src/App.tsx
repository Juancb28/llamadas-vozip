import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CallPage from './pages/CallPage';
import RatingPage from './pages/RatingPage';
// ... tus rutas existentes

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* tus rutas existentes van aquí */}
        <Route path="/call" element={<CallPage />} />
        <Route path="/rating" element={<RatingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;