import React, { useState } from 'react'
import { withRouter } from 'react-router'
import Boton from '../shared/Boton'
import Confirmation from '../shared/Confirmation';
import { Loader, Notification } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { OBTENER_PROVEEDORES, DELETE_PROVEEDOR } from '../../services/ProveedorService';
import { Link } from "react-router-dom";
import DataGrid from '../shared/DataGrid';

const Proveedores = ({ ...props }) => {
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_proveedores, error: error_proveedores, data: data_proveedores } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_PROVEEDOR);

    const onDeleteUsuario = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarProveedor;
        if (estado) {
            Notification['success']({
                title: 'Eliminar Proveedor',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Proveedor',
                duration: 20000,
                description: message
            })
        }
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Estás seguro/a de eliminar?"
            onDeletObjeto={onDeleteUsuario}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    function getFilteredByKey(modo, key, value) {
        console.log(modo, key, value)
        if (modo === "1") {
            const val = key.empresa.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        } else if (modo === "2") {
            const val = key.codigo.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        } else {
            const val = key.pais.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const getData = () => {
        return data_proveedores.obtenerProveedores.filter((value, index) => {
            if (filter !== "" && modo !== "") {
                return getFilteredByKey(modo, value, filter);
            }
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return index >= start && index < end;
        });
    }

    const mostrarMsj = () => {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'No tienes el rol necesario para realizar esta acción.'
        })
    }

    if (load_proveedores) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_proveedores) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de usuarios, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <h3 className="text-center">Gestión de Proveedores</h3>
            <div className="row" style={{ margin: 0, padding: 0 }}>
                <div style={{ padding: 0 }} className="col-md-3">
                    <select id="select_modo" className="h-100 rounded-0 btn btn-outline-secondary dropdown-toggle w-100" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                        <option value="1"> Nombre del proveedor</option>
                        <option value="2"> Codigo del proveedor</option>
                        <option value="3"> País del proveedor</option>
                    </select>
                </div>
                <div style={{ padding: 0 }} className="col-md-9 h-100">
                    <div className="input-group">
                        <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                        <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <DataGrid data={data} setConfirmation={setConfirmation} mostrarMsj={mostrarMsj} type="proveedores" displayLength={9} {...props} />
            </div>
            <div className="d-flex justify-content-start my-2">
                <Link to={`/proveedores/nuevo`}><Boton tooltip="Nueva comisión" name="Nuevo" icon="plus" color="green" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Proveedores)