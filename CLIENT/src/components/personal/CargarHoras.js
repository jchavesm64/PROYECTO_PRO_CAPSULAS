import React, { useState } from 'react'
import { Loader, Notification, IconButton, Icon } from 'rsuite';
import { withRouter } from 'react-router'
import Label from '../shared/Label';
import readXlsxFile from 'read-excel-file';
import Table from '../shared/Table';

const CargarHoras = ({ ...props }) => {
    const [cargando, setCargando] = useState(false)
    const [datos, setDatos] = useState({ fecha: null, planta: [], administrativos: [], produccion: [], procesado: false })
    const key = ['PLANILLA OPERATIVA', 'PRODUCCION DE CAPSULAS', 'PLANILLA ADMINISTRATIVA', 'TOTAL PLANILLA OPERATIVA', 'TOTAL DE SALARIOS']

    const guardarExcel = (data) => {
        console.log(data)
    }

    const eliminarFilasNulas = (data) => {
        const newData = []
        let aux = null, vector = null, null_cont = 0;
        for (let a = 0; a < data.length; a++) {
            aux = data[a];
            vector = [];
            null_cont = 0;
            for (let b = 0; b < aux.length; b++) {
                if (aux[b] === null) {
                    null_cont++;
                }
                vector.push(aux[b])
            }
            if (null_cont < aux.length) {
                newData.push(vector)
            }
        }
        return newData
    }

    const encontrarFecha = (data) => {
        let aux = null, fecha = null
        for (let i = 0; i < data.length; i++) {
            aux = data[i];
            for (let j = 0; j < aux.length; j++) {
                if (aux[j] !== null) {
                    if (aux[j].toString().toUpperCase() === 'FECHA' || aux[j].toString().toUpperCase() === 'FECHA:') {
                        fecha = aux[j + 1]
                    }
                }
            }
        }
        return fecha
    }

    const encontrarClaves = (clave, data) => {
        console.log(key)
        const info = []
        let fila = null, aux = null, vector = null, salto = false;
        for (let i = 0; i < data.length; i++) {
            aux = data[i];
            for (let j = 0; j < aux.length; j++) {
                if (aux[j] !== null) {
                    if (aux[j].toString().toUpperCase() === clave) {
                        fila = i + 1;
                    }
                }
            }
        }
        if (fila !== null) {
            for (let i = fila; i < data.length; i++) {
                if (salto) {
                    break
                }
                aux = data[i];
                vector = []
                for (let j = 0; j < aux.length; j++) {
                    if (aux[j] !== key[0] && aux[j] !== key[1] && aux[j] !== key[2] && aux[j] !== key[3] && aux[j] !== key[4]) {
                        aux[j] === null ? vector.push('-') : vector.push(aux[j])
                    } else {
                        salto = true
                        break
                    }
                }
                if (vector.length > 0) {
                    info.push(vector)
                }
            }
        }
        return info
    }

    const procesarDatos = (data) => {
        data = eliminarFilasNulas(data)
        const info = { fecha: null, planta: [], administrativos: [], produccion: [], procesado: true }
        info.fecha = encontrarFecha(data)
        info.planta = encontrarClaves(key[0], data)
        info.produccion = encontrarClaves(key[1], data)
        info.administrativos = encontrarClaves(key[2], data)
        console.log(info)
        setDatos(info)
    }

    const ReadFile = (e) => {
        setCargando(true)
        try {
            let files = e.target.files, file = files[0];
            const isValid = (file.type === '.csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel');
            if (isValid) {
                readXlsxFile(file).then((rows) => {
                    if (rows !== undefined) {
                        procesarDatos(rows);
                    } else {
                        Notification['error']({
                            title: 'Error',
                            duration: 20000,
                            description: 'Excel no valido, verifique que contenga la información necesaria.'
                        })
                    }
                });
            } else {
                Notification['error']({
                    title: 'Error',
                    duration: 20000,
                    description: 'Archivo no valido, solo se permite archivos de tipo excel.'
                })
            }
        } catch (error) {
            Notification['error']({
                title: 'Error',
                duration: 20000,
                description: 'Ocurrio un error inesperado'
            })
        } finally {
            setCargando(false)
        }

    }

    const getTitles = (data) => {
        const titles = []
        data.map(t => {
            titles.push({
                title: t,
                class: ""
            })
        })
        return titles
    }

    const RowData = ({ data }) => {
        return (
            <tr>
                {
                    data.map(i => {
                        return (<td>{i}</td>)
                    })
                }
            </tr>
        )
    }

    const getData = (data) => {
        data.splice(0, 1)
        return data
    }

    if (cargando) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    console.log(datos)

    return (
        <div className='mx-auto'>
            <h3 className='text-center'>Cargar Horas del Personal</h3>
            <hr />
            {
                datos.procesado &&
                <>
                    <div>
                        <h5>Fecha</h5>
                        <Label icon="fas fa-calendar" value={datos.fecha} />
                    </div>
                    {
                        (datos.planta.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Planilla Operativa</h5>
                            <Table Title={getTitles(datos.planta[0])} Rows={RowData} info={getData(datos.planta)} />
                        </div>
                    }
                    {
                        (datos.produccion.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Producción de Cápsulas</h5>
                            <Table Title={getTitles(datos.produccion[0])} Rows={RowData} info={getData(datos.produccion)} />
                        </div>
                    }
                    {
                        (datos.administrativos.length !== 0) &&
                        <div>
                            <h5 className="text-center my-2">Planilla Administrativa</h5>
                            <Table Title={getTitles(datos.administrativos[0])} Rows={RowData} info={getData(datos.administrativos)} />
                        </div>
                    }
                </>
            }
            <div className='mt-3'>
                <IconButton icon={<Icon icon="fas fa-file-excel" />} placement="left" color="green" size="sm">
                    <label htmlFor="file-choser" size="sm">
                        Cargar Excel
                        <input id="file-choser" type="file" style={{ display: "none" }} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => { ReadFile(event) }} size="sm" />
                    </label>
                </IconButton>
            </div>
        </div>
    )
}

export default withRouter(CargarHoras)