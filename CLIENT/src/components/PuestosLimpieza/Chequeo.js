/* eslint-disable array-callback-return */
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Boton from "../shared/Boton";
import Confirmation from '../shared/Confirmation';
import { OBTENER_PUESTO_LIMPIEZA } from "../../services/PuestoLimpiezaService";
import { Loader, Notification, Input, Checkbox } from 'rsuite'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { OBTENER_CHEQUEO, SAVE_CHEQUEO, UPDATE_CHEQUEO } from '../../services/ChequeoService'

const Chequeo = ({ ...props }) => {
    const fecha = new Date().toLocaleString().split(' ')[0].split('/')
    const [date, setDate] = useState(fecha[2] + '-' + (fecha[1] < 10 ? ('0' + fecha[1]) : fecha[1]) + '-' + fecha[0])
    const id = localStorage.getItem('id_vincular_puesto')
    const { loading, error, data } = useQuery(OBTENER_PUESTO_LIMPIEZA, { variables: { id: id }, pollInterval: 1000 });
    const [chequeo, { loading: load_chequeo, error: error_chequeo, data: datos_chequeo }] = useLazyQuery(OBTENER_CHEQUEO);
    const [datos, setDatos] = useState({ areas: [], procesado: false })
    const [refresh, setRefresh] = useState(false)
    const [confimation, setConfirmation] = useState(false);
    const [insertar] = useMutation(SAVE_CHEQUEO);
    const [actualizar] = useMutation(UPDATE_CHEQUEO);

    const desvincularDispositivo = () => {
        localStorage.removeItem('id_vincular_puesto')
        window.location.href = "/"
    }

    const buscarChequeo = () => {
        chequeo({ variables: { id: id, fecha: date } })
    }

    const cambiarEstado = (index) => {
        const area = datos.areas[index]
        const new_area = {
            area: area.area,
            estado: true
        }
        datos.areas[index] = new_area
        setRefresh(!refresh)
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="Si marca esta área, no podra desmarcarla después"
            onDeletObjeto={cambiarEstado}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

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
        console.log(datos_chequeo)
        if (datos_chequeo.obtenerChequeo) {
            const { chequeo, estado } = datos_chequeo.obtenerChequeo
            let areas = []
            if (estado === 1) {
                areas = chequeo.areas
            } else if (estado === 2) {
                const pl = data.obtenerPuestoLimpieza
                pl.areas.map(item => {
                    areas.push({ area: item.nombre, estado: false })
                })
            } else {
                Notification['error']({
                    title: "Error",
                    duration: 20000,
                    description: "Error al obtener la informacion del chequeo de hoy"
                })
            }
            setDatos({ areas: areas, procesado: true })
        }
    }

    const AreaChequeo = ({ area, index }) => {
        return (
            <div className={`p-2 m-2 shadow-lg rounded-3`} style={{ minWidth: '300px', width: '300px', maxWidth: '300px', backgroundColor: area.estado ? "#6de069" : "white" }}>
                <h4 className="text-center">{area.area}</h4>
                <Checkbox checked={area.estado} onChange={!area.estado ? () => setConfirmation({ bool: true, id: index }) : () => { }}><label style={{ fontSize: '16pt', marginTop: '-5px' }} >Área Chequeada</label></Checkbox>
            </div>
        )
    }

    const guardarChequeo = async () => {
        const { session } = props
        const input = {
            puesto_limpieza: id,
            areas: datos.areas,
            fecha: date,
            aprobado: false,
            usuario: session.id
        }
        const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
        const { estado, message } = data.insertarChequeo;
        if (estado) {
            Notification['success']({
                title: 'Registrar Chequeo',
                duration: 5000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Registrar Chequeo',
                duration: 5000,
                description: message
            })
        }
    }

    const validarForm = () => {
        return datos.areas.length === 0
    }

    return (
        <div className="container">
            <div>
                <Boton name="Desvincular Dispositivo" onClick={() => desvincularDispositivo()} icon="fas fa-unlink" tooltip="Desvincular Dispositivo" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Chequeo de Área</h3>
            <h5>Fecha de Hoy</h5>
            <div className="row">
                <div className="col-md-8 my-2">
                    <Input type="date" placeholder="Fecha del Lunes" value={date} onChange={(e) => setDate(e)} />
                </div>
                <div className="col-md-4 d-flex justify-content-center my-2">
                    <Boton name="Buscar chequeo en esta fecha" tooltip="Buscar chequeo en esta fecha" icon="fas fa-search" color="green" onClick={() => buscarChequeo()} disable={!fecha} />
                </div>
            </div>
            {
                datos.procesado &&
                <div className="d-flex flex-wrap justify-content-center col-xs mt-5">
                    {
                        datos.areas.map((item, index) => {
                            return (<AreaChequeo area={item} index={index} />)
                        })
                    }
                </div>
            }
            <div className="d-flex justify-content-end float-rigth mt-3">
                <Boton onClick={guardarChequeo} tooltip="Guardar Chequeo" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
            {isConfirmation}
        </div>
    )

}

export default withRouter(Chequeo)