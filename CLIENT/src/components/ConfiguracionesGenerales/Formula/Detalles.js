import React from 'react'
import { Table } from 'rsuite'
import Boton from '../../shared/Boton'
import { withRouter } from 'react-router-dom'
const { Column, HeaderCell, Cell } = Table;

const DetalllesFormula = ({ props, formula }) => {

    console.log(formula)

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config/formulas`)} icon="arrow-left-line" tooltip="Ir a fórmulas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Detalles de la Fórmula</h3>
            <div className="my-2">
                <Table className="shadow-lg" minHeight={300} data={formula.elementos}>
                    <Column flexGrow={1}>
                        <HeaderCell>Materia Prima</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{rowData.materia_prima.nombre}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Porcentaje</HeaderCell>
                        <Cell dataKey="porcentaje" />
                    </Column>
                </Table>
            </div>
        </>
    )

}

export default withRouter(DetalllesFormula);