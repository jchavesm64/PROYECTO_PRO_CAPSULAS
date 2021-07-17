import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { OBTENER_FORMULAS_MOVIMIENTOS } from '../../services/FormulaService'
import { Loader, Notification, Table, InputPicker, Input } from 'rsuite';
const { Column, HeaderCell, Cell, Pagination } = Table;

const Cotizador = ({ ...props }) => {
    const [cantidad, setCantidad] = useState(0)
    const [envases, setEnvases] = useState(0)
    const [coste, setCoste] = useState(0)
    const [venta, setVenta] = useState(0)
    const [cotizacion, setCotizacion] = useState(null)
    const { loading: load_formulas, error: error_formulas, data: data_formulas } = useQuery(OBTENER_FORMULAS_MOVIMIENTOS, { pollInterval: 1000 })

    if (load_formulas) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_formulas) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de fórmulas, verificar tu conexión a internet'
        })
    }

    const getDataPicker = () => {
        if (data_formulas !== null) {
            if (data_formulas.obtenerFormulasConMovimiento != null) {
                const data = data_formulas.obtenerFormulasConMovimiento;
                var datos = [];
                data.map(item => {
                    datos.push({
                        label: item.nombre,
                        value: item
                    })
                })
                return datos
            }
        }
        return []
    }

    const crearCotizacion = (formula) => {
        if (formula !== null) {
            var data = []
            var index = 0;
            formula.elementos.map(item => {
                data.push({
                    materia_prima: item.materia_prima,
                    movimientos: item.movimientos,
                    porcentaje: formula.porcentajes[index],
                    lote: null,
                    miligramos: 0,
                    precio_kilo: 0
                })
                index++;
            })
            setCotizacion(data)
        } else {
            setCotizacion(null)
        }
    }

    const getLotes = (materia) => {
        var datos = []
        materia.movimientos.map(item => {
            datos.push({
                label: 'Lote: ' + item.lote + ' - Existencia: ' + item.existencia + ' ' + item.unidad,
                value: item
            })
        })
        return datos
    }

    const seleccionarLote = (data, lote) => {
        var newDatos = []
        cotizacion.map(item => {
            if (item.materia_prima.id === data.materia_prima.id) {
                newDatos.push({
                    materia_prima: item.materia_prima,
                    movimientos: item.movimientos,
                    lote: lote,
                    miligramos: item.miligramos,
                    porcentaje: item.porcentaje,
                    precio_kilo: item.precio_kilo
                })
            } else {
                newDatos.push(item)
            }
        })
        setCotizacion(newDatos)
    }

    const actualizarMiligramos = (data, miligramos) => {
        if (miligramos !== "") {
            if (parseInt(miligramos) > 0) {
                var newDatos = []
                cotizacion.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            movimientos: item.movimientos,
                            lote: item.lote,
                            miligramos: parseInt(miligramos),
                            porcentaje: item.porcentaje,
                            precio_kilo: item.precio_kilo
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion(newDatos)
            }
        }
    }

    const actualizarPrecio = (data, precio) => {
        if (precio !== "") {
            if (parseFloat(precio) > 1) {
                var newDatos = []
                cotizacion.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            movimientos: item.movimientos,
                            lote: item.lote,
                            miligramos: item.miligramos,
                            porcentaje: item.porcentaje,
                            precio_kilo: parseFloat(precio)
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion(newDatos)
            }
        }
    }

    const getGramosEnvase = (miligramos) => {
        if (cantidad > 0) {
            return (miligramos / 1000) * cantidad
        }
        return 0
    }

    const getGramosTotal = (miligramos) => {
        if (cantidad > 0 && envases > 0) {
            return getGramosEnvase(miligramos) * envases
        }
        return 0
    }

    const getKilos = (miligramos) => {
        if (cantidad > 0 && envases > 0) {
            return getGramosTotal(miligramos) / 1000;
        }
        return 0
    }

    const getTotalFila = (data) => {
        if (cantidad > 0 && envases > 0 && data.precio_kilo > 0) {
            return getKilos(data.miligramos) * data.precio_kilo;
        }
        return 0;
    }

    const getTotal = () => {
        if (cantidad > 0 && envases > 0) {
            var total = 0;
            cotizacion.map(item => {
                total += item.precio_kilo * getKilos(item.miligramos)
            })
            return total;
        }else{
            return 0;
        }
    }

    return (
        <>
            <h3 className="text-center">Cotizador</h3>
            <div className="my-2 w-75 mx-auto">
                <h6>Seleccione Formula</h6>
                <InputPicker className="h-100 rounded-0 w-100" size="md" placeholder="Fórmula" data={getDataPicker()} searchable={true} onChange={(e) => crearCotizacion(e)} />
            </div>
            {(cotizacion !== null) &&
                <>
                    <div className="row my-2">
                        <div className="col-md-6">
                            <h6>Cantidad por envases</h6>
                            <Input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(e)} />
                        </div>
                        <div className="col-md-6">
                            <h6>Total de envases</h6>
                            <Input type="number" min={1} value={envases} onChange={(e) => setEnvases(e)} />
                        </div>
                    </div>
                    <div>
                        <Table className="shadow" data={cotizacion}>
                            <Column flexGrow={1}>
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
                            <Column flexGrow={2}>
                                <HeaderCell>Lote</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<InputPicker className="rounded-0" style={{ padding: 0, minHeight: 40, marginTop: -10 }} size="md" placeholder="Seleccionar Lote" data={getLotes(rowData)} searchable={true} onChange={(e) => seleccionarLote(rowData, e)} />)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>MG / Cápsula</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<Input type="number" style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" defaultValue={rowData.miligramos} onChange={(e) => actualizarMiligramos(rowData, e)} disabled={rowData.lote === null} />)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>GR / Cápsula</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{rowData.miligramos / 1000}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>GR / Envase</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getGramosEnvase(rowData.miligramos)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>GR / Total</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getGramosTotal(rowData.miligramos)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>KG / Total</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getKilos(rowData.miligramos)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Precio / KG</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<Input type="number" style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" defaultValue={rowData.precio_kilo} onChange={(e) => actualizarPrecio(rowData, e)} disabled={rowData.lote === null} />)
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
                    <div className="row my-2">
                        <h6>Coste de Fabricación por Envase</h6>
                        <strong className="bg-white rounded border"><label className="pt-2" style={{fontSize: 16, height: 40}}>{getTotal() / envases}</label></strong>
                        <h6>Venta al Cliente por envace</h6>
                        <Input type="number" min={1} value={venta} onChange={(e) => setVenta(e)} />
                        <h6>Ganancia</h6>
                        <strong className="bg-white rounded border"><label className="pt-2" style={{fontSize: 16, height: 40}}>{(venta < (getTotal() / envases)) ? '0' : venta - (getTotal() / envases)}</label></strong>
                    </div>
                </>
            }
        </>
    )
}

export default withRouter(Cotizador)