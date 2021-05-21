import React, { useState } from 'react';
import { withRouter } from 'react-router';
import Boton from '../shared/Boton'
import { Icon, Panel, Form, FormGroup, FormControl, InputGroup, ButtonToolbar, ControlLabel, Notification, Loader} from 'rsuite';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../../services/UsuarioService';

const Login = ({ ...props }) => {
    const [cedula, setUsuario] = useState('');
    const [clave, setPassword] = useState('');
    const [autenticarUsuario, { loading: load_login, error: error_login }] = useMutation(LOGIN);

    const onEnter = async (e) => {
        if (e.key === 'Enter') {
            localStorage.removeItem('rol', '');
            const { data } = await autenticarUsuario({ variables: { cedula, clave } });
            if (data.autenticarUsuario.token !== '0') {
                await localStorage.setItem('rol', null);
                await localStorage.setItem('token', data.autenticarUsuario.token);
                await props.refetch().then(() => {
                    props.history.push('/');
                })
            } else {
                Notification['warning']({
                    title: 'Alerta',
                    description: 'Usuario y/o contraseña incorrecta'
                });
            }
        }
    }

    const clickIniciarSesion = async () => {
        const {data } = await autenticarUsuario({ variables: { cedula, clave } });
        if (data.autenticarUsuario.token !== '0') {
            await localStorage.setItem('token', data.autenticarUsuario.token); 
            await props.refetch().then(()=>{
              props.history.push('/');
              
            });
        } else {
            Notification['warning']({
              title: 'Alerta',
              description: 'Usuario y/o contraseña incorrecta'
            }); 
        }
    }

    if(load_login){
        return <Loader backdrop content="Autenticando..." vertical  size="lg"/>
      }
      if(error_login){
        
          Notification['error']({
            title: 'Error',
            description: error_login.message,
            duration:25000
          });
      }

    return (
        <Panel header={<h3>Iniciar Sesión</h3>} bordered className="w-75 mx-auto">
            <Form fluid>
                <FormGroup>
                    <ControlLabel style={{ fontSize: 22, textAlign: 'center', fontWeight: 700 }}>Identificación</ControlLabel>
                    <InputGroup inside className="w-100">.
                        <FormControl style={{ textAlign: 'center' }} name="cedula" placeholder="Identificación" onChange={e => setUsuario(e)} onKeyDown={onEnter} defaultValue={cedula} />
                        <InputGroup.Addon>
                            <Icon icon="id-card" size="lg" />
                        </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <ControlLabel style={{ fontSize: 22, textAlign: 'center', fontWeight: 700 }}>Contraseña</ControlLabel>
                    <InputGroup inside className="w-100">
                        <FormControl style={{ textAlign: 'center' }} type="password" placeholder="Contraseña" onChange={e => setPassword(e)} onKeyDown={onEnter} defaultValue={clave} />
                        <InputGroup.Addon>
                            <Icon icon="key" size="lg" />
                        </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                        <Boton id="btnLogin" name="Iniciar sesion" tooltip="Iniciar sesion" color="green" icon="sign-in" size="sm" position="end" onClick={clickIniciarSesion}/>
                        <Link to="/login" style={{ color: 'blue' }}>¿Olvido su contraseña?</Link>
                    </ButtonToolbar>
                </FormGroup>
            </Form>
        </Panel>
    )
}

export default withRouter(Login);