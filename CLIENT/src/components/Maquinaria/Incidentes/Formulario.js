import React, { useState, useEffect } from 'react'
import { Notification, Input, InputPicker } from 'rsuite'
import Boton from '../../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_INCIDENTE } from '../../../services/IncidenteService'

const Editar = ({props, incidente}) => {
    const [descripcion, setDescripcion] = useState(incidente.descripcion)
    const [ubicacion, setUbicacion] = useState(incidente.ubicacion)
    const [causa, setCausa] = useState(incidente.causa)
    const [state, setEstado] = useState(incidente.estado)
    const [actualizar] = useMutation(UPDATE_INCIDENTE);

    useEffect(() => {
        setDescripcion(incidente.descripcion)
        setUbicacion(incidente.ubicacion)
        setCausa(incidente.causa)
        setEstado(incidente.estado)
    }, [incidente])

    const onSaveIncidente = async () => {
        const input = {
            maquina: incidente.maquina.id,
            descripcion,
            fecha: incidente.fecha,
            ubicacion,
            causa,
            estado: state
        }
        const { data } = await actualizar({ variables: { id: incidente.id, input }, errorPolicy: 'all' });
        const { estado, message } = data.actualizarIncidente;
        if (estado) {
            Notification['success']({
                title: 'Registrar Incidente',
                duration: 5000,
                description: message
            })
            props.history.push(`/maquinaria`);
        } else {
            Notification['error']({
                title: 'Registrar Incidente',
                duration: 5000,
                description: message
            })
        }
    }

    const getEstados = () => {
        if (incidente.estado === 'Registrado') {
            return [{ "label": "En Proceso", "value": "En Proceso" }, { "label": "Finalizado", "value": "Finalizado" }]
        }
        return [{ "label": "Finalizado", "value": "Finalizado" }]

    }

    const validarForm = () => {
        return !descripcion || !ubicacion || !causa || !state
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/maquinaria`)} icon="arrow-left-line" tooltip="Ir a Maquinaria" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Ingresar Incidente</h3>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Estado del Incidente</h6>
                    <InputPicker className='w-100' placeholder="Estado del Incidente" data={getEstados()} value={state} onChange={(e) => setEstado(e)} />
                    <h6 className="my-1">Descripción</h6>
                    <textarea className="form-control" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Ubicación en Planta</h6>
                    <Input type="text" placeholder="Ubicación en Planta" value={ubicacion} onChange={(e) => setUbicacion(e)} />
                    <h6 className="my-1">Causa</h6>
                    <textarea className="form-control" placeholder="Causa" value={causa} onChange={(e) => setCausa(e.target.value)} />
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveIncidente} tooltip="Guardar Incidente" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(Editar)