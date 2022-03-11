import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Boton from "../shared/Boton";
import { OBTENER_PUESTO_LIMPIEZA } from "../../services/PuestoLimpiezaService";
import { Loader, Notification, Input } from 'rsuite'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { OBTENER_CHEQUEO } from '../../services/ChequeoService'

const Chequeo = ({ ...props }) => {
    const fecha = new Date().toLocaleString().split(' ')[0].split('/')
    const [date, setDate] = useState(fecha[2] + '-' + (fecha[1] < 10 ? ('0' + fecha[1]) : fecha[1]) + '-' + fecha[0])
    const id = localStorage.getItem('id_vincular_puesto')
    const { loading, error, data } = useQuery(OBTENER_PUESTO_LIMPIEZA, { variables: { id: id }, pollInterval: 1000 });
    const [chequeo, { loading: load_chequeo, error: error_chequeo, data: datos_chequeo }] = useLazyQuery(OBTENER_CHEQUEO);
    const [datos, setDatos] = useState({ areas: [], procesado: false })

    const desvincularDispositivo = () => {
        localStorage.removeItem('id_vincular_puesto')
        window.location.href = "/"
    }

    const buscarChequeo = () => {
        chequeo({ variables: { id: id, fecha: date } })
    }

    if (loading || load_chequeo) {
        return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    }
    if (error) {
        Notification['error']({
            title: "Error",
            duration: 20000,
            description: "Error al obtener la informacion del puesto de limpieza"
        })
    }
    if (error_chequeo) {
        Notification['error']({
            title: "Error",
            duration: 20000,
            description: "Error al obtener la informacion del chequeo de hoy"
        })
    }


    if (datos_chequeo && !datos.procesado) {
        if (datos_chequeo.obtenerChequeo) {
            const { chequeo, estado } = datos_chequeo.obtenerChequeo
            const areas = []
            if (estado === 1) {
                areas = chequeo.areas
            } else if (estado === 2) {
                const pl = data.obtenerPuestoLimpieza
                pl.areas.map(item => {
                    areas.push({area: item.nombre, estado: false})
                })
            } else {
                Notification['error']({
                    title: "Error",
                    duration: 20000,
                    description: "Error al obtener la informacion del chequeo de hoy"
                })
            }
            setDatos({areas, procesado: true})
        }
    }

    return (
        <>
            <div>
                <Boton name="Desvincular Dispositivo" onClick={() => desvincularDispositivo()} icon="fas fa-unlink" tooltip="Desvincular Dispositivo" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Chequeo de Área</h3>
            <h5>Fecha de Hoy</h5>
            <div className="row">
                <div className="col-md-8">
                    <Input type="date" placeholder="Fecha del Lunes" value={date} onChange={(e) => setDate(e)} />
                </div>
                <div className="col-md-4 d-flex justify-content-center">
                    <Boton name="Buscar chequeo en esta fecha" tooltip="Buscar chequeo en esta fecha" icon="fas fa-search" color="green" onClick={() => buscarChequeo()} disable={!fecha} />
                </div>
            </div>
        </>
    )

}

export default withRouter(Chequeo)