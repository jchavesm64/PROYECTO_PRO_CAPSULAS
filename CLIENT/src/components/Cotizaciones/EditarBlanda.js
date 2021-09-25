/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_COTIZACION } from '../../services/CotizacionService'
import { Notification, Table, Input, InputPicker } from 'rsuite';
import Boton from '../shared/Boton';
const { Column, HeaderCell, Cell } = Table;

const CapsulaBlanda = ({ ...props }) => {
    const { formula, cliente, producto, objeto } = props
    const [actualizar] = useMutation(UPDATE_COTIZACION)
    const [cotizacion, setCotizacion] = useState(null)
    const [venta, setVenta] = useState(objeto.venta)
    const [peso, setPeso] = useState(objeto.peso)
    const [cantidad, setCantidad] = useState(objeto.cant_cap)
    const [envases, setEnvases] = useState(objeto.cant_env)
    const [etiquetas, setEtiquetas] = useState(objeto.cant_eti)
    const [costoEnvase, setCostoEnvase] = useState(objeto.cost_env)
    const [costoEtiquetas, setCostoEtiquetas] = useState(objeto.cost_eti)
    const [utilidad, setUtilidad] = useState({utilidad: 0, validada: false});

    useEffect(() => {
        setUtilidad({utilidad: 0, validada: false})
        setVenta(objeto.venta)
        setPeso(objeto.peso)
        setCantidad(objeto.cant_cap)
        setEnvases(objeto.cant_env)
        setEtiquetas(objeto.cant_eti)
        setCostoEnvase(objeto.cost_env)
        setCostoEtiquetas(objeto.cost_eti)
    }, [objeto])

    if (formula !== null && cotizacion === null) {
        const datos = [], capsula = []
        for (let i = 0; i < objeto.elementos.length; i++) {
            datos.push({
                materia_prima: objeto.elementos[i],
                porcentaje: objeto.porcentajes[i],
                precio_kilo: objeto.precios[i]
            })
        }
        for (let i = 0; i < objeto.elementos_c.length; i++) {
            capsula.push({
                materia_prima: objeto.elementos_c[i],
                cantidad_kilo: objeto.cantidad_c[i],
                precio_kilo: objeto.precios_c[i]
            })
        }
        capsula.push({
            materia_prima: { id: 'nulo', nombre: 'Agua Purificada' },
            cantidad_kilo: objeto.agua,
            precio_kilo: 0
        })
        setCotizacion({ datos: datos, capsula: capsula })
    }

    const actualizarCantidadCapsula = (data, cantidad) => {
        var newDatos = []
        if (cantidad !== "") {
            if (parseFloat(cantidad) > 1) {
                cotizacion.capsula.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            cantidad_kilo: parseFloat(cantidad),
                            precio_kilo: item.precio_kilo
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
            } else {
                cotizacion.capsula.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            cantidad_kilo: 0,
                            precio_kilo: item.precio_kilo
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
            }
        } else {
            cotizacion.capsula.map(item => {
                if (item.materia_prima.id === data.materia_prima.id) {
                    newDatos.push({
                        materia_prima: item.materia_prima,
                        cantidad_kilo: 0,
                        precio_kilo: item.precio_kilo
                    })
                } else {
                    newDatos.push(item)
                }
            })
            setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
        }
    }

    const actualizarPrecioCapsula = (data, precio) => {
        var newDatos = []
        if (precio !== "") {
            if (parseFloat(precio) > 1) {
                cotizacion.capsula.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            cantidad_kilo: item.cantidad_kilo,
                            precio_kilo: parseFloat(precio)
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
            } else {
                cotizacion.capsula.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            cantidad_kilo: item.cantidad_kilo,
                            precio_kilo: 0
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
            }
        } else {
            cotizacion.capsula.map(item => {
                if (item.materia_prima.id === data.materia_prima.id) {
                    newDatos.push({
                        materia_prima: item.materia_prima,
                        cantidad_kilo: item.cantidad_kilo,
                        precio_kilo: 0
                    })
                } else {
                    newDatos.push(item)
                }
            })
            setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
        }
    }

    const getTotalFilaCapsula = (data) => {
        return parseFloat(data.cantidad_kilo * data.precio_kilo).toFixed(4)
    }

    const getTotalCapsula = () => {
        var total = 0
        cotizacion.capsula.map(item => {
            total += parseFloat(getTotalFilaCapsula(item))
        })
        return parseFloat(total).toFixed(4)
    }

    //--------------------------------------------
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
                cotizacion.datos.map(item => {
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
                setCotizacion({ datos: newDatos, capsula: cotizacion.capsula })
            } else {
                cotizacion.datos.map(item => {
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
                setCotizacion({ datos: newDatos, capsula: cotizacion.capsula })
            }
        } else {
            cotizacion.datos.map(item => {
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
            setCotizacion({ datos: newDatos, capsula: cotizacion.capsula })
        }
    }

    const getTotalFila = (data) => {
        if (peso > 0 && cantidad > 0 && envases > 0) {
            return parseFloat(getKilos(data.porcentaje) * data.precio_kilo).toFixed(4)
        }
        return 0
    }

    const getTotal = () => {
        if (cantidad !== 0 && parseFloat(getTotalCapsula()) !== 0 && envases !== 0 && costoEnvase !== 0 && etiquetas !== 0 && costoEtiquetas !== 0) {
            var total = 0;
            cotizacion.datos.map(item => {
                total += parseFloat(getTotalFila(item))
            })
            total += parseFloat(parseFloat(getTotalCapsula()) / cantidad)
            total += parseFloat(costoEnvase * envases)
            total += parseFloat(costoEtiquetas * etiquetas)
            return parseFloat(total).toFixed(4)
        }
        return 0
    }

    const getTotalTabla = () => {
        var total = 0;
        cotizacion.datos.map(item => {
            total += parseFloat(getTotalFila(item))
        })
        return total
    }

    const onSaveCotizacion = async () => {
        var input = {}
        var ele = [], por = [], precio = [], cap = [], cancap = [], precap = [], agua = 0
        cotizacion.datos.map(item => {
            ele.push(item.materia_prima.id)
            por.push(item.porcentaje)
            precio.push(item.precio_kilo)
        })
        cotizacion.capsula.map(item => {
            if (item.materia_prima.nombre === 'Agua Purificada') {
                agua = item.cantidad_kilo
            } else {
                cap.push(item.materia_prima.id)
                cancap.push(item.cantidad_kilo)
                precap.push(item.precio_kilo)
            }
        })
        input = {
            formula: formula,
            presentacion: producto,
            cliente: cliente,
            peso: peso,
            elementos: ele,
            porcentajes: por,
            precios: precio,
            cant_cap: cantidad,
            cost_cap: parseFloat(getTotalCapsula()) / cantidad,
            cant_env: envases,
            cost_env: costoEnvase,
            cant_eti: etiquetas,
            cost_eti: costoEtiquetas,
            venta: ((getTotal()/envases) + (((getTotal()/envases)*utilidad.utilidad)/100)),
            agua: agua,
            elementos_c: cap,
            cantidad_c: cancap,
            precios_c: precap,
            estado: 'REGISTRADA',
            status: 'ACTIVO'
        }
        console.log(input)
        try {
            const { data } = await actualizar({ variables: { id: objeto.id, input }, errorPolicy: 'all' })
            const { estado, message } = data.actualizarCotizacion;
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
                description: "Hubo un error inesperado al actualizar la cotización"
            })
        }
    }

    const validarFormulario = () => {
        if (objeto.estado === 'ENVIADA') {
            return true
        }
        return !formula || !cliente || !producto || !peso || cantidad === 0 || parseFloat(getTotalCapsula()) === 0 || envases === 0 || costoEnvase === 0 || etiquetas === 0 || costoEtiquetas === 0 || utilidad === 0 || getTotalTabla() === 0
    }

    const getCostoEnvace = () => {
        if (envases > 0) {
            return parseFloat(getTotal() / envases).toFixed(4)
        }
        return 0
    }

    if (cotizacion === null){
        setUtilidad({utilidad: 0, validada: false});
    } else if (utilidad.validada === false){
        var v = venta, uti = 0;
        v -= (getTotal()/envases);
        uti = (v*100)/(getTotal()/envases);
        setUtilidad({utilidad: uti.toFixed(4), validada: true})
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
                    <div style={{ height: 60 }}></div>
                    <h6>Costo por envase</h6>
                    <Input type="number" min={1} value={costoEnvase} onChange={(e) => setCostoEnvase(e)} />
                    <h6>Costo por etiqueta</h6>
                    <Input type="number" min={1} value={costoEtiquetas} onChange={(e) => setCostoEtiquetas(e)} />
                </div>
            </div>
            <div className="w-50 mx-auto">
                <h6>Peso de la Cápsula</h6>
                <InputPicker cleanable={false} value={peso} className="rounded-0 w-100" size="md" placeholder="Peso" data={[{ 'label': '250mg', 'value': '250' }, { 'label': '500mg', 'value': '500' }, { 'label': '1000mg', 'value': '1000' }]} searchable={true} onChange={(e) => setPeso(e)} />
            </div>
            <h5>Costo de la Cápsula</h5>
            {cotizacion &&
                <div>
                    <div>
                        <Table autoHeight data={cotizacion.capsula} className="shadow my-2">
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
                            <Column flexGrow={2}>
                                <HeaderCell>Cantidad KG</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<Input type="number" style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" defaultValue={rowData.cantidad_kilo} onChange={(e) => actualizarCantidadCapsula(rowData, e)} />)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={2}>
                                <HeaderCell>Precio KG</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (rowData.materia_prima.nombre === 'Agua Purificada' ? <h6 className="text-center">-</h6> : <Input type="number" style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" defaultValue={rowData.cantidad_kilo} onChange={(e) => actualizarPrecioCapsula(rowData, e)} />)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Total</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (rowData.materia_prima.nombre === 'Agua Purificada' ? <h6>-</h6> : <label>{getTotalFilaCapsula(rowData)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                        </Table>
                    </div>
                    <div className="d-flex justify-content-end">
                        <h6>Precio de la Cápsula: {getTotalCapsula()}</h6>
                    </div>
                    <div className="my-2">
                        <h5>Elementos de la formula</h5>
                        <div>
                            <Table className="shadow my-2" autoHeight data={cotizacion.datos}>
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
                            <h6>Porcentaje de Ganancia por Envase</h6>
                            <Input type="number" min={1} value={utilidad.utilidad} onChange={(e) => setUtilidad({utilidad: e, validada: utilidad.validada})} />
                            <h6>Ganancia</h6>
                            <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(utilidad === 0 || envases === 0) ? 0 : parseFloat(((getTotal() / envases)*utilidad.utilidad)/100).toFixed(4)}</label></strong>
                            <h6>Venta</h6>
                            <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(utilidad === 0 || envases === 0) ? 0 : parseFloat((getTotal()/envases) + (((getTotal()/envases)*utilidad.utilidad)/100)).toFixed(4)}</label></strong>
                        </div>
                        <div className="d-flex justify-content-end my-2">
                            <Boton name="Guardar Cotización" icon="plus" color="green" tooltip="Guardar Cotización" onClick={() => onSaveCotizacion()} disabled={validarFormulario()} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default withRouter(CapsulaBlanda)