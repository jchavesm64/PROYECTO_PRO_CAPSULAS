import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_COTIZACIONES } from '../../services/CotizacionService'
import { Loader, Notification, Table } from 'rsuite';
import Boton from '../shared/Boton';
import { parse } from 'graphql';
const { Column, HeaderCell, Cell } = Table;

const Cotizaciones = ({ ...props }) => {
    const { loading, error, data } = useQuery(OBTENER_COTIZACIONES, { pollInterval: 1000 })

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de fórmulas, verificar tu conexión a internet'
        })
    }

    const getDatos = (item) => {
        var data = [], obj = {}
        for (let i = 0; i < item.elementos.length; i++) {
            data.push({
                materia_prima: item.elementos[i].nombre,
                porcentaje: item.porcentajes[i],
                miligramos: item.miligramos[i],
                gramos_cap: (item.miligramos[i] / 1000),
                gramos_env: ((item.miligramos[i] / 1000) * item.cantidad),
                gramos_tot: (((item.miligramos[i] / 1000) * item.cantidad) * item.envases),
                kilos: (((item.miligramos[i] / 1000) * item.cantidad) * item.envases) / 1000,
                precio_kilo: item.precio_kilo[i],
                total: parseFloat(item.precio_kilo[i] * ((((item.miligramos[i] / 1000) * item.cantidad) * item.envases) / 1000)).toFixed(2)
            })
        }
        return data
    }

    const getPrecioEnvase = (item) => {
        var pe = 0
        for (let i = 0; i < item.miligramos.length; i++) {
            pe += item.precio_kilo[i] * ((((item.miligramos[i] / 1000) * item.cantidad) * item.envases) / 1000)
        }
        pe += item.cantidad * item.costoCapsula
        pe += item.costoEnvase * item.envases
        pe += item.etiqueta * item.costoEtiqueta
        return parseFloat(pe / item.envases).toFixed(2)
    }

    const getTotal = (item) => {
        var pe = 0
        for (let i = 0; i < item.miligramos.length; i++) {
            pe += item.precio_kilo[i] * ((((item.miligramos[i] / 1000) * item.cantidad) * item.envases) / 1000)
        }
        pe += item.cantidad * item.costoCapsula
        pe += item.costoEnvase * item.envases
        pe += item.etiqueta * item.costoEtiqueta
        return parseFloat(pe).toFixed(2)
    }

    console.log(data)

    return (
        <>
            <h3 className="text-center">Cotizaciones</h3>
            {!data || !data.obtenerCotizaciones ?
                (
                    <h6>No hay cotizaciones registradas</h6>
                ) : (
                    <>
                        {
                            data.obtenerCotizaciones.map(item => {
                                return (
                                    <div className="bg-white p-2 m-2 shadow row">
                                        <h6>Fórmula</h6>
                                        <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.formula.nombre}</label></strong>
                                        <div className="row my-2">
                                            <div className="col-md-5">
                                                <h6>Cantidad de Cápsulas por Envase</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.cantidad}</label></strong>
                                                <h6>Cantidad de Envases</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.envases}</label></strong>
                                                <h6>Cantidad de Etiquetas</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.etiqueta}</label></strong>
                                            </div>
                                            <div className="col-md-5">
                                                <h6>Costo por Cápsula</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.costoCapsula}</label></strong>
                                                <h6>Costo de Envase</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.costoEnvase}</label></strong>
                                                <h6>Costo de Etiqueta</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.costoEtiqueta}</label></strong>
                                            </div>
                                            <div className="col-md-2">
                                                <h6>Total por Cápsula</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{parseFloat(item.cantidad * item.costoCapsula).toFixed(2)}</label></strong>
                                                <h6>Total de Envase</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{parseFloat(item.costoEnvase * item.envases).toFixed(2)}</label></strong>
                                                <h6>Total de Etiqueta</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{parseFloat(item.etiqueta * item.costoEtiqueta).toFixed(2)}</label></strong>
                                            </div>
                                        </div>

                                        <div>
                                            <Table className="shadow my-3" data={getDatos(item)}>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Materia Prima</HeaderCell>
                                                    <Cell dataKey="materia_prima" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Porcentaje</HeaderCell>
                                                    <Cell dataKey="porcentaje" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Miligramos</HeaderCell>
                                                    <Cell dataKey="miligramos" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>GR / Cápsula</HeaderCell>
                                                    <Cell dataKey="gramos_cap" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>GR/ Envase</HeaderCell>
                                                    <Cell dataKey="gramos_env" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>GR / Total</HeaderCell>
                                                    <Cell dataKey="gramos_tot" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Kilos</HeaderCell>
                                                    <Cell dataKey="kilos" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Precio Kilo</HeaderCell>
                                                    <Cell dataKey="precio_kilo" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Total</HeaderCell>
                                                    <Cell dataKey="total" />
                                                </Column>
                                            </Table>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <h6>Total: {getTotal(item)}</h6>
                                        </div>
                                        <h6>Precio por Envase</h6>
                                        <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{getPrecioEnvase(item)}</label></strong>
                                        <h6>Precio de Venta por Envase</h6>
                                        <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.venta}</label></strong>
                                        <h6>Ganancia por Envase</h6>
                                        <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{parseFloat(item.venta - getPrecioEnvase(item)).toFixed(2)}</label></strong>
                                    </div>
                                )
                            })
                        }
                    </>
                )

            }
        </>
    )
}

export default withRouter(Cotizaciones)