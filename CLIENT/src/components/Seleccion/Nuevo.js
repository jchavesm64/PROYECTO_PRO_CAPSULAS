/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Notification } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_SELECION } from '../../services/SeleccionService'

const NuevaSeleccion = ({...props}) => {
    const [nombre, setNombre] = useState('');
    const [insertar] = useMutation(SAVE_SELECION);

    const onSaveSeleccion = async () => {
        try {
            const input = {
                nombre,
                estado: 'ACTIVO'
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarSeleccion;
            if (estado) {
                Notification['success']({
                    title: 'Insertar Selección',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/seleccion`);
            } else {
                Notification['error']({
                    title: 'Insertar Selección',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Insertar Selección',
                duration: 5000,
                description: "Hubo un error inesperado al guardar la selección"
            })
        }
    }

    const validarForm = () => {
        return !nombre
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/seleccion`)} icon="arrow-left-line" tooltip="Ir a Selección" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Registro de Selección</h3>
            <h6>Nombre de la Selección</h6>
            <input className="form-control mt-2" type="text" placeholder="Nombre de la Selección" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveSeleccion} tooltip="Guardar Selección" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(NuevaSeleccion)