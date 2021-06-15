import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/react-hooks";
import { countries } from '../../Json/countries.json'
import { UPDATE_MATERIA_PRIMA } from '../../services/MateriaPrimaService'
import List from '../shared/List'
import { Notification, SelectPicker, Loader } from 'rsuite'
import Boton from '../shared/Boton'
import Action from '../shared/Action'
import { withRouter } from 'react-router';
import { OBTENER_PROVEEDORES } from '../../services/ProveedorService'

const FormularioMateriaPrima = ({ props, materia }) => {
    const getPais = (pais) => {
        var country = null
        countries.map(p => {
            if (p.name === pais) {
                country = p
            }
        })
        return country;
    }

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return date.getFullYear() + '-' + mes + '-' + day;

    }

    const [nombre, setNombre] = useState(materia.nombre);
    const [lote, setLote] = useState(materia.lote);
    const [fabricacion, setFabricacion] = useState(getFecha(materia.fechaFabricacion));
    const [vencimiento, setVencimiento] = useState(getFecha(materia.fechaVencimiento));
    const [proveedor, setProveedor] = useState(materia.proveedor.id);
    const [pais, setPais] = useState(getPais(materia.pais));
    const [codigo, setCodigo] = useState(materia.codigo);
    const [actualizar] = useMutation(UPDATE_MATERIA_PRIMA);
    const { loading: load_prov, data: data_prov } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 });

    React.useEffect(() => {
        setNombre(materia.nombre)
        setLote(materia.lote)
        setFabricacion(getFecha(materia.fechaFabricacion))
        setVencimiento(getFecha(materia.fechaVencimiento))
        setProveedor(materia.proveedor.id)
        setPais(getPais(materia.pais))
        setCodigo(materia.codigo)
    }, [materia])

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
        try {
            const input = {
                nombre,
                lote,
                fechaFabricacion: materia.fechaFabricacion,
                fechaVencimiento: materia.fechaVencimiento,
                proveedor,
                pais: pais.name,
                codigo,
                existencias: materia.existencias,
                estado: 'ACTIVO'
            }
            console.log(input)
            const { data } = await actualizar({ variables: { id: materia.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarMateriaPrima;
            if (estado) {
                Notification['success']({
                    title: 'Actualizar Materia Prima',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/materias_primas`);
            } else {
                Notification['error']({
                    title: 'Actualizar Materia Prima',
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

    const validarForm = () => {
        return !nombre || !lote || !fabricacion || !vencimiento || !proveedor || !pais || !codigo;
    }

    if (load_prov) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/materias_primas`)} icon="arrow-left-line" tooltip="Ir a Materias Primas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Editar Materia Prima</h3>
            <div className="row mt-3 mb-3">
                <div className="col-md-4 float-left">
                    <h6>Lote</h6>
                    <input className="form-control mt-2" type="text" placeholder="Lote" value={lote} onChange={(e) => setLote(e.target.value)} disabled />
                </div>
                <div className="justify-content-end col-md-8 float-right">
                    <h6>Código de la Materia Prima</h6>
                    <input className="form-control mt-2" type="text" placeholder="Código de la Materia Prima" value={codigo} onChange={(e) => setCodigo(e.target.value)} disabled />
                </div>
            </div>
            <h6>Nombre de la Materia Prima</h6>
            <input className="form-control mt-2" type="text" placeholder="Nombre de la Materia Prima" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <div className="row mt-3">
                <div className="col-md-6 float-left">
                    <h6>Fecha de Fabricación</h6>
                    <input className="form-control mt-2" type="date" placeholder="Fecha de Fabricación" value={fabricacion} onChange={(e) => setFabricacion(e.target.value)} disabled />
                </div>
                <div className="justify-content-end col-md-6 float-right">
                    <h6>Fecha de Vencimiento</h6>
                    <input className="form-control mt-2" type="date" placeholder="Fecha de Vencimiento" value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} disabled />
                </div>
            </div>
            <div className="row mt-3 mb-3">
                <div className="col-md-4 float-left">
                    <h6>País de Origen</h6>
                    <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="País de Origen" value={pais} data={getPaises()} onChange={(e) => setPais(e)} searchable={true} />
                </div>
                <div className="justify-content-end col-md-8 float-right">
                    <h6>Proveedor</h6>
                    <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Proveedor" value={proveedor} data={getProveedores()} onChange={(e) => setProveedor(e)} searchable={true} />
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveMateriaPrima} tooltip="Guardar Proveedor" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    );
}

export default withRouter(FormularioMateriaPrima);