import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Input, Notification } from 'rsuite'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_MANTENIMIENTO } from '../../../services/MantenimientoService';
import Boton from '../../shared/Boton';

const NuevoMantenimiento = ({ ...props }) => {
    const { id } = props.match.params;
    const [descripcion, setDescripcion] = useState('')
    const [fecha_mantenimiento, setFechaMantenimiento] = useState('')
    const [fecha_aviso, setFechaAviso] = useState('')
    const [insertar] = useMutation(SAVE_MANTENIMIENTO);

    const onSaveMantenimiento = async () => {
        var date = new Date();
        var f = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        if (fecha_mantenimiento >= f || fecha_aviso >= f) {
            const input = {
                maquina: id,
                descripcion,
                fecha_mantenimiento,
                fecha_aviso,
                estado: 'Registrado'
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarMantenimiento;
            if (estado) {
                Notification['success']({
                    title: 'Registrar Mantenimiento',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/maquinaria`);
            } else {
                Notification['error']({
                    title: 'Registrar Mantenimiento',
                    duration: 5000,
                    description: message
                })
            }
        } else {
            Notification['warning']({
                title: 'Registrar Mantenimiento',
                duration: 20000,
                description: "La fecha del incidente debe ser hoy o anterior a hoy"
            })
        }
    }

    const validarForm = () => {
        return !descripcion || !fecha_mantenimiento || !fecha_aviso
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/maquinaria`)} icon="arrow-left-line" tooltip="Ir a Maquinaria" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Ingresar Mantenimiento</h3>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Fecha del Mantenimiento</h6>
                    <Input type="date" placeholder="Fecha del Mantenimiento" value={fecha_mantenimiento} onChange={(e) => setFechaMantenimiento(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Fecha del Aviso</h6>
                    <Input type="date" placeholder="Fecha del Aviso" value={fecha_aviso} onChange={(e) => setFechaAviso(e)} />
                </div>
            </div>
            <h6 className="my-1">descripción</h6>
            <textarea className="form-control" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveMantenimiento} tooltip="Guardar Mantenimiento" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(NuevoMantenimiento)