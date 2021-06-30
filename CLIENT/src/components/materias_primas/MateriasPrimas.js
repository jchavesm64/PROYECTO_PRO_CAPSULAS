import React, { useState } from 'react'
import { withRouter } from 'react-router'
import Boton from '../shared/Boton'
import Confirmation from '../shared/Confirmation';
import { Loader, Notification, Popover, Whisper } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { OBTENER_MATERIAS_PRIMAS, DELETE_MATERIA_PRIMA } from '../../services/MateriaPrimaService'
import DataGrid from '../shared/DataGrid'

const MateriaPrima = ({ ...props }) => {
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_materia_prima, error: error_materia_prima, data: data_materia_prima } = useQuery(OBTENER_MATERIAS_PRIMAS, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_MATERIA_PRIMA);
    
    const onDeleteUsuario = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarMateriaPrima;
        if (estado) {
            Notification['success']({
                title: 'Eliminar Materia Prima',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Materia Prima',
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
        return data_materia_prima.obtenerMateriasPrimas.filter((value, index) => {
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

    if (load_materia_prima) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_materia_prima) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de materias primas, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <h3 className="text-center">Gestión de Materias Primas</h3>
            <div className="input-group mt-3 mb-3">
                <div>
                    <select id="select_modo" className="rounded-0 btn btn-outline-secondary dropdown-toggle" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                        <option value="1"> Nombre de la materia prima</option>
                        <option value="2"> Pais</option>
                    </select>
                </div>
                <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
            </div>
            <div className="mt-3">
                <DataGrid data={data} setConfirmation={setConfirmation} mostrarMsj={mostrarMsj} type="materias" displayLength={9} {...props} />
                {/* 
                <div>
                    <Table height={500} id="table" data={data}>
                        <Column width={200}>
                            <HeaderCell>Nombre</HeaderCell>
                            <NameCell dataKey='nombre' />
                        </Column>
                        <Column width={200}>
                            <HeaderCell>Lote</HeaderCell>
                            <Cell dataKey='lote' />
                        </Column>
                        <Column width={200}>
                            <HeaderCell>Código</HeaderCell>
                            <Cell dataKey='codigo' />
                        </Column>
                        <Column width={200}>
                            <HeaderCell>País de origen</HeaderCell>
                            <Cell dataKey='pais' />
                        </Column>
                        <Column width={200}>
                            <HeaderCell>Fecha de Fabricación</HeaderCell>
                            <Cell>{
                                rowData => {return (<label>{getFecha(rowData.fechaFabricacion)}</label>)}
                            }</Cell>
                        </Column>
                        <Column width={200}>
                            <HeaderCell>Fecha de Vencimiento</HeaderCell>
                            <Cell>{
                                rowData => {return (<label>{getFecha(rowData.fechaVencimiento)}</label>)}
                            }</Cell>
                        </Column>
                        <Column width={200}>
                            <HeaderCell>Proveedor</HeaderCell>
                            <Cell>{
                                rowData => { return (<label>{rowData.proveedor.empresa}</label>) }
                            }</Cell>
                        </Column>
                        <Column width={200}>
                            <HeaderCell>Existencia Real</HeaderCell>
                            <Cell dataKey='existencias' />
                        </Column>
                        <Column width={150} fixed="right">
                            <HeaderCell>Acción</HeaderCell>
                            <Cell>
                                {rowData => {
                                    return (
                                        <>
                                            <div className="d-inline-block mx-2">
                                                <Link to={`materias_primas/editar/${rowData.id}`}><Action tooltip="Editar Materia Prima" color="orange" icon="edit" size="xs" /></Link>
                                            </div>
                                            <div className="d-inline-block mx-2">
                                                <Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: rowData.id }) : mostrarMsj() }} tooltip="Eliminar Materia Prima" color="red" icon="trash" size="xs" />
                                            </div>
                                            <div className="d-inline-block mx-2">
                                                <Link to={`materias_primas/movimientos/${rowData.id}`}><Action tooltip="Ver movimientos" color="blue" icon="eye" size="xs" /></Link>
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
                    total={data_materia_prima.obtenerMateriasPrimas.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                />
                */}
            </div>
            <div className="d-flex justify-content-start">
                <Link to={`/materias_primas/nuevo`}><Boton tooltip="Nueva Materia Prima" name="Nuevo" icon="plus" color="green" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(MateriaPrima);