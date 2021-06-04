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
import Usuarios from '../components/usuarios/Usuarios';
import NuevoUsuario from '../components/usuarios/NuevoUsuario';
import EditarUsuario from '../components/usuarios/EditarUsuario';
import Clientes from '../components/clientes/Clientes';
import NuevoCliente from '../components/clientes/NuevoCliente';
import EditarCliente from '../components/clientes/EditarCliente';
import Proveedores from '../components/proveedores/Proveedores';
import NuevoProveedor from '../components/proveedores/NuevoProveedor';
import EditarProveedor from '../components/proveedores/EditarProveedor';

const Router = ({ refetch, session }) => {

    const { obtenerUsuarioAutenticado } = session;
    const {estado, data} = obtenerUsuarioAutenticado;
    var mensaje = (!session || !estado) ? <Redirect to="/login" /> : ''
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
                                <Route exact path="/usuarios" render={(props) => <Usuarios session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/usuarios/nuevo" render={(props) => <NuevoUsuario session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/usuarios/editar/:id" render={(props) => <EditarUsuario session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/clientes" render={(props) => <Clientes session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/clientes/nuevo" render={(props) => <NuevoCliente session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/clientes/editar/:id" render={(props) => <EditarCliente session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/proveedores" render={(props) => <Proveedores session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/proveedores/nuevo" render={(props) => <NuevoProveedor session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/proveedores/editar/:id" render={(props) => <EditarProveedor uso={false} session={data} refetch={refetch} {...props}/>}/>
                                <Route exact path="/proveedores/detalles/:id" render={(props) => <EditarProveedor uso={true} session={data} refetch={refetch} {...props}/>}/>
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