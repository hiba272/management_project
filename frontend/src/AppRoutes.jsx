// src/AppRoutes.js
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import DemandeConge from './pages/Conge/DemandeConge';
import ECommerce from './pages/Dashboard/ECommerce';
import AddEmploye from './pages/Employes/AddEmploye';
import ListeEmployes from './pages/Employes/listeEmployes';
import Profile from './pages/Profile';
const AppRoutes = () => (
  <Routes>
    {/* Redirection par défaut vers la page de connexion */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Routes de connexion */}
    <Route path="/login" element={<SignIn />} />
    <Route path="/register" element={<SignUp />} />

  
     {/* Autres routes */}
     <Route
      path="/dashboard"
      element={
        
           <>
          <PageTitle title=" APP - Employee" />
          <ECommerce />
        </>
                
      }
    />
   
    
    <Route path="/addEmploye" element={<AddEmploye />} />
    <Route path="/listeEmployes" element={<ListeEmployes />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/demandeConge" element={<DemandeConge />} />

  </Routes>
);

export default AppRoutes;
