import React from 'react';
import {ReactComponent as ActivationNo} from '../img/activation-no.svg';

function NotFound() {
    return <div className='not-found'>
        <ActivationNo/>
        <h1>404</h1>
        <h1>PAGE NOT FOUND!</h1>
    </div>
}

export default NotFound;