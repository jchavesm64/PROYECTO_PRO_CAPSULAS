import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { OBTENER_ROLES } from '../../services/RolService';
import { Loader, Modal, Icon } from 'rsuite';
import Logout from '../authentication/Logout';

const SideBar = ({ session }) => {
    console.log(session);
    const [show, setShow] = useState(true);
    const [rolTipo, setRolTipo] = useState(localStorage.getItem('rol'));
    const { loading, data } = useQuery(OBTENER_ROLES, { pollInterval: 1000 });

    const agregarRol = async (rol) => {
        setRolTipo(rol);
        await localStorage.setItem('rol', rol);
    }

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            {
                rolTipo !== null && data.obtenerRoles.some(rol => rol.tipo === rolTipo) && session.roles.some(rol => rol.tipo === rolTipo) ?
                    (
                        <nav id="sidebar">
                            <div className="sidebar-header  text-center ">
                                <h4> Sistema Pro Cápsulas </h4>
                                <strong>SPC v1.0</strong>
                            </div>
                            <ul className="list-unstyled components" >
                                {/*Modulos*/}
                            </ul>
                            <ul className="list-unstyled components">
                                <li className="link">
                                    <Link to="/perfil"><Icon icon="user-circle-o" />Mi perfil</Link>
                                </li>
                                <li className="link">
                                    <Logout name="Cerrar Sesión" />
                                </li>
                            </ul>
                            {
                                session.roles.some(rol => rol.tipo === rolTipo && (rol.permisos.some(permiso => permiso.descripcion === "CONFIGURACIONES GENERALES"))) ?
                                    <ul className="list-unstyled components">
                                        <div className="text-center">
                                            <strong>Accesos</strong>
                                            <li className="link">
                                                <Link to="/config"><Icon icon="cog" />Configuraciones Generales</Link>
                                            </li>
                                        </div>
                                    </ul> : ""
                            }
                        </nav>
                    ) : (
                        <>
                            {
                                session.roles.length > 1 ?
                                    <Modal backdrop="static" show={show} onHide={() => { setShow(false) }}>
                                        <Modal.Header>
                                            <Modal.Title>ROL DE USUARIO</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="form-group">
                                                <select
                                                    onChange={e => agregarRol(e.target.value)}
                                                    value={rolTipo}
                                                    className="form-control"       >
                                                    <option value="" >Elegir...</option>
                                                    {
                                                        session.rol.map((rolItem, index) => (
                                                            <option key={index} value={rolItem.tipo} >{rolItem.tipo}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>

                                        </Modal.Footer>
                                    </Modal> : agregarRol(session.roles[0].tipo)
                            }
                        </>
                    )
            }
        </>
    )
}

export default SideBar;