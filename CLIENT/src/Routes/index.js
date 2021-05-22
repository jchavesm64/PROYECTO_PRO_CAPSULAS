import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from '../components/authentication/Login';
import NavMenu from '../components/layout/NavMenu';
import Session from '../components/Session';
import Sidebar from '../components/layout/Sidebar';
import Perfil from '../components/Perfil/Perfil';

const Router = ({ refetch, session }) => {

    const { obtenerUsuarioAutenticado } = session;
    const mensaje = (!obtenerUsuarioAutenticado) ? <Redirect to="/login" /> : ''
    return (
        <BrowserRouter>
            <>
                {mensaje}
                <div className="wrapper">
                    {obtenerUsuarioAutenticado ? <Sidebar session={obtenerUsuarioAutenticado} /> : ''}
                    <div id="content">
                        <NavMenu session={obtenerUsuarioAutenticado} refetch={refetch} />
                        <div className="container">
                            <Switch>
                                {!obtenerUsuarioAutenticado ? <Route exact path="/login" render={() => <Login refetch={refetch} />} /> : ''}
                                <Route exact path="/perfil" render={(props) => <Perfil refetch={refetch} />} />
                                {obtenerUsuarioAutenticado && localStorage.getItem('rol') && <Redirect from="/" to='perfil' />}
                            </Switch>
                        </div>
                    </div>
                </div>
            </>
        </BrowserRouter>
    );
}
export default Router;

const RootSession = Session(Router)
export { RootSession };