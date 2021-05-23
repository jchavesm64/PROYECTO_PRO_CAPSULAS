import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Boton from '../../shared/Boton';
import Action from '../../shared/Action';
import {
    Table,
    Loader,
    Notification,
} from 'rsuite';
import Confirmation from '../../shared/Confirmation';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
    OBTENER_TIPO_PRODUCTOS,
    SAVE_TIPO_PRODUCTOS,
    UPDATE_TIPO_PRODUCTOS,
    DELETE_TIPO_PRODUCTOS
} from '../../../services/TipoProductoService';
const { Column, HeaderCell, Cell, Pagination } = Table;

const TipoProductos = ({ ...props }) => {
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [confimation, setConfirmation] = useState(false);
    const [filter, setFilter] = useState('');
    const [nuevo, setNuevo] = useState(false);
    const [editar, setEditar] = useState(false);
    const [tipo, setTipo] = useState(null);
    const { loading, error, data: tipos } = useQuery(OBTENER_TIPO_PRODUCTOS, { pollInterval: 1000 });
    const [insertar] = useMutation(SAVE_TIPO_PRODUCTOS);
    const [actualizar] = useMutation(UPDATE_TIPO_PRODUCTOS);
    const [desactivar] = useMutation(DELETE_TIPO_PRODUCTOS);

    const handleChangePage = (dataKey) => {
        setPage(dataKey)
    }

    const handleChangeLength = (dataKey) => {
        setPage(1);
        setDisplayLength(dataKey);
    }

    const onDeletObjeto = async (id) => {
        const res = await desactivar({ variables: { id } });
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Estás seguro/a de eliminar?"
            onDeletObjeto={onDeletObjeto}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    const getData = () => {
        return tipos.obtenerTipoProductos.filter((value, index) => {
            if (filter !== "") {
                return getFilteredByKey(value, filter);
            }
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return index >= start && index < end;
        });
    }

    function getFilteredByKey(value, key) {
        const val = value.nombre.toLowerCase();
        const val2 = key.toLowerCase();
        if (val.includes(val2)) {
            return key
        }
    }

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de tipos de producto, verificar tu conexión a internet'
        })
    }

    console.log(props, localStorage)
    const data = getData();

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config`)} icon="arrow-left-line" tooltip="Ir a comisiones" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Gestion de Tipos de Productos</h3>
            <div className="input-group mt-3 mb-3">
                <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
            </div>
            <div className="mt-3">
                <div>
                    <Table height={500} data={data}>
                        <Column width={500} flexGrow={1}>
                            <HeaderCell>Tipo de Producto</HeaderCell>
                            <Cell dataKey='tipo' />
                        </Column>
                        <Column width={150} fixed="right">
                            <HeaderCell>Acciones</HeaderCell>
                            <Cell>
                                {
                                    rowData => {
                                        return (
                                            <>
                                                <div className="d-inline-block mx-2">
                                                    <Action tooltip="Editar" icon="edit" color="orange" onClick={() => setEditar({ dato: rowData, estado: true })} size="xs" />
                                                </div>
                                                <div className="d-inline-block">
                                                    <Action tooltip="Eliminar" icon="trash" color="red" onClick={() => setConfirmation({ bool: true, id: rowData.id })} size="xs" />
                                                </div>
                                            </>
                                        );
                                    }
                                }
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
                    total={tipos.obtenerTipoProductos.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                />
            </div>
            <div className="d-flex justify-content-start">
            <Boton name="Nuevo" tooltip="Nuevo Tipo de Producto" color="green" icon="plus" size="sm" position="end" onClick={() => setNuevo(true)} />
            </div>
        </>
    );
}

export default withRouter(TipoProductos);