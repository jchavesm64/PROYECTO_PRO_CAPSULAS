import React, { useState } from 'react'
import { Notification, SelectPicker, Loader } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { SAVE_MATERIA_PRIMA } from '../../services/MateriaPrimaService'
import { OBTENER_PROVEEDORES } from '../../services/ProveedorService'
import { countries } from '../../Json/countries.json'

const NuevaMateriaPrima = ({ ...props }) => {
    const [nombre, setNombre] = useState('');
    const [lote, setLote] = useState('');
    const [fabricacion, setFabricacion] = useState('');
    const [vencimiento, setVencimiento] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [pais, setPais] = useState('');
    const [codigo, setCodigo] = useState('');
    const [insertar] = useMutation(SAVE_MATERIA_PRIMA);
    const { loading: load_prov, data: data_prov } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 });

    const getPaises = () => {
        const paises = []
        countries.map(p => {
            paises.push({
                "label": p.name,
                "value": p
            })
        });
        return paises;
    }

    const getProveedores = () => {
        const datos = []
        if (data_prov.obtenerProveedores) {
            data_prov.obtenerProveedores.map(item => {
                datos.push({
                    "value": item.id,
                    "label": item.empresa
                })
            });
        }
        return datos
    }

    const onSaveMateriaPrima = async () => {
        var date_fab = new Date(fabricacion)
        date_fab.setDate(date_fab.getDate() + 1)
        var date_ven = new Date(vencimiento)
        date_ven.setDate(date_ven.getDate() + 1)
        if (date_ven <= date_fab) {
            Notification['warning']({
                title: 'Insertar Materia Primas',
                duration: 5000,
                description: "Las fechas dadas no son validas"
            })
        } else {
            try {
                const input = {
                    nombre,
                    lote,
                    fechaFabricacion: date_fab,
                    fechaVencimiento: date_ven,
                    proveedor,
                    pais: pais.name,
                    codigo,
                    existencias: 0,
                    estado: 'ACTIVO'
                }
                console.log(input)
                const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
                const { estado, message } = data.insertarMateriaPrima;
                if (estado) {
                    Notification['success']({
                        title: 'Insertar Materia Prima',
                        duration: 5000,
                        description: message
                    })
                    props.history.push(`/materias_primas`);
                } else {
                    Notification['error']({
                        title: 'Insertar Materia Prima',
                        duration: 5000,
                        description: message
                    })
                }
            } catch (error) {
                console.log(error)
                Notification['error']({
                    title: 'Insertar Materia Prima',
                    duration: 5000,
                    description: "Hubo un error inesperado al guardar la materia prima"
                })
            }
        }

    }

    const validarForm = () => {
        return !nombre || !lote || !fabricacion || !vencimiento || !proveedor || !pais || !codigo;
    }

    if (load_prov) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/materias_primas`)} icon="arrow-left-line" tooltip="Ir a Materias Primas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Registro de Materias Primas</h3>
            <div className="row mt-3 mb-3">
                <div className="col-md-4 float-left">
                    <h6>Lote</h6>
                    <input className="form-control mt-2" type="text" placeholder="Lote" value={lote} onChange={(e) => setLote(e.target.value)} />
                </div>
                <div className="justify-content-end col-md-8 float-right">
                    <h6>Código de la Materia Prima</h6>
                    <input className="form-control mt-2" type="text" placeholder="Código de la Materia Prima" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                </div>
            </div>
            <h6>Nombre de la Materia Prima</h6>
            <input className="form-control mt-2" type="text" placeholder="Nombre de la Materia Prima" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <div className="row mt-3">
                <div className="col-md-6 float-left">
                    <h6>Fecha de Fabricación</h6>
                    <input className="form-control mt-2" type="date" placeholder="Fecha de Fabricación" value={fabricacion} onChange={(e) => setFabricacion(e.target.value)} />
                </div>
                <div className="justify-content-end col-md-6 float-right">
                    <h6>Fecha de Vencimiento</h6>
                    <input className="form-control mt-2" type="date" placeholder="Fecha de Vencimiento" value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} />
                </div>
            </div>
            <div className="row mt-3 mb-3">
                <div className="col-md-4 float-left">
                    <h6>País de Origen</h6>
                    <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="País de Origen" data={getPaises()} onChange={(e) => setPais(e)} searchable={true} />
                </div>
                <div className="justify-content-end col-md-8 float-right">
                    <h6>Proveedor</h6>
                    <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Proveedor" data={getProveedores()} onChange={(e) => setProveedor(e)} searchable={true} />
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveMateriaPrima} tooltip="Guardar Proveedor" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(NuevaMateriaPrima)