/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { Notification, Input } from 'rsuite'
import Boton from '../shared/Boton'
import Action from '../shared/Action'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_PUESTO_LIMPIEZA } from '../../services/PuestoLimpiezaService'


const Formulario = ({ props, puesto }) => {
    const { uso } = props
    const [nombre, setNombre] = useState(puesto.nombre)
    const [areas, setAreas] = useState(puesto.areas)
    const [ubicacion, setUbicacion] = useState(puesto.ubicacion)
    const [descripcion, setDescripcion] = useState(puesto.descripcion)
    const [datos, setDatos] = useState(true)
    const [reload, setReload] = useState(false)
    const [actualizar] = useMutation(UPDATE_PUESTO_LIMPIEZA);

    useEffect(() => {
        setNombre(puesto.nombre)
        setAreas(puesto.areas)
        setUbicacion(puesto.ubicacion)
        setDescripcion(puesto.descripcion)
    }, [puesto])

    const onSavePuestoLimpieza = async () => {
        try {
            const input = {
                nombre,
                ubicacion,
                descripcion,
                areas,
                estado: 'ACTIVO'
            }
            const { data } = await actualizar({ variables: { id: puesto.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarPuestoLimpieza;
            if (estado) {
                Notification['success']({
                    title: 'Editar Puesto de Limpieza',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/puesto_limpieza`);
            } else {
                Notification['error']({
                    title: 'Editar Puesto de Limpieza',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Editar Puesto de Limpieza',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el puesto de limpieza"
            })
        }
    }

    const addCaracteritica = () => {
        areas.push({
            "nombre": ""
        })
        setReload(!reload)
    }

    const removeArea = (item) => {
        areas.splice(areas.indexOf(item), 1)
        setReload(!reload)
    }

    const addCaracteristicaNombre = (key, dato) => {
        let find = false
        areas.map(item => {
            if (item === key) {
                find = true
                item.nombre = dato
            }
        })
        if (!find) {
            areas.push({
                "nombre": dato
            })
        }
    }

    const FichaArea = ({ item }) => {
        return (
            <div className='row my-2'>
                <div className='col-md-11 float-left'>
                    <input className="form-control" type="text" placeholder={item.nombre} defaultValue={item.nombre} onChange={(e) => addCaracteristicaNombre(item, e.target.value)} />
                </div>
                {
                    uso === true &&
                    <div className='col-md-1 float-left'>
                        <Action className="mb-1" onClick={() => removeArea(item)} tooltip={"Remover"} color={"red"} icon={"close"} size="xs" />
                    </div>
                }
            </div>
        )
    }

    const validarForm = () => {
        return !nombre || !ubicacion || !descripcion || areas.length === 0
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/puesto_limpieza`)} icon="arrow-left-line" tooltip="Ir a Puestos de Limpieza" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Registro de Puestos de Limpieza</h3>
            <div className="row">
                <div className="col-md-6 float-left">
                    <h6>Nombre del Puesto</h6>
                    <Input type="text" placeholder="Nombre del Puesto" value={nombre} onChange={(e) => setNombre(e)} />
                </div>
                <div className="col-md-6 mt-2">
                    <h6 className="my-1">Ubicación en Plante</h6>
                    <Input type="text" placeholder="Ubicación en Planta" value={ubicacion} onChange={(e) => setUbicacion(e)} />
                </div>
            </div>
            <h6>Nombre del Puesto</h6>
            <textarea className="form-control" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSavePuestoLimpieza} tooltip="Guardar Puesto de Limpieza" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
            <div className="row border-bottom border-dark my-3">
                <div className="col-md-11 float-left">
                    <h5 className="mt-2">Areas a Atender</h5>
                </div>
                <div className="d-flex col-md-1 justify-content-end float-right">
                    <Action className="mb-1" onClick={() => { setDatos(!datos) }} tooltip={datos ? "Ocultar" : "Mostrar"} color={"cyan"} icon={datos ? "angle-up" : "angle-down"} size="xs" />
                </div>
            </div>
            {
                datos &&
                <>
                    <div className='my-4'>
                        {areas &&
                            areas.map(item => {
                                return (<FichaArea item={item} />)
                            })
                        }
                        <div className="d-flex col-md-12 justify-content-end float-right">
                            <Action className="mb-1" onClick={addCaracteritica} tooltip={"Agregar Area"} color={"green"} icon={"plus"} size="xs" />
                        </div>
                    </div>
                </>
            }
            {uso === true &&
                <div className="d-flex justify-content-end float-rigth mt-3">
                    <Boton onClick={onSavePuestoLimpieza} tooltip="Guardar Puesto de Limpieza" name="Guardar" icon="save" color="green" disabled={validarForm()} />
                </div>
            }
        </>
    )
}

export default withRouter(Formulario)