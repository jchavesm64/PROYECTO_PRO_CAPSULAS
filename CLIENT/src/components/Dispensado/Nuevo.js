/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Notification, Loader } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { SAVE_DISPENSADO } from '../../services/DispensadoService'
import { OBTENER_PRODUCTOS_2 } from '../../services/ProductoService'

const NuevaDispensado = ({...props}) => {
    const [nombre, setNombre] = useState('');
    const [insertar] = useMutation(SAVE_DISPENSADO);
    const { loading: load_productos, error: error_productos, data: data_productos } = useQuery(OBTENER_PRODUCTOS_2, { pollInterval: 1000 })

    const getProductos = () => {
        const productos = []
        if (data_productos) {
            data_productos.obtenerProductos.map(item => {
                productos.push({
                    "label": item.nombre,
                    "value": item.id
                })
            })
        }
        return productos
    }

    const onSaveDispensado = async () => {
        try {
            const input = {
                nombre,
                estado: 'ACTIVO'
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarDispensado;
            if (estado) {
                Notification['success']({
                    title: 'Insertar Dispensado',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/dispensado`);
            } else {
                Notification['error']({
                    title: 'Insertar Dispensado',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Insertar Dispensado',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el dispensado"
            })
        }
    }

    const validarForm = () => {
        return !nombre
    }

    if (load_productos) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_productos) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de productos, verificar tu conexión a internet'
        })
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/dispensado`)} icon="arrow-left-line" tooltip="Ir a Dispensado" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Registro de Dispensado</h3>
            <h6>Nombre del Dispensado</h6>
            <input className="form-control mt-2" type="text" placeholder="Nombre del Dispensado" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveDispensado} tooltip="Guardar Dispensado" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(NuevaDispensado)