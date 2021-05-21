import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { withRouter, Link } from 'react-router-dom';
import { Icon } from 'rsuite';

const cerrarSessionUsuario =(cliente,history)=>{
    localStorage.removeItem('token','');
    localStorage.removeItem('rol','');
    //desloguear
    //Apollo va a cachear muchas de las cosultas y el resetStore me limpia todo
    cliente.resetStore();
    //Redirecionar
    history.push('/login');
    
}
const CerrarSesion = ({history,name}) => (
    <ApolloConsumer>
        {cliente => {
            return (
                <Link to="" onClick={() => cerrarSessionUsuario(cliente, history)}><Icon icon="sign-out"/>{name}</Link>
            );
        }}
    </ApolloConsumer>
)

export default withRouter(CerrarSesion);