import React from 'react';
import './LinkEdit.scss';
import {NavLink} from 'react-router-dom';
import {ReactComponent as Pencil} from "../../img/pencil.svg";

const LinkEdit = (props) => {
    return <NavLink className='link-edit' to={props.link}>
        <Pencil/>
    </NavLink>
};

export default LinkEdit;