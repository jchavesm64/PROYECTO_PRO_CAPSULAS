import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from '../components/authentication/Login';
import NavMenu from '../components/layout/NavMenu';
import Session from '../components/Session';
import Sidebar from '../components/layout/Sidebar';
import Perfil from '../components/Perfil/Perfil';
import Configuracion from '../components/ConfiguracionesGenerales/Configuraciones';
import TipoProductos from '../components/ConfiguracionesGenerales/TipoProducto/TipoProducto';
import TipoProveduria from '../components/ConfiguracionesGenerales/Proveduria/TipoProveduria';
import Roles from '../components/ConfiguracionesGenerales/Roles/GestionarRoles';

const Router = ({ refetch, session }) => {

    const mensaje = (!session) ? <Redirect to="/login" /> : ''
    const { obtenerUsuarioAutenticado } = session;
    const {estado, data} = obtenerUsuarioAutenticado;
    return (
        <BrowserRouter>
            <>
                {mensaje}
                <div className="wrapper">
                    {estado ? <Sidebar session={data} /> : ''}
                    <div id="content">
                        <NavMenu session={data} refetch={refetch} />
                        <div className="container">
                            <Switch>
                                {!estado ? <Route exact path="/login" render={() => <Login refetch={refetch} />} /> : ''}
                                <Route exact path="/perfil" render={() => <Perfil refetch={refetch} />} />
                                <Route exact path="/config" render={() => <Configuracion session={data} refetch={refetch} />} />
                                <Route exact path="/config/tipoproductos" render={() => <TipoProductos session={data} refetch={refetch}/>}/>
                                <Route exact path="/config/tipoproveduria" render={() => <TipoProveduria session={data} refetch={refetch}/>}/>
                                <Route exact path="/config/roles" render={() => <Roles session={data} refetch={refetch}/>}/>
                                {console.log(estado && localStorage.getItem('rol'))}
                                {(estado && localStorage.getItem('rol')) ? <Redirect to='/perfil' /> : <Redirect to="/login" />}
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