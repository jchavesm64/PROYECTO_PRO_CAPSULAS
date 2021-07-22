import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Input, InputPicker, Notification } from 'rsuite'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_MOVIMIENTO } from '../../../services/MovimientosService';
import Boton from '../../shared/Boton';

const NuevoMovimiento = (props) => {
    const [lote, setLote] = useState('')
    const [codigo, setCodigo] = useState('')
    const [fechaFabricacion, setFechaFabricacion] = useState('')
    const [fechaVencimiento, setFechaVencimiento] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [unidad, setUnidad] = useState('')
    const [precio, setPrecio] = useState('')
    const [insertar] = useMutation(SAVE_MOVIMIENTO);

    const { session } = props
    const { id } = props.match.params

    const onSaveMovimiento = async () => {
        var date = new Date();
        var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        if (fechaFabricacion < fechaVencimiento && fechaFabricacion <= fecha) {
            if(!(cantidad < 1 || precio < 1)){
                try {
                    const input = {
                        tipo: 'ENTRADA',
                        lote,
                        codigo,
                        fechaFabricacion,
                        fechaVencimiento,
                        fecha,
                        cantidad,
                        existencia: cantidad,
                        unidad,
                        precio: cantidad * precio,
                        precio_unidad: precio,
                        usuario: session.id,
                        materia_prima: id
                    }
                    console.log(fecha, input)
                    const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
                    const { estado, message } = data.insertarMovimiento;
                    if (estado) {
                        Notification['success']({
                            title: 'Ingresar Entrada',
                            duration: 5000,
                            description: message
                        })
                        props.history.push(`/materias_primas`);
                    } else {
                        Notification['error']({
                            title: 'Ingresar Entrada',
                            duration: 5000,
                            description: message
                        })
                    }
                } catch (error) {
                    console.log(error)
                    Notification['error']({
                        title: 'Ingresar Entrada',
                        duration: 5000,
                        description: "Hubo un error inesperado al guardar la entrada"
                    })
                }
            }else{
                Notification['error']({
                    title: 'Ingresar Entrada',
                    duration: 5000,
                    description: "Los valores numericos deben ser mayor a cero"
                })
            }
        } else {
            Notification['error']({
                title: 'Ingresar Entrada',
                duration: 5000,
                description: "Las fechas de fabericación y vencimiento son incorrectas"
            })
        }
    }

    const validarForm = () => {
        return !lote || !codigo || !fechaFabricacion || !fechaFabricacion || !fechaVencimiento || !cantidad || !unidad || !precio;
    }

    return (
        <div>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/materias_primas`)} icon="arrow-left-line" tooltip="Ir a Materias Primas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Ingresar Entrada</h3>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Lote</h6>
                    <Input type="number" placeholder="Lote" value={lote} onChange={(e) => setLote(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Código</h6>
                    <Input type="text" placeholder="Código" value={codigo} onChange={(e) => setCodigo(e)} />
                </div>
            </div>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Fecha de Fabricación</h6>
                    <Input type="date" placeholder="Fecha de Fabricación" value={fechaFabricacion} onChange={(e) => setFechaFabricacion(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Fecha de Vencimiento</h6>
                    <Input type="date" placeholder="Fecha de Vencimiento" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e)} />
                </div>
            </div>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Cantidad</h6>
                    <Input type="number" min={0} placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Unidad Métrica</h6>
                    <InputPicker className="w-100" data={[{ label: 'Kilogramo', value: 'Kilogramo' }, { label: 'Litro', value: 'Litro' }]} placeholder="Unidad Métrica" value={unidad} onChange={(e) => setUnidad(e)} />
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h6 className="my-1">Precio Unidad</h6>
                    <Input type="number" placeholder="Precio Unidad" value={precio} onChange={(e) => setPrecio(e)} />
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveMovimiento} tooltip="Guardar Proveedor" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </div>
    );
}

export default withRouter(NuevoMovimiento);