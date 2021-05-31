import React, { useState } from 'react'
import { Redirect, withRouter } from 'react-router'
import Boton from '../shared/Boton'
import Action from '../shared/Action'
import Confirmation from '../shared/Confirmation';
import { Table, Loader, Notification, Popover, Whisper } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { OBTENER_PROVEEDORES, DELETE_PROVEEDOR } from '../../services/ProveedorService';
import { Link } from "react-router-dom";
const { Column, HeaderCell, Cell, Pagination } = Table;

const Clientes = ({ ...props }) => {
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_proveedores, error: error_proveedores, data: data_proveedores } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_PROVEEDOR);

    const handleChangePage = (dataKey) => {
        setPage(dataKey)
    }

    const handleChangeLength = (dataKey) => {
        setPage(1);
        setDisplayLength(dataKey);
    }

    const onDeleteUsuario = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarCliente;
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
        if (modo === "1") {
            const val = key.nombre.toLowerCase();
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

    const NameCell = ({ rowData, dataKey, ...props }) => {
        const speaker = (
            <Popover title="Descripción">
                <p>
                    <b>Tipo:</b> {rowData.tipo}{' '}
                </p>
                <p>
                    <b>Cédula:</b> {rowData.cedula}{' '}
                </p>
                <p>
                    <b>Nombre:</b> {rowData.nombre}{' '}
                </p>
                <p>
                    <b>Email:</b> {rowData.correos[0] ? rowData.correos[0].email : ''}{' '}
                </p>
                <p>
                    <b>Telefono:</b> {rowData.telefonos[0] ? rowData.telefonos[0].telefono : ''}{' '}
                </p>
                <p>
                    <b>Pais:</b> {rowData.pais}{' '}
                </p>
                <p>
                    <b>Ciudad:</b> {rowData.ciudad}{' '}
                </p>
                <p>
                    <b>Dirección:</b> {rowData.direccion}{' '}
                </p>
            </Popover>
        );
        return (
            <Cell {...props}>
                <Whisper placement="top" speaker={speaker}>
                    <label>{rowData[dataKey]}</label>
                </Whisper>
            </Cell>
        );
    };

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
    console.log(props)
    return (
        <>
            <h3 className="text-center">Gestión de Proveedores</h3>
            <div className="input-group mt-3 mb-3">
                <div>
                    <select id="select_modo" className="rounded-0 btn btn-outline-secondary dropdown-toggle" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                        <option value="1"> Nombre del proveedor</option>
                        <option value="2"> Codigo del proveedor</option>
                        <option value="3"> País del proveedor</option>
                    </select>
                </div>
                <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
            </div>
            <div className="mt-3">
                <div>
                    <Table height={500} id="table" data={data}>
                        <Column width={250}>
                            <HeaderCell>Nombre del Proveedor</HeaderCell>
                            <NameCell dataKey='empresa' />
                        </Column>
                        <Column width={250}>
                            <HeaderCell>Cédula del Proveedor</HeaderCell>
                            <Cell dataKey='cedula' />
                        </Column>
                        <Column width={250}>
                            <HeaderCell>País del Proveedor</HeaderCell>
                            <Cell dataKey='pais' />
                        </Column>
                        <Column width={250}>
                            <HeaderCell>Ciudad del Proveedor</HeaderCell>
                            <Cell dataKey='ciudad' />
                        </Column>
                        <Column width={250}>
                            <HeaderCell>Correo del Proveedor</HeaderCell>
                            <Cell>
                                {rowData => { return <label>{rowData.correos[0] ? rowData.correos[0].email : ''}</label> }}
                            </Cell>
                        </Column>
                        <Column width={300}>
                            <HeaderCell>Telefono del Proveedor</HeaderCell>
                            <Cell>
                                {rowData => { return <label>{rowData.telefonos[0] ? rowData.telefonos[0].telefono : ''}</label> }}
                            </Cell>
                        </Column>
                        <Column width={150} fixed="right">
                            <HeaderCell>Acción</HeaderCell>
                            <Cell>
                                {rowData => {
                                    return (
                                        <>
                                            <div className="d-inline-block mx-2">
                                                <Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].editar === true)) ? <Redirect to={`usuarios/editar/${rowData.id}`} /> : mostrarMsj() }} tooltip="Editar Proveedor" color="orange" icon="edit" size="xs" />
                                            </div>
                                            <div className="d-inline-block mx-2">
                                                <Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: rowData.id }) : mostrarMsj() }} tooltip="Eliminar Proveedor" color="red" icon="trash" size="xs" />
                                            </div>
                                            <div className="d-inline-block mx-2">
                                                <Action tooltip="Detalles" color="blue" icon="info" size="xs" />
                                            </div>
                                        </>
                                    );
                                }}
                            </Cell>
                        </Column>
                    </Table>
                </div>
                <Pagination
                    first={false}
                    last={false}
                    next={false}
                    prev={false}
                    showInfo={false}
                    showLengthMenu={false}
                    activePage={page}
                    displayLength={displayLength}
                    total={data_proveedores.obtenerProveedores.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                />
            </div>
            <div className="d-flex justify-content-start">
                <Link to={`/proveedores/nuevo`}><Boton tooltip="Nueva comisión" name="Nuevo" icon="plus" color="green" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Clientes)