import { withRouter } from "react-router";
import NavPerfil from './NavPerfil';
import Info from './Informacion';
import Clave from './CambiarClave';
import Editar from './Editar';
import { useQuery } from '@apollo/react-hooks';
import { OBTENER_USUARIO_AUTENTICADO } from '../../services/UsuarioService';
import { Loader, Notification, Icon } from 'rsuite';
import {useState} from 'react';

const Perfil = ({ ...props }) => {
    const [active, setActive] = useState('info');
    const { loading, error, data } = useQuery(OBTENER_USUARIO_AUTENTICADO, { pollInterval: 500 });

    if (loading) return <Loader backdrop content="Cargando..." vertical size="lg" />
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 5000,
            description: 'Servido no responde, por favor contactar con los administradores'
        })
    }
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 5000,
            description: 'Error al cambiar foto de perfi.'
        })
    }

    const usuario = data.obtenerUsuarioAutenticado;

    return (
        <>
            <div className="w-75 mx-auto">
                <div className="text-center mb-5">
                    <span style={{ color: '#0CA3AE', fontSize: 80 }}>
                        <Icon icon="user-circle-o" size="lg" />
                    </span>
                    <h3 className="mt-3">{usuario.nombre}</h3>
                    <span className="help-block">Permisos de {localStorage.getItem('rol')}</span>
                </div>
                <div className="form-group col-md-12">
                    <div>
                        <NavPerfil active={active} setActive={setActive}/>
                    </div>
                </div>
                {(active === 'info') ? <Info usuario={usuario}/> : ''}
                {(active === 'editar') ? <Editar usuario={usuario}/> : ''}
                {(active === 'password') ? <Clave usuario={usuario}/> : ''}
            </div>
        </>
    );
}

export default withRouter(Perfil);