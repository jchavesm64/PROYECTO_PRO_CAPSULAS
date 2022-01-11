import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'
import * as moment from 'moment'

const CardMaquina = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { maquina, setConfirmation, mostrarMsj } = props

    const getRestoVidaUtil = (fecha, vida) => {
        var fecha_limite = new Date(fecha);
        fecha_limite.setFullYear(fecha_limite.getFullYear() + vida)
        var fecha_hoy = new Date()
        const f1 = moment(fecha_hoy, 'YYYY-MM-DD HH:mm:ss')
        const f2 = moment(fecha_limite, 'YYYY-MM-DD HH:mm:ss')
        const res = moment.preciseDiff(f1, f2, true)
        return "Años: " + res.years + ", Meses: " + res.months + ", dias: " + res.days
    }

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos de la Máquina"}</h4>
            <div className="mx-1">
                <h6>Maquina</h6>
                <Label icon="font" value={maquina.nombre} />
                <h6>Categoría</h6>
                <Label icon="list" value={maquina.categoria.nombre} />
                <h6>Ubicación en Planta</h6>
                <Label icon="globe" value={maquina.ubicacion} />
                <h6>Vida útil</h6>
                <Label icon="fas fa-clock" value={maquina.vida_util + ' años'} />
                <h6>Vida útil restante</h6>
                <Label icon="fas fa-clock" value={getRestoVidaUtil(maquina.fecha_adquirido, maquina.vida_util)} />
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`maquinaria/nuevo`}><Action tooltip="Agregar Máquina" color="green" icon="plus" size="xs" /></Link></div>
                <div className="mx-1"><Link to={`maquinaria/editar/${maquina.id}`}><Action tooltip="Editar Maquina Prima" color="orange" icon="edit" size="xs" /></Link></div>
                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: maquina.id }) : mostrarMsj() }} tooltip="Eliminar Máquina" color="red" icon="trash" size="xs" /></div>
                <div className="mx-1"><Link to={`maquinaria/detalles/${maquina.id}`}><Action tooltip="Detalles" color="cyan" icon="info" size="xs" /></Link></div>
                <div><h6>|</h6></div>
                <div className="mx-1"><Link to={`mantenimiento/nuevo/${maquina.id}`}><Action tooltip="Agregar Mantenimiento" color="green" icon="fas fa-cog" size="xs" /></Link></div>
                <div className="mx-1"><Link to={`incidente/nuevo/${maquina.id}`}><Action tooltip="Agregar Incidente" color="yellow" icon="fas fa-exclamation" size="xs" /></Link></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardMaquina)