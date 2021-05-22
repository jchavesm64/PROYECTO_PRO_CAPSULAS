import React, { useState } from 'react';
import { Table } from 'rsuite';
import Action from '../shared/Action';
const { Column, HeaderCell, Cell, Pagination } = Table;

const List = (props) => {

    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);

    const handleChangePage = (dataKey) => {
        setPage(dataKey)
    }

    const handleChangeLength = (dataKey) => {
        setPage(1);
        setDisplayLength(dataKey);
    }

    const { data, actions } = props;
    return (
        <div>
            <Table className="mx-auto w-75" height={250} data={data}>
                {actions ?
                    (
                        <Column width={300}>
                            <HeaderCell style={{ background: '#0CA3AE', color: 'white' }}>{props.header}</HeaderCell>
                            <Cell dataKey={props.clave} />
                        </Column>
                    ) : (
                        <Column flexGrow={1}>
                            <HeaderCell style={{ background: '#0CA3AE', color: 'white' }}>{props.header}</HeaderCell>
                            <Cell dataKey={props.clave} />
                        </Column>
                    )
                }
                {actions &&
                    <Column width={75} fixed="right">
                        <HeaderCell style={{ background: '#0CA3AE', color: 'white' }}>Acciones</HeaderCell>
                        <Cell>
                            {rowData => {
                                return (
                                    <>
                                        <div className="d-inline-block">
                                            <Action tooltip="Editar dato" color="orange" icon="edit" size="xs" />
                                        </div>
                                        <div className="d-inline-block">
                                            <Action tooltip="Eliminar dato" color="red" icon="trash" size="xs" />
                                        </div>
                                    </>
                                );
                            }}
                        </Cell>
                    </Column>
                }
            </Table>
            { data.length > 5 &&
                < Pagination className="w-75"
                    first={false}
                    last={false}
                    next={false}
                    prev={false}
                    showInfo={false}
                    showLengthMenu={false}
                    activePage={page}
                    displayLength={displayLength}
                    total={data.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                />
            }
        </div>
    );

}

export default List;