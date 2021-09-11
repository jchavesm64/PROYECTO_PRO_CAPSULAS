/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_COTIZACION } from '../../services/CotizacionService'
import { Notification, Table, Input, InputPicker } from 'rsuite';
import Boton from '../shared/Boton';
const { Column, HeaderCell, Cell } = Table;

const CapsulaDura = ({ ...props }) => {
    const [insertar] = useMutation(SAVE_COTIZACION)
    const [cotizacion, setCotizacion] = useState(null)
    const [venta, setVenta] = useState(0)
    const [cantidad, setCantidad] = useState(0)
    const [envases, setEnvases] = useState(0)
    const [etiquetas, setEtiquetas] = useState(0)
    const [costoCapsula, setCostoCapsula] = useState(0)
    const [costoEnvase, setCostoEnvase] = useState(0)
    const [costoEtiquetas, setCostoEtiquetas] = useState(0)
    const [peso, setPeso] = useState(0)
    const { formula, cliente, producto } = props

    if (formula !== null && cotizacion === null) {
        const datos = []
        for (let i = 0; i < formula.elementos.length; i++) {
            datos.push({
                materia_prima: formula.elementos[i],
                porcentaje: formula.porcentajes[i],
                precio_kilo: 0
            })
        }
        setCotizacion(datos)
    }

    const getMiligramosCapsula = (porcentaje) => {
        if (peso > 0) {
            return parseFloat((porcentaje * peso) / 100).toFixed(4)
        }
        return 0
    }

    const getGramosCapsula = (porcentaje) => {
        if (peso > 0) {
            return parseFloat(getMiligramosCapsula(porcentaje) / 1000).toFixed(4);
        }
        return 0
    }

    const getGramosEnvase = (porcentaje) => {
        if (peso > 0 && cantidad > 0) {
            return parseFloat((getMiligramosCapsula(porcentaje) / 1000) * cantidad).toFixed(4);
        }
        return 0
    }

    const getGramosTotal = (porcentaje) => {
        if (peso > 0 && cantidad > 0 && envases > 0) {
            return parseFloat(((getMiligramosCapsula(porcentaje) / 1000) * cantidad) * envases).toFixed(4);
        }
        return 0
    }

    const getKilos = (porcentaje) => {
        if (peso > 0 && cantidad > 0 && envases > 0) {
            return parseFloat((((getMiligramosCapsula(porcentaje) / 1000) * cantidad) * envases) / 1000).toFixed(4);
        }
        return 0
    }

    const actualizarPrecio = (data, precio) => {
        var newDatos = []
        if (precio !== "") {
            if (parseFloat(precio) > 1) {
                cotizacion.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            porcentaje: item.porcentaje,
                            precio_kilo: parseFloat(precio).toFixed(4)
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion(newDatos)
            } else {
                cotizacion.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            porcentaje: item.porcentaje,
                            precio_kilo: 0
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion(newDatos)
            }
        } else {
            cotizacion.map(item => {
                if (item.materia_prima.id === data.materia_prima.id) {
                    newDatos.push({
                        materia_prima: item.materia_prima,
                        porcentaje: item.porcentaje,
                        precio_kilo: 0
                    })
                } else {
                    newDatos.push(item)
                }
            })
            setCotizacion(newDatos)
        }
    }

    const getTotalFila = (data) => {
        if (peso > 0 && cantidad > 0 && envases > 0) {
            return parseFloat(getKilos(data.porcentaje) * data.precio_kilo).toFixed(4)
        }
        return 0
    }

    const getTotal = () => {
        if (cantidad !== 0 && costoCapsula !== 0 && envases !== 0 && costoEnvase !== 0 && etiquetas !== 0 && costoEtiquetas !== 0) {
            var total = 0;
            cotizacion.map(item => {
                total += parseFloat(getTotalFila(item))
            })
            total += parseFloat(costoCapsula * cantidad)
            total += parseFloat(costoEnvase * envases)
            total += parseFloat(costoEtiquetas * etiquetas)
            return parseFloat(total).toFixed(4)
        }
        return 0
    }

    const getTotalTabla = () => {
        var total = 0;
        cotizacion.map(item => {
            total += parseFloat(getTotalFila(item))
        })
        return total
    }

    const onSaveCotizacion = async () => {
        var input = {}
        var ele = [], por = [], precio = []
        cotizacion.map(item => {
            ele.push(item.materia_prima.id)
            por.push(item.porcentaje)
            precio.push(item.precio_kilo)
        })
        input = {
            formula: formula.id,
            presentacion: producto.id,
            cliente: cliente.id,
            peso: peso,
            elementos: ele,
            porcentajes: por,
            precios: precio,
            cant_cap: cantidad,
            cost_cap: costoCapsula,
            cant_env: envases,
            cost_env: costoEnvase,
            cant_eti: etiquetas,
            cost_eti: costoEtiquetas,
            venta: venta,
            estado: 'REGISTRADA',
            status: 'ACTIVO'
        }
        console.log(input)
        try {
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' })
            const { estado, message } = data.insertarCotizacion;
            if (estado) {
                Notification['success']({
                    title: 'Guardar Cotización',
                    duration: 5000,
                    description: message
                })
                props.history.push('/cotizaciones')
            } else {
                Notification['error']({
                    title: 'Guardar Cotización',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Guardar Cotización',
                duration: 5000,
                description: "Hubo un error inesperado al guardar la cotización"
            })
        }
    }

    const validarFormulario = () => {
        return !formula || !cliente || !producto || !peso || cantidad === 0 || costoCapsula === 0 || envases === 0 || costoEnvase === 0 || etiquetas === 0 || costoEtiquetas === 0 || venta === 0 || getTotalTabla() === 0
    }

    const getCostoEnvace = () => {
        if (envases > 0) {
            return parseFloat(getTotal() / envases).toFixed(4)
        }
        return 0
    }

    return (
        <>
            <h5>Parámetros específicos de la cotización</h5>
            <div className="row my-2">
                <div className="col-md-6">
                    <h6>Cápsulas por envases</h6>
                    <Input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(e)} />
                    <h6>Total de envases</h6>
                    <Input type="number" min={1} value={envases} onChange={(e) => setEnvases(e)} />
                    <h6>Total de etiquetas</h6>
                    <Input type="number" min={1} value={etiquetas} onChange={(e) => setEtiquetas(e)} />
                </div>
                <div className="col-md-6">
                    <h6> Costo por Cápsula Vacía</h6>
                    <Input type="number" min={1} value={costoCapsula} onChange={(e) => setCostoCapsula(e)} />
                    <h6>Costo por envase</h6>
                    <Input type="number" min={1} value={costoEnvase} onChange={(e) => setCostoEnvase(e)} />
                    <h6>Costo por etiqueta</h6>
                    <Input type="number" min={1} value={costoEtiquetas} onChange={(e) => setCostoEtiquetas(e)} />
                </div>
            </div>
            <div className="w-50 mx-auto">
                <h6>Peso de la Cápsula</h6>
                <InputPicker cleanable={false} className="rounded-0 w-100" size="md" placeholder="Peso" data={[{'label': '250mg', 'value': '250'}, {'label': '500mg', 'value': '500'}, {'label': '1000mg', 'value': '1000'}]} searchable={true} onChange={(e) => setPeso(e)} />
            </div>
            <h5>Elementos de la formula</h5>
            <div>
                <Table className="shadow my-2" autoHeight data={cotizacion}>
                    <Column flexGrow={2}>
                        <HeaderCell>Materia Prima</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{rowData.materia_prima.nombre}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Porcentaje</HeaderCell>
                        <Cell dataKey="porcentaje" />
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>MG / Cápsula</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{getMiligramosCapsula(rowData.porcentaje)}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>GR / Cápsula</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{getGramosCapsula(rowData.porcentaje)}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>GR / Envase</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{getGramosEnvase(rowData.porcentaje)}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>GR / Total</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{getGramosTotal(rowData.porcentaje)}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>KG / Total</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{getKilos(rowData.porcentaje)}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Precio / KG</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<Input type="number" style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" defaultValue={rowData.precio_kilo} onChange={(e) => actualizarPrecio(rowData, e)} />)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Total</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{getTotalFila(rowData)}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                </Table>
            </div>
            <div className="d-flex justify-content-end mb-3 mt-1">
                <h6>Total: {getTotal()}</h6>
            </div>
            <div className="row my-2 p-2">
                <h6>Coste de Fabricación por Envase</h6>
                <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{getCostoEnvace()}</label></strong>
                <h6>Venta al Cliente por Envase</h6>
                <Input type="number" min={1} value={venta} onChange={(e) => setVenta(e)} />
                <h6>Ganancia</h6>
                <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(venta === 0 || envases === 0) ? 0 : (venta < (getTotal() / envases)) ? '0' : parseFloat(venta - (getTotal() / envases)).toFixed(4)}</label></strong>
            </div>
            <div className="d-flex justify-content-end my-2">
                <Boton name="Guardar Cotización" icon="plus" color="green" tooltip="Guardar Cotización" onClick={() => onSaveCotizacion()} disabled={validarFormulario()} />
            </div>
        </>
    )
}

export default withRouter(CapsulaDura)