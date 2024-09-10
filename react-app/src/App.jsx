import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* Importação de componentes */
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Message from './components/layout/Message';
import Container from './components/layout/Container';

/* Importação de páginas */
import Home from './components/pages/Home';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Profile from './components/pages/User/Profile';
import AddPet from './components/pages/Pet/AddPet';
import MyPets from './components/pages/Pet/MyPets';
import EditPet from './components/pages/Pet/EditPet';
import PetDetails from './components/pages/Pet/PetDetails';
import MyAdoptions from './components/pages/Pet/MyAdoptions';

/* Importação de contextos */
import { UserProvider } from './context/UserContext';

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/pet/add" element={<AddPet />} />
            <Route path="/pet/edit/:id" element={<EditPet />} />
            <Route path="/pet/mypets" element={<MyPets />} />
            <Route path="/pet/myadoptions" element={<MyAdoptions />} />
            <Route path="/pet/:id" element={<PetDetails />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
};

export default App;
