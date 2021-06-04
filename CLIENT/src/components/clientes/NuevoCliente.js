import React, { useState } from 'react'
import { Notification, SelectPicker, InputGroup, Icon } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_CLIENTE } from '../../services/ClienteService'
import { countries } from '../../Json/countries.json'
import { states } from '../../Json/states.json'
import List from '../shared/List'
import Action from '../shared/Action'

const NuevoCliente = (props) => {
    const [tipo, setTipo] = useState('');
    const [nombre, setNombre] = useState('');
    const [codigo, setCodigo] = useState('');
    const [pais, setPais] = useState(null);
    const [ciudad, setCiudad] = useState(null);
    const [direccion, setDireccion] = useState('');
    const [telefonos, setTelefonos] = useState([]);
    const [correos, setCorreos] = useState([]);
    const [refrescar, setRefrescar] = useState(false);
    const [insertar] = useMutation(SAVE_CLIENTE);
    const [datos, setDatos] = useState(true);
    const [contacto, setContacto] = useState(false);
    const [ubicacion, setUbicacion] = useState(false);

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

    const getTipos = () => {
        const tipos = [];
        tipos.push({
            "label": "FISICO",
            "value": "FISICO"
        })
        tipos.push({
            "label": "EMPRESA",
            "value": "EMPRESA"
        })
        return tipos;
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

    const validarForm = () => {
        return !tipo || !nombre || !codigo || !pais || !ciudad || !direccion || telefonos.length === 0 || correos.length === 0;
    }

    const onSaveCliente = async () => {
        try {
            const input = {
                tipo,
                nombre,
                codigo,
                pais: pais.name,
                ciudad: ciudad.name,
                direccion,
                telefonos,
                correos,
                estado: "ACTIVO"
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarCliente;
            if (estado) {
                Notification['success']({
                    title: 'Insertar Cliente',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/clientes`);
            } else {
                Notification['error']({
                    title: 'Insertar Cliente',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            Notification['error']({
                title: 'Insertar Cliente',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el cliente"
            })
        }
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/clientes`)} icon="arrow-left-line" tooltip="Ir a comisiones" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Registrar Cliente</h3>
            <div>
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5>Datos del Cliente</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setDatos(!datos) }} tooltip={datos ? "Ocultar" : "Mostrar"} color={"cyan"} icon={datos ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {datos &&
                    <>
                        <div className="row">
                            <div className="col-md-4 float-left">
                                <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Tipo de Cliente" data={getTipos()} onChange={(e) => setTipo(e)} searchable={false} />
                            </div>
                            <div className="d-flex justify-content-end col-md-8 float-right">
                                <input className="form-control mt-3" type="text" placeholder="Número de identificación de la empresa o persona" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                            </div>
                        </div>
                        <input className="form-control mt-3 mb-3" type="text" placeholder="Nombre del cliente" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </>
                }
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5 className="mt-2">Contacto del Cliente</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setContacto(!contacto) }} tooltip={contacto ? "Ocultar" : "Mostrar"} color={"cyan"} icon={contacto ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {contacto &&
                    <div className="row mt-3">
                        <div className="w-50 d-inline-block">
                            <List estilos="w-90 mx-auto" data={telefonos} clave="telefono" header="Teleonos" edit={false} borrar={true}  setRefrescar={setRefrescar}/>
                            <div className="input-group mt-3 mb-3 w-90 mx-auto">
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
                            <div className="input-group mt-3 mb-3 w-90 mx-auto">
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
                        <h5 className="mt-2">Dirección del Cliente</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setUbicacion(!ubicacion) }} tooltip={ubicacion ? "Ocultar" : "Mostrar"} color={"cyan"} icon={ubicacion ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {ubicacion &&
                    <>
                        <div className="row">
                            <div className="d-flex col-md-6 float-left w-90">
                                <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Paises" data={getPaises()} onChange={(e) => setPais(e)} />
                            </div>
                            <div className="d-flex justify-content-end col-md-6 float-right w-90">
                                <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Provincias o Estados" data={getCiudades()} onChange={(e) => setCiudad(e)} />
                            </div>
                        </div>
                        <input className="form-control mt-3" type="text" placeholder="Dirección o señas particulares" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                    </>
                }
            </div>
            <div className="d-flex justify-content-end float-rigth mt-3">
                <Boton onClick={onSaveCliente} tooltip="Guardar Cliente" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    );
}

export default withRouter(NuevoCliente);