/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Notification } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_DISPENSADO } from '../../services/DispensadoService'

const EditarSeleccion = ({props, dispensado}) => {
    const [nombre, setNombre] = useState(dispensado.nombre);
    const [actualizar] = useMutation(UPDATE_DISPENSADO);

    React.useEffect(() => {
        setNombre(dispensado.nombre)
    }, [dispensado])

    const onSaveDispensado = async () => {
        try {
            const input = {
                nombre,
                estado: 'ACTIVO'
            }
            const { data } = await actualizar({ variables: { id: dispensado.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarDispensado;
            if (estado) {
                Notification['success']({
                    title: 'Actualizar Dispensado',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/dispensado`);
            } else {
                Notification['error']({
                    title: 'Actualizar Dispensado',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Actualizar Dispensado',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el dispensado"
            })
        }
    }

    const validarForm = () => {
        return !nombre
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/dispensado`)} icon="arrow-left-line" tooltip="Ir a Selección" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Editar Selección</h3>
            <h6>Nombre de la Selección</h6>
            <input className="form-control mt-2" type="text" placeholder="Nombre de la Selección" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveDispensado} tooltip="Guardar Selección" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(EditarSeleccion)