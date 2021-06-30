import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'

const CardClientes = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { cliente, setConfirmation, mostrarMsj } = props;

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos del Cliente"}</h4>
            <div className="mx-1">
                <Label icon="user" value={cliente.tipo} />
                <Label icon="font" value={cliente.nombre} />
                <Label icon="id-card-o" value={cliente.codigo} />
                <Label icon="globe" value={cliente.pais} />
                <Label icon="bank" value={cliente.ciudad} />
                <Label icon="at" value={cliente.correos[0].email} />
                <Label icon="phone" value={cliente.telefonos[0].telefono} />
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`clientes/editar/${cliente.id}`}><Action tooltip="Editar Cliente" color="orange" icon="edit" size="xs" /></Link></div>
                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: cliente.id }) : mostrarMsj() }} tooltip="Eliminar Cliente" color="red" icon="trash" size="xs" /></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardClientes)