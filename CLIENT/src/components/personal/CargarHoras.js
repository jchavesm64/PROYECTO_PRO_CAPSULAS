/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Loader, Notification, IconButton, Icon, Input } from 'rsuite';
import { withRouter } from 'react-router'
import Label from '../shared/Label';
import readXlsxFile from 'read-excel-file';
import Table from '../shared/Table';
import Boton from '../shared/Boton';
import { SAVE_HORAS } from '../../services/HorasService';
import { useMutation } from "@apollo/react-hooks";

const CargarHoras = ({ ...props }) => {

    const meses = {
        'ENERO': 0,
        'FEBRERO': 1,
        'MARZO': 2,
        'ABRIL': 3,
        'MAYO': 4,
        'JUNIO': 5,
        'JULIO': 6,
        'AGOSTO': 7,
        'SEPTIEMBRE': 8,
        'OCTUBRE': 9,
        'NOVIEMBRE': 10,
        'DICIEMBRE': 11
    }

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate()) : date.getDate();
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return date.getFullYear() + '-' + mes + '-' + day;
    }

    const crearFecha = (dato) => {
        let fecha1 = dato
        let array1 = fecha1.split(' ')
        const array2 = []
        array1.map(i => {
            if (i !== 'DE' && i !== 'DEL') {
                array2.push(i)
            }
        })
        if (array2.length === 3) {
            if (!isNaN(array2[0]) && isNaN(array2[1]) && !isNaN(array2[2])) {
                let dia = array2[0]
                let mes = meses[array2[1]]
                let anho = array2[2]
                let correcto = false
                if (mes === 1) {
                    correcto = (anho % 4 === 0) ? (dia >= 1 && dia <= 29) : (dia >= 1 && dia <= 28)
                } else if (mes === 3 || mes === 5 || mes === 8 || mes === 10) {
                    correcto = (dia >= 1 && dia <= 30)
                } else {
                    correcto = (dia >= 1 && dia <= 31)
                }
                if (correcto) {
                    return getFecha(new Date(anho, mes, dia))
                } else {
                    Notification["error"]({
                        title: "Detectar Fecha",
                        duration: 10000,
                        description: "Error al detectar la fecha",
                    });
                }
            } else {
                Notification["error"]({
                    title: "Detectar Fecha",
                    duration: 10000,
                    description: "Error al detectar la fecha",
                });
            }
        } else {
            Notification["error"]({
                title: "Detectar Fecha",
                duration: 10000,
                description: "Error al detectar la fecha",
            });
        }
        return new Date()
    }

    const [cargando, setCargando] = useState(false)
    const [datos, setDatos] = useState({ fecha: null, planta: [], administrativos: [], produccion: [], procesado: false })
    const [fecha, setFecha] = useState('')
    const [insertar] = useMutation(SAVE_HORAS);
    const key = ['PLANILLA OPERATIVA', 'PRODUCCION DE CAPSULAS', 'PLANILLA ADMINISTRATIVA', 'TOTAL PLANILLA OPERATIVA', 'TOTAL DE SALARIOS']

    const guardarExcel = async () => {
        const h = []
        let aux = datos.planta[0], aux2 = null, cedula = 0, horas = 0, monto = 0, detalle = 0
        if (datos.planta.length > 0) {
            for (let i = 0; i < aux.length; i++) {
                if (aux[i].toString().toUpperCase() === 'CÉDULA') {
                    cedula = i
                }
                if (aux[i].toString().toUpperCase() === 'HORAS') {
                    horas = i
                }
                if (aux[i].toString().toUpperCase() === 'PRECIO HORA') {
                    monto = i
                }
                if (aux[i].toString().toUpperCase() === 'DETALLE') {
                    detalle = i
                }
            }
            const planta = datos.planta
            for (let i = 1; i < planta.length; i++) {
                aux2 = planta[i]
                h.push({
                    empleado: aux2[cedula].replace(/-/g, ""),
                    horas: aux2[horas],
                    costo_hora: aux2[monto],
                    detalle: aux2[detalle],
                    tipo: 'P',
                    fecha: fecha
                })
            }
        }
        if (datos.produccion.length > 0) {
            aux = datos.produccion[0]
            for (let i = 0; i < aux.length; i++) {
                if (aux[i].toString().toUpperCase() === 'CÉDULA') {
                    cedula = i
                }
                if (aux[i].toString().toUpperCase() === 'HORAS') {
                    horas = i
                }
                if (aux[i].toString().toUpperCase() === 'PRECIO HORA') {
                    monto = i
                }
                if (aux[i].toString().toUpperCase() === 'DETALLE') {
                    detalle = i
                }
            }
            const produccion = datos.produccion
            for (let i = 1; i < produccion.length; i++) {
                aux2 = produccion[i]
                h.push({
                    empleado: aux2[cedula].replace(/-/g, ""),
                    horas: aux2[horas],
                    costo_hora: aux2[monto],
                    detalle: aux2[detalle],
                    tipo: 'C',
                    fecha: fecha
                })
            }
        }
        if (datos.administrativos.length > 0) {
            aux = datos.administrativos[0]
            for (let i = 0; i < aux.length; i++) {
                if (aux[i].toString().toUpperCase() === 'CÉDULA') {
                    cedula = i
                }
                if (aux[i].toString().toUpperCase() === 'HORAS') {
                    horas = i
                }
                if (aux[i].toString().toUpperCase() === 'DETALLE') {
                    detalle = i
                }
            }
            const admin = datos.administrativos
            for (let i = 1; i < admin.length; i++) {
                aux2 = admin[i]
                h.push({
                    empleado: aux2[cedula].replace(/-/g, ""),
                    horas: aux2[horas],
                    costo_hora: 0,
                    detalle: aux2[detalle],
                    tipo: 'A',
                    fecha: fecha
                })
            }
        }
        setCargando(true)
        const input = { horas: h }
        console.log(input)
        const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
        console.log(data)
        const { estado, message } = data.saveHoras;
        if (estado) {
            Notification['success']({
                title: 'Insertar Horas',
                duration: 5000,
                description: message
            })
            props.history.push(`/personal`);
        } else {
            Notification['error']({
                title: 'Insertar Horas',
                duration: 5000,
                description: message
            })
        }
        setCargando(false)
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
        setDatos(info)
        setFecha(crearFecha(info.fecha))
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
        let newData = data.slice()
        newData.splice(0, 1)
        return newData
    }

    if (cargando) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <div className='mx-auto'>
            <h3 className='text-center'>Cargar Horas del Personal</h3>
            <hr />
            {
                datos.procesado &&
                <>
                    <div className='row'>
                        <div className='col-md-6'>
                            <h5>Fecha Detectada</h5>
                            <Label icon="fas fa-calendar" value={datos.fecha} />
                        </div>
                        <div className='col-md-6'>
                            <h5>Fecha</h5>
                            <Input type="date" placeholder="Fecha" value={fecha} onChange={(e) => setFecha(e)} />
                        </div>
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
                {
                    !datos.procesado ? (
                        <IconButton icon={<Icon icon="fas fa-file-excel" />} placement="left" color="green" size="sm">
                            <label htmlFor="file-choser" size="sm">
                                Cargar Excel
                                <input id="file-choser" type="file" style={{ display: "none" }} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => { ReadFile(event) }} size="sm" />
                            </label>
                        </IconButton>
                    ) : (
                        <Boton onClick={guardarExcel} tooltip="Guardar Información" name="Guardar Información" icon="save" color="green" disabled={!fecha} />
                    )
                }
            </div>
        </div>
    )
}

export default withRouter(CargarHoras)