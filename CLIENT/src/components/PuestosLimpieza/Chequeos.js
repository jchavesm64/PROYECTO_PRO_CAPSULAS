/* eslint-disable array-callback-return */
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { OBTENER_CHEQUEOS } from '../../services/ChequeoService'
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import Boton from "../shared/Boton";
import { Input, Loader } from 'rsuite';

const Chequeos = ({ ...props }) => {
    const { id } = props.match.params;
    const date1 = new Date(), date2 = new Date()
    let dateL = date1.getDay() !== 0 ? new Date(date1.setDate(date1.getDate() - date1.getDay() + 1)) : new Date(date1.setDate(date1.getDate() - date1.getDay() - 6))
    let dateD = date2.getDay() !== 0 ? new Date(date2.setDate(date2.getDate() - date2.getDay() + 7)) : date2
    const [fecha_lunes, setFechaLunes] = useState(dateL.toISOString().split('T')[0])
    const [fecha_domingo, setFechaDomingo] = useState(dateD.toISOString().split('T')[0])
    const [datos, setDatos] = useState({ datos: [], procesado: false })
    const [cargando, setCargando] = useState(false)
    const [chequeos, { loading, error, data }] = useLazyQuery(OBTENER_CHEQUEOS);

    const buscarChequeos = () => {
        chequeos({ variables: { id: id, fecha1: fecha_lunes, fecha2: fecha_domingo } })
    }

    if(data && !datos.procesado){
        if(datos.obtenerChequeos){
            setDatos({datos: data, procesado: true})
        }
    }

    if (cargando || loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            <h3 className="text-center">Chequeos del Puesto del Limpieza</h3>
            <hr />
            <div className='row'>
                <div className='col-lg-5 col-md-4'>
                    <h5>Fecha del Lunes</h5>
                    <Input type="date" placeholder="Fecha del Lunes" value={fecha_lunes} onChange={(e) => setFechaLunes(e)} />
                </div>
                <div className='col-lg-5 col-md-4'>
                    <h5>Fecha del Domingo</h5>
                    <Input type="date" placeholder="Fecha del Domingo" value={fecha_domingo} onChange={(e) => setFechaDomingo(e)} />
                </div>
                <div className="col-lg-2 col-md-4 mt-4 d-flex justify-content-center">
                    <Boton name="Buscar chequeos" tooltip="Buscar chequeos" icon="fas fa-search" color="green" onClick={() => {setDatos({datos: [], procesado: false}); buscarChequeos()}}/>
                </div>
            </div>
        </>
    )
}

export default withRouter(Chequeos)