/* eslint-disable array-callback-return */
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { OBTENER_CHEQUEOS } from '../../../services/ChequeoService'
import { useQuery, useMutation } from "@apollo/react-hooks";
import { APROBAR_CHEQUEO } from '../../../services/ChequeoService'
import Label from "../../shared/Label";
import Confirmation from '../../shared/Confirmation';
import { Loader, Notification } from 'rsuite';
import CardChequeo from "./CardChequeo";

const Chequeos = ({ ...props }) => {
    const { id } = props.match.params;
    const date1 = new Date(), date2 = new Date()
    let dateL = date1.getDay() !== 0 ? new Date(date1.setDate(date1.getDate() - date1.getDay() + 1)) : new Date(date1.setDate(date1.getDate() - date1.getDay() - 6))
    let dateD = date2.getDay() !== 0 ? new Date(date2.setDate(date2.getDate() - date2.getDay() + 7)) : date2
    const [aprobar] = useMutation(APROBAR_CHEQUEO);
    const [fecha_lunes] = useState(dateL.toISOString().split('T')[0])
    const [fecha_domingo] = useState(dateD.toISOString().split('T')[0])
    const [confimation, setConfirmation] = useState(false);
    const { loading, error, data } = useQuery(OBTENER_CHEQUEOS, { variables: { id: id, fecha1: fecha_lunes, fecha2: fecha_domingo }, pollInterval: 1000 });

    const aprobarChequeo = async (id) => {
        try {
            const { data } = await aprobar({ variables: { id: id }, errorPolicy: 'all' });
            const { estado, message } = data.aprobarChequeo;
            if (estado) {
                Notification['success']({
                    title: 'Aprobar Chequeo',
                    duration: 5000,
                    description: message
                })
            } else {
                Notification['error']({
                    title: 'Aprobar Chequeo',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            Notification['error']({
                title: 'Aprobar Chequeo',
                duration: 5000,
                description: "Hubo un error inesperado al aprobar el chequeo"
            })
        }
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Aprobar este chequeo de limpieza?"
            onDeletObjeto={aprobarChequeo}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    const getData = () => {
        if (data) {
            if (data.obtenerChequeos) {
                return data.obtenerChequeos;
            }
        }
    }

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: "Error",
            duration: 20000,
            description: "Error al obtener la informacion de los chequeos"
        })
    }

    const datos = getData()
    console.log(datos)

    return (
        <>
            <h3 className="text-center">Chequeos del Puesto del Limpieza</h3>
            <hr />
            <div className='row'>
                <div className='col-lg-6 col-md-6'>
                    <h5>Fecha del Lunes</h5>
                    <Label icon="fas fa-calendar" value={fecha_lunes}/>
                </div>
                <div className='col-lg-6 col-md-6'>
                    <h5>Fecha del Domingo</h5>
                    <Label icon="fas fa-calendar" value={fecha_domingo}/>
                </div>
            </div>
            <div className="d-flex flex-wrap justify-content-center col-xs mt-5">
                {
                    datos.map((item) => {
                        return (<CardChequeo chequeo={item} setConfirmation={setConfirmation} />)
                    })
                }
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Chequeos)