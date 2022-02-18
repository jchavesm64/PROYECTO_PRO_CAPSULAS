import React from 'react'
import { withRouter } from 'react-router'
import { useQuery } from "@apollo/react-hooks";
import { OBTENER_INFORMACION_MAQUINA } from '../../services/MaquinaService'
import { Loader, Notification } from 'rsuite';


const InformacionMaquinaria = ({ ...props }) => {
    const { id } = props.match.params;
    const { loading: load_maquina, error: error_maquina, data: data_maquina } = useQuery(OBTENER_INFORMACION_MAQUINA, { variables: { id: id }, pollInterval: 1000 });

    if(load_maquina){
        return (<Loader backdrop content="Cargando..." vertical size="lg"/>);
    }
    if(error_maquina){
        Notification['error']({
            title: "Error",
            duration: 20000,
            description: "Error al obtener la informacion de la máquina"
        })
    }

    return (
        <>
            <h3 className='text-center'>Información de la Máquina</h3>
        </>
    )
}

export default withRouter(InformacionMaquinaria)