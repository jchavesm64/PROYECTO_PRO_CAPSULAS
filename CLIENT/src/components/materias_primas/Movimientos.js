import React, { useState } from 'react'
import { Table, Loader, Notification } from 'rsuite';
import { useQuery } from "@apollo/react-hooks";
import { OBTENER_MOVIMIENTOS } from '../../services/MovimientosService'
import Boton from '../shared/Boton'
import Action from '../shared/Action'
import { withRouter } from 'react-router';
const { Column, HeaderCell, Cell, Pagination } = Table;

const Movimientos = ({ ...props }) => {

    const { id } = props.match.params;

    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const { loading: load_movimiento, error: error_movimiento, data: data_movimiento } = useQuery(OBTENER_MOVIMIENTOS, { variables: { id: id }, pollInterval: 1000 })

    const handleChangePage = (dataKey) => {
        setPage(dataKey)
    }

    const handleChangeLength = (dataKey) => {
        setPage(1);
        setDisplayLength(dataKey);
    }

    function getFilteredByKey(modo, key, value) {
        if (modo === "1") {
            const val = key.tipo.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        } else if (modo === "2") {
            const val = key.usuario.nombre.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const getData = () => {
        return data_movimiento.obtenerMovimientos.filter((value, index) => {
            if (filter !== "" && modo !== "") {
                return getFilteredByKey(modo, value, filter);
            }
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return index >= start && index < end;
        });
    }

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return date.getFullYear() + ' / ' + mes + ' / ' + day;
    }

    if (load_movimiento) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_movimiento) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de movimientos, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/materias_primas`)} icon="arrow-left-line" tooltip="Ir a Materias Primas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Movimientos de Materia Prima</h3>
            { data_movimiento.obtenerMovimientos.length > 0 &&
                <>
                    <h5 className="text-center">{data[0].materia_prima.nombre}</h5>
                    <div className="input-group mt-3 mb-3">
                        <div>
                            <select id="select_modo" className="rounded-0 btn btn-outline-secondary dropdown-toggle" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                                <option value="1"> Tipo de Entrada</option>
                                <option value="2"> Nombre del Usuario</option>
                            </select>
                        </div>
                        <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                        <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
                    </div>
                    <div>
                        <Table height={500} id="table" data={data}>
                            <Column width={200}>
                                <HeaderCell>Tipo de Movimiento</HeaderCell>
                                <Cell dataKey='tipo' />
                            </Column>
                            <Column width={200}>
                                <HeaderCell>Fecha de Registro</HeaderCell>
                                <Cell>{
                                    rowData => { return (<label>{getFecha(rowData.fecha)}</label>) }
                                }</Cell>
                            </Column>
                            <Column width={200}>
                                <HeaderCell>Cantidad</HeaderCell>
                                <Cell dataKey='cantidad' />
                            </Column>
                            <Column width={200}>
                                <HeaderCell>Unidad</HeaderCell>
                                <Cell dataKey='unidad' />
                            </Column>
                            <Column width={200}>
                                <HeaderCell>Precio</HeaderCell>
                                <Cell dataKey='precio' />
                            </Column>
                            <Column width={200}>
                                <HeaderCell>Precio por Unidad</HeaderCell>
                                <Cell dataKey='precio_unidad' />
                            </Column>
                            <Column width={200}>
                                <HeaderCell>Registrado por</HeaderCell>
                                <Cell>{
                                    rowData => { return (<label>{rowData.usuario.nombre}</label>) }
                                }</Cell>
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
                        total={data_movimiento.obtenerMovimientos.length}
                        onChangePage={handleChangePage}
                        onChangeLength={handleChangeLength}
                    />
                </>
            }
            {data_movimiento.obtenerMovimientos.length === 0 &&
                <>
                    <hr/>
                    <h4 className="text-center">No existe movimientos</h4>
                </>
            }
        </>
    );
}

export default withRouter(Movimientos);