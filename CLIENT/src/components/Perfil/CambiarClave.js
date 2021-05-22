import React, { useState } from 'react';
import { InputGroup, FormControl, ControlLabel, Form } from 'rsuite';
import Boton from '../shared/Boton';
import { ApolloConsumer } from 'react-apollo';

const CambiarClave = ({ usuario }) => {
    const [actual, setActual] = useState('');
    const [nueva, setNueva] = useState('');
    const [confirmar, setConfirmar] = useState('');

    const onEnter = async (e) => {

    }

    const actualizarClave = async (cliente) => {

    }

    return (
        <ApolloConsumer>{
            cliente => {
                return (
                    <div className="mx-auto w-75">
                        <Form fluid>
                            <ControlLabel style={{ fontSize: 16, textAlign: 'center', fontWeight: 700 }}>Contraseña actual</ControlLabel>
                            <InputGroup className="w-100 mb-2">
                                <FormControl style={{ textAlign: 'center' }} name="actual" placeholder="Contraseña actual" onChange={e => setActual(e)} onKeyDown={onEnter} defaultValue={actual} />
                            </InputGroup>
                            <ControlLabel style={{ fontSize: 16, textAlign: 'center', fontWeight: 700 }}>Contraseña nueva</ControlLabel>
                            <InputGroup className="w-100 mb-2">
                                <FormControl style={{ textAlign: 'center' }} name="nueva" placeholder="Contraseña nueva" onChange={e => setNueva(e)} onKeyDown={onEnter} defaultValue={nueva} />
                            </InputGroup>
                            <ControlLabel style={{ fontSize: 16, textAlign: 'center', fontWeight: 700 }}>Confirme contraseña</ControlLabel>
                            <InputGroup className="w-100 mb-2">
                                <FormControl style={{ textAlign: 'center' }} name="actual" placeholder="Confirme contraseña" onChange={e => setConfirmar(e)} onKeyDown={onEnter} defaultValue={confirmar} />
                            </InputGroup>
                            <Boton name="Sobrescribir" tooltip="Sobrescribir contraseña y cerrar la session" color="red" icon="exchange" size="sm" position="end" onClick={() => { actualizarClave(cliente) } } />
                        </Form>
                    </div>
                );
            }
        }</ApolloConsumer>
    );
}

export default CambiarClave;