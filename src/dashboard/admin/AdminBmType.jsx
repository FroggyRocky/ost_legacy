import React from 'react';
import {NavLink} from 'react-router-dom';
import './AdminBmType.css'
import {ReactComponent as Pencil} from "../../img/pencil.svg";
import {ReactComponent as Plus} from "../../img/plus.svg";
import verified from '../../img/verified.png'

const AdminBmType = (props) => {

    const bmTypes = props.bmTypes?.map((el) => (
        <div key={el.id} className='admin-bm-type'>
            <div>
                <div>Type</div>
                <div>{el.name}{el.type?.toLowerCase() === 'verified' && <img width='18' height='18' src={verified} alt="verified"/>}</div>
            </div>
            <div>
                <div>Price</div>
                <div>$ {el.price}</div>
            </div>
            {props.user.admin && props.user.permission.price_list_update &&
                <div className='admin-bm-type-edit'>
                    <NavLink to={`/dashboard/adminpricelist/addbmtype/${el.id}`}>
                        <button>
                            <Pencil/>
                        </button>
                    </NavLink>
                </div>}
        </div>
    ));

    return <div className='admin-bm-types'>
                {bmTypes ? bmTypes : <div>There is no BM types</div>}
                {props.user.admin && props.user.permission.price_list_update &&
                <NavLink className='admin-bm-type-add' to={`/dashboard/adminpricelist/addbmtype/`}>
                    <Plus/>
                </NavLink>}
    </div>
};

export default AdminBmType;