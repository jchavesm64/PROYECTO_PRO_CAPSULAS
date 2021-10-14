/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { Notification, SelectPicker, InputGroup, Icon, TagPicker, Loader, InputPicker } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { UPDATE_PROVEEDOR } from '../../services/ProveedorService'
import { OBTENER_TIPO_PROVEDURIA } from '../../services/TipoProveduriaService'
import { countries } from '../../Json/countries.json'
import { states } from '../../Json/states.json'
import List from '../shared/List'
import Action from '../shared/Action'
import ListDoble from '../shared/ListDoble'

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
    const [city, setCity] = useState(proveedor.city)
    const [calle, setCalle] = useState(proveedor.calle)
    const [cp, setCP] = useState(proveedor.cp)
    const [provedurias, setProvedurias] = useState(getSelectedProvedurias())
    const [refrescar, setRefrescar] = useState(false);
    const [actualizar] = useMutation(UPDATE_PROVEEDOR);
    const { loading: load_provedurias, data: data_provedurias } = useQuery(OBTENER_TIPO_PROVEDURIA, { pollInterval: 1000 })
    const [datos, setDatos] = useState(true);
    const [contacto, setContacto] = useState(false);
    const [ubicacion, setUbicacion] = useState(false);
    const [prov, setProv] = useState(false)
    const [code, setCode] = useState('')
    const [red, setRed] = useState('')
    const [redes, setRedes] = useState(proveedor.redes);

    useEffect(() => {
        setNombre(proveedor.empresa)
        setCedula(proveedor.cedula)
        setPais(getPais(proveedor.pais))
        setCiudad(getCiudad(proveedor.ciudad))
        setDireccion(proveedor.direccion)
        setTelefonos(proveedor.telefonos)
        setCorreos(proveedor.correos)
        setProvedurias(getSelectedProvedurias())
        setRedes(proveedor.redes)
        setCity(proveedor.city)
        setCalle(proveedor.calle)
        setCP(proveedor.cp)
    }, [proveedor])

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

    const getCodes = () => {
        const codes = []
        countries.map(c => {
            codes.push({
                "label": c.code,
                "value": c.code
            })
        })
        return codes
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
        if (pais) {
            var band = false;
            telefonos.map(t => {
                if (pais.code + ' ' + t.telefono === telefono) {
                    band = true;
                }
            })
            if (!band) {
                telefonos.push({
                    "telefono": pais.code + ' ' + telefono
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
        } else {
            Notification['info']({
                title: 'Agregar Telefono',
                duration: 5000,
                description: "No ha seleccionado un código"
            })
        }
    }

    const agregarCorreo = (correo) => {
        if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(correo)) {
            var band = false;
            correos.map(c => {
                if (c.email === correo) {
                    band = true;
                }
            })
            if (!band) {
                correos.push({
                    "email": correo
                })
                document.getElementById('correo').value = "";
                setRefrescar(!refrescar);
            } else {
                Notification['info']({
                    title: 'Agregar Correo',
                    duration: 5000,
                    description: "Ya está agregado el correo"
                })
            }
        } else {
            Notification['info']({
                title: 'Agregar Correo',
                duration: 5000,
                description: "El formato de correo no es valido"
            })
        }
    }

    const agregarRedSocial = (redsocial) => {
        if (red !== "") {
            var band = false
            redes.map(item => {
                if (item.enlace === redsocial) {
                    band = true
                }
            })
            if (!band) {
                redes.push({
                    'red': red,
                    'enlace': redsocial
                })
                setRefrescar(!refrescar);
            } else {
                Notification['info']({
                    title: 'Agregar Red Social',
                    duration: 5000,
                    description: "Ya está agregado la red social"
                })
            }
        } else {
            Notification['info']({
                title: 'Agregar Telefono',
                duration: 5000,
                description: "No ha seleccionado una red social"
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
        return !nombre || !pais || !direccion || provedurias.length === 0;
    }

    const onSaveCliente = async () => {
        try {
            const input = {
                empresa: nombre,
                cedula,
                pais: pais.name,
                ciudad: ciudad.name,
                city,
                calle,
                cp,
                direccion,
                telefonos,
                correos,
                redes,
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
                        <h6>Número de identificación de la empresa</h6>
                        <input className="form-control mt-2" type="text" placeholder="Número de identificación de la empresa" value={cedula} onChange={(e) => setCedula(e.target.value)} />
                        <h6 className="mt-3">Nombre de la empresa</h6>
                        <input className="form-control mt-2" type="text" placeholder="Nombre de la empresa" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </>
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
                            <div className="col-md-6 float-left w-90">
                                <h6>Paises</h6>
                                <SelectPicker className="mx-auto w-100 mt-2" size="md" placeholder="Paises" defaultValue={pais} data={getPaises()} onChange={(e) => setPais(e)} />
                            </div>
                            <div className="justify-content-end col-md-6 float-right w-90">
                                <h6 className>Provincia o Estado</h6>
                                <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Provincia o Estado" defaultValue={ciudad} data={getCiudades()} onChange={(e) => setCiudad(e)} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-5">
                                <h6 className="mt-3">Ciudad</h6>
                                <input className="form-control mt-3" type="text" placeholder="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <h6 className="mt-3">Calle</h6>
                                <input className="form-control mt-3" type="text" placeholder="Calle" value={calle} onChange={(e) => setCalle(e.target.value)} />
                            </div>
                            <div className="col-md-3">
                                <h6 className="mt-3">Código Postal</h6>
                                <input className="form-control mt-3" type="text" placeholder="Código Postal" value={cp} onChange={(e) => setCP(e.target.value)} />
                            </div>
                        </div>
                        <h6 className="mt-3">Dirección o señas particulares</h6>
                        <input className="form-control mt-2" type="text" placeholder="Dirección o señas particulares" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
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
                    <div>
                        <div style={{ margin: 0, padding: 0 }} className="row mt-2">
                            <div className="col-md-6 d-inline-block">
                                <List estilos="w-90 mx-auto" data={telefonos} clave="telefono" header="Teléfonos" edit={false} borrar={true} setRefrescar={setRefrescar} refrescar={refrescar}/>
                                <div className="input-group mt-2 mb-3 w-90 mx-auto">
                                    {props.uso === false &&
                                        <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                                            <InputGroup.Addon>
                                                <Icon icon="phone" />
                                            </InputGroup.Addon>
                                            <InputPicker className="h-100 rounded-0" size="md" placeholder="Area" data={getCodes()} value={pais ? pais.code : ''} searchable={true} onChange={(e) => setCode(e)} />
                                            <input id="telefono" type="number" placeholder="Numero de teléfono" className="rounded-0 form-control" />
                                            <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarTelefono(document.getElementById('telefono').value)} tooltip="Agregar Telefono" />
                                        </InputGroup>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6 d-inline-block">
                                <List data={correos} clave="email" header="Correos" edit={false} borrar={true} setRefrescar={setRefrescar} refrescar={refrescar}/>
                                <div className="input-group mt-2 w-90 mx-auto">
                                    {props.uso === false &&
                                        <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                                            <InputGroup.Addon>
                                                <Icon icon="at" />
                                            </InputGroup.Addon>
                                            <input id="correo" type="email" placeholder="Dirección de correo electronico" className="rounded-0 form-control" />
                                            <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarCorreo(document.getElementById('correo').value)} tooltip="Agregar Correo" />
                                        </InputGroup>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6 mx-auto">
                                <ListDoble data={redes} clave="red" clave2="enlace" header="Red Social" header2="Enlace" setRefrescar={setRefrescar} refrescar={refrescar} />
                                <div className="input-group mt-3 mb-3 w-90 mx-auto">
                                    {props.uso === false &&
                                        <>
                                            <InputPicker cleanable={false} className="h-100 rounded-0" size="md" placeholder="Red Social" data={[{ label: 'Facebook', value: 'Facebook' }, { label: 'Twitter', value: 'Twitter' }, { label: 'Instagram', value: 'Instagram' }]} searchable={true} onChange={(e) => setRed(e)} />
                                            <input id="enlace" type="text" placeholder="Enlace a la red social" className="rounded-0 form-control" />
                                            <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarRedSocial(document.getElementById('enlace').value)} tooltip="Agregar Red Social" />
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <>
                        <h6>Tipo de Proveduría</h6>
                        <TagPicker className="my-3" data={getProvedurias()} block value={provedurias} onChange={e => setProvedurias(e)} />
                    </>
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