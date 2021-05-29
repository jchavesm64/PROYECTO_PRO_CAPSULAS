import React from 'react';
import {InputGroup, Icon} from 'rsuite';
import List from '../shared/List';

const Informacion = ({ usuario }) => {

    return (
        <div className="mx-auto">
            <hr />
            <div className="w-50 d-inline-block">
                <InputGroup className="mx-auto w-75 btn-outline-light mb-2">
                    <InputGroup.Addon>
                        <Icon icon="user" />
                    </InputGroup.Addon>
                    <span className="w-100 text-left text-dark pt-1 px-3">{usuario.nombre}</span>
                </InputGroup>
                <List data={usuario.correos} clave="email" header="Correos Registrados" edit={false} borrar={false} />
            </div>
            <div className="w-50 d-inline-block">
                <InputGroup className="mx-auto w-75 btn-outline-light mb-2">
                    <InputGroup.Addon>
                        <Icon icon="id-card-o" />
                    </InputGroup.Addon>
                    <span className="w-100 text-left text-dark pt-1 px-3">{usuario.cedula}</span>
                </InputGroup>
                <List data={usuario.telefonos} clave="telefono" header="Telefonos Registrados" edit={false} borrar={false}/>
            </div>
        </div>
    );
}

export default Informacion;