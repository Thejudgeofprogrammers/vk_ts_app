import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from './components/Navigation';
import AllCatsPage from "./pages/AllCatsPage";
import FavoriteCatsPage from "./pages/FavoriteCatsPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/' element={<AllCatsPage />}/>
        <Route path='/favorites' element={<FavoriteCatsPage />}/>
        <Route path='/register' element={<RegisterPage />}/>
      </Routes>
    </Router>
  )
}
