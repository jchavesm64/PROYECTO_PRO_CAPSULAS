/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Loader, Notification, IconButton, Icon, Input } from 'rsuite';
import { PDFDownloadLink } from '@react-pdf/renderer'
import PlanillaPDF from './Exportar/PlanillaPDF';
import { useLazyQuery } from "@apollo/react-hooks";
import { withRouter } from 'react-router'
import { OBTENER_HORAS } from '../../services/HorasService';
import Boton from '../shared/Boton';
import Table from '../shared/Table';

const Planilla = ({ ...props }) => {
    const [filtrar, { loading, error, data }] = useLazyQuery(OBTENER_HORAS);
    const [fecha1, setFecha1] = useState('')
    const [fecha2, setFecha2] = useState('')
    const titles = [{ title: 'Nombre', class: '' }, { title: 'Cédula', class: '' }, { title: 'Horas Laboradas', class: '' }, { title: 'Precio Horas', class: '' }, { title: 'Total', class: '' }];

    const obtenerInfo = async () => {
        await filtrar({ variables: { f1: fecha1, f2: fecha2 } })
    }

    if (loading) {
        return <Loader backdrop content="Cargando..." vertical size="lg" />
    }
    if (error) {
        Notification['error']({
            title: 'Error',
            description: "Error al obtener las horas para la planilla",
            duration: 10000

        });

    }

    function getFecha(fecha, simbol) {
        return fecha.replace(/-/g, simbol)
    }

    const getData = () => {
        if (data) {
            if (data.obtenerHoras) {
                const datos = data.obtenerHoras
                const planta = [], capsulas = [], admin = []
                datos.map(d => {
                    if (d.tipo === 'P') {
                        planta.push(d)
                    } else if (d.tipo === 'C') {
                        capsulas.push(d)
                    } else {
                        admin.push(d)
                    }
                })
                let pla_f = [], cap_f = [], adm_f = [], aux = null, horas = 0, existe = false
                planta.map(obj1 => {
                    aux = {
                        empleado: obj1.empleado,
                        horas: 0,
                        costo_hora: obj1.costo_hora,
                    }
                    horas = 0
                    existe = false
                    planta.map(obj2 => {
                        if (obj1.empleado.cedula === obj2.empleado.cedula) {
                            horas += obj2.horas
                        }
                    })
                    aux.horas = horas
                    pla_f.map(i => {
                        if (i.empleado.cedula === aux.empleado.cedula) {
                            existe = true
                        }
                    })
                    if (!existe) {
                        pla_f.push(aux)
                    }
                })
                //
                capsulas.map(obj1 => {
                    aux = {
                        empleado: obj1.empleado,
                        horas: 0,
                        costo_hora: obj1.costo_hora,
                    }
                    horas = 0
                    existe = false
                    capsulas.map(obj2 => {
                        if (obj1.empleado.cedula === obj2.empleado.cedula) {
                            horas += obj2.horas
                        }
                    })
                    aux.horas = horas
                    cap_f.map(i => {
                        if (i.empleado.cedula === aux.empleado.cedula) {
                            existe = true
                        }
                    })
                    if (!existe) {
                        cap_f.push(aux)
                    }
                })
                //
                admin.map(obj1 => {
                    aux = {
                        empleado: obj1.empleado,
                        horas: 0,
                        costo_hora: obj1.empleado.puesto.salario,
                    }
                    horas = 0
                    existe = false
                    admin.map(obj2 => {
                        if (obj1.empleado.cedula === obj2.empleado.cedula) {
                            horas += obj2.horas
                        }
                    })
                    aux.horas = horas
                    adm_f.map(i => {
                        if (i.empleado.cedula === aux.empleado.cedula) {
                            existe = true
                        }
                    })
                    if (!existe) {
                        adm_f.push(aux)
                    }
                })
                return {
                    p: pla_f,
                    c: cap_f,
                    a: adm_f
                }
            }
        }
        return null
    }

    const RowData = ({ data }) => {
        return (
            <tr>
                <td>{data.empleado.nombre}</td>
                <td>{data.empleado.cedula}</td>
                <td>{data.horas}</td>
                <td>{data.costo_hora}</td>
                <td>{data.horas * data.costo_hora}</td>
            </tr>
        )
    }

    const info = getData()

    return (
        <div className='mx-auto'>
            <div className='row'>
                <div className='col-md-6'>
                    <h5>Fecha Menor</h5>
                    <Input type="date" placeholder="Fecha" value={fecha1} onChange={(e) => setFecha1(e)} />
                </div>
                <div className='col-md-6'>
                    <h5>Fecha Mayor</h5>
                    <Input type="date" placeholder="Fecha" value={fecha2} onChange={(e) => setFecha2(e)} />
                </div>
            </div>
            {
                info !== null &&
                <div className='mt-3'>
                    {
                        (info.p.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Planilla Operativa</h5>
                            <Table Title={titles} Rows={RowData} info={info.p} />
                        </div>
                    }
                    {
                        (info.c.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Producción de Cápsulas</h5>
                            <Table Title={titles} Rows={RowData} info={info.c} />
                        </div>
                    }
                    {
                        (info.a.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Planilla Administrativa</h5>
                            <Table Title={titles} Rows={RowData} info={info.a} />
                        </div>
                    }
                </div>
            }
            <div className='mt-3'>
                {
                    info === null ? (
                        <Boton onClick={obtenerInfo} tooltip="Obtener Información" name="Obtener Información" icon="save" color="green" disabled={!fecha1 && !fecha2} />
                    ) : (
                        <PDFDownloadLink
                            document={<PlanillaPDF info={info} fecha1={getFecha(fecha1, " - ")} fecha2={getFecha(fecha2, " - ")} />}
                            fileName={`INFORME_COTIZACION_${getFecha(fecha1, "_")}_${getFecha(fecha2, "_")}.pdf`}
                        >
                            {({ blob, url, loading: loadingDocument, error: error_loading }) =>
                                loadingDocument ?
                                    ''
                                    :
                                    <Boton icon="download" size="lg" color="yellow" tooltip="Descargar Planilla" name="Descargar Planilla" position='end' />
                            }
                        </PDFDownloadLink>
                    )
                }
            </div>
        </div>
    )
}

export default withRouter(Planilla)