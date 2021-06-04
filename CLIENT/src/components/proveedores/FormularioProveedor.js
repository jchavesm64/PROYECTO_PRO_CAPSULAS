import React, { useState } from 'react'
import { Notification, SelectPicker, InputGroup, Icon, TagPicker, Loader } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { UPDATE_PROVEEDOR } from '../../services/ProveedorService'
import { OBTENER_TIPO_PROVEDURIA } from '../../services/TipoProveduriaService'
import { countries } from '../../Json/countries.json'
import { states } from '../../Json/states.json'
import List from '../shared/List'
import Action from '../shared/Action'

const FormularioProveedor = ({ props, proveedor, uso }) => {

    const getPais = (pais) => {
        var country = null
        countries.map(p => {
            if (p.name === pais) {
                country = p
            }
        })
        return country;
    }

    const getCiudad = (ciudad) => {
        var city = null
        states.map(c => {
            if (c.name === ciudad) {
                city = c
            }
        })
        return city;
    }

    const getSelectedProvedurias = () => {
        const datos = [];
        proveedor.provedurias.map(item => {
            datos.push(item.id);
        })
        return datos;
    }

    const [nombre, setNombre] = useState(proveedor.empresa);
    const [cedula, setCedula] = useState(proveedor.cedula);
    const [pais, setPais] = useState(getPais(proveedor.pais));
    const [ciudad, setCiudad] = useState(getCiudad(proveedor.ciudad));
    const [direccion, setDireccion] = useState(proveedor.direccion);
    const [telefonos, setTelefonos] = useState(proveedor.telefonos);
    const [correos, setCorreos] = useState(proveedor.correos);
    const [provedurias, setProvedurias] = useState(getSelectedProvedurias())
    const [refrescar, setRefrescar] = useState(false);
    const [actualizar] = useMutation(UPDATE_PROVEEDOR);
    const { loading: load_provedurias, data: data_provedurias } = useQuery(OBTENER_TIPO_PROVEDURIA, { pollInterval: 1000 })
    const [datos, setDatos] = useState(true);
    const [contacto, setContacto] = useState(false);
    const [ubicacion, setUbicacion] = useState(false);
    const [prov, setProv] = useState(false)

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

    const getCiudades = () => {
        if (pais !== null) {
            const ciudades = [];
            states.map(c => {
                if (c.id_country === pais.id) {
                    ciudades.push({
                        "label": c.name,
                        "value": c
                    })
                }
            })
            return ciudades;
        }
        return []
    }

    const agregarTelefono = (telefono) => {
        var band = false;
        telefonos.map(t => {
            if (t.telefono === telefono) {
                band = true;
            }
        })
        if (!band) {
            telefonos.push({
                "telefono": telefono
            })
            document.getElementById('telefono').value = "";
            setRefrescar(!refrescar);
        } else {
            Notification['info']({
                title: 'Agregar Telefono',
                duration: 5000,
                description: "Ya está agregado el telefono"
            })
        }
    }

    const agregarCorreo = (correo) => {
        if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(correo)) {
            var band = false;
            correos.map(c => {
                if(c.email === correo){
                    band = true;
                }
            })
            if(!band){
                correos.push({
                    "email": correo
                })
                document.getElementById('correo').value = "";
                setRefrescar(!refrescar);
            }else{
                Notification['info']({
                    title: 'Agregar Correo',
                    duration: 5000,
                    description: "Ya está agregado el correo"
                })
            }
        }else{
            Notification['info']({
                title: 'Agregar Correo',
                duration: 5000,
                description: "El formato de correo no es valido"
            })
        }
    }

    const getProvedurias = () => {
        const datos = []
        if (data_provedurias.obtenerTipoProveduria) {
            data_provedurias.obtenerTipoProveduria.map(item => {
                datos.push({
                    "value": item.id,
                    "label": item.tipo.toString()
                });
            });
        }
        return datos;
    }

    const validarForm = () => {
        return !nombre || !cedula || !pais || !ciudad || !direccion || telefonos.length === 0 || correos.length === 0 || provedurias.length === 0;
    }

    const onSaveCliente = async () => {
        try {
            const input = {
                empresa: nombre,
                cedula,
                pais: pais.name,
                ciudad: ciudad.name,
                direccion,
                telefonos,
                correos,
                provedurias,
                estado: "ACTIVO"
            }
            const { data } = await actualizar({ variables: { id: proveedor.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarProveedor;
            if (estado) {
                Notification['success']({
                    title: 'Insertar Proveedor',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/proveedores`);
            } else {
                Notification['error']({
                    title: 'Insertar Proveedor',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Insertar Proveedor',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el Proveedor"
            })
        }
    }

    if (load_provedurias) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/proveedores`)} icon="arrow-left-line" tooltip="Ir a proveedores" size="xs" color="blue" />
            </div>
            <h3 className="text-center">{uso ? "Detalles del Proveedor" : "Registrar Proveedor"}</h3>
            <div>
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5>Datos del Proveedor</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setDatos(!datos) }} tooltip={datos ? "Ocultar" : "Mostrar"} color={"cyan"} icon={datos ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {datos &&
                    <>
                        <input className="form-control mt-2" type="text" placeholder="Número de identificación de la empresa" value={cedula} onChange={(e) => setCedula(e.target.value)} />
                        <input className="form-control mt-2" type="text" placeholder="Nombre de la empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </>
                }
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5>Contacto del Proveedor</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setContacto(!contacto) }} tooltip={contacto ? "Ocultar" : "Mostrar"} color={"cyan"} icon={contacto ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {contacto &&
                    <div className="row mt-2">
                        <div className="w-50 d-inline-block">
                            <List estilos="w-90 mx-auto" data={telefonos} clave="telefono" header="Teleonos" edit={false} borrar={true}  setRefrescar={setRefrescar}/>
                            <div className="input-group mt-2 mb-3 w-90 mx-auto">
                                <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                                    <InputGroup.Addon>
                                        <Icon icon="phone" />
                                    </InputGroup.Addon>
                                    <input id="telefono" type="number" placeholder="Numero de telefono" className="rounded-0 form-control" />
                                    <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarTelefono(document.getElementById('telefono').value)} tooltip="Agregar Telefono" />
                                </InputGroup>
                            </div>
                        </div>
                        <div className="w-50 d-inline-block">
                            <List data={correos} clave="email" header="Correos" edit={false} borrar={true}  setRefrescar={setRefrescar}/>
                            <div className="input-group mt-2 w-90 mx-auto">
                                <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                                    <InputGroup.Addon>
                                        <Icon icon="at" />
                                    </InputGroup.Addon>
                                    <input id="correo" type="email" placeholder="Dirección de correo electronico" className="rounded-0 form-control" />
                                    <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarCorreo(document.getElementById('correo').value)} tooltip="Agregar Correo" />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                }
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5>Dirección del Proveedor</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setUbicacion(!ubicacion) }} tooltip={ubicacion ? "Ocultar" : "Mostrar"} color={"cyan"} icon={ubicacion ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {ubicacion &&
                    <>
                        <div className="row">
                            <div className="d-flex col-md-6 float-left w-90">
                                <SelectPicker className="mx-auto w-100 mt-2" size="md" placeholder="Paises" defaultValue={pais} data={getPaises()} onChange={(e) => setPais(e)} />
                            </div>
                            <div className="d-flex justify-content-end col-md-6 float-right w-90">
                                <SelectPicker className="mx-auto w-100 mt-2" size="md" placeholder="Provincias o Estados" defaultValue={ciudad} data={getCiudades()} onChange={(e) => setCiudad(e)} />
                            </div>
                        </div>
                        <input className="form-control mt-2" type="text" placeholder="Dirección o señas particulares" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                    </>
                }
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5>Provedurias del Proveedor</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setProv(!prov) }} tooltip={prov ? "Ocultar" : "Mostrar"} color={"cyan"} icon={prov ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {prov &&
                    <TagPicker className="my-3" data={getProvedurias()} block value={provedurias} onChange={e => setProvedurias(e)} />
                }
            </div>
            {!uso &&
                <div className="d-flex justify-content-end float-rigth mt-2">
                    <Boton onClick={onSaveCliente} tooltip="Guardar Proveedor" name="Guardar" icon="save" color="green" disabled={validarForm()} />
                </div>
            }
        </>
    );
}

export default withRouter(FormularioProveedor);