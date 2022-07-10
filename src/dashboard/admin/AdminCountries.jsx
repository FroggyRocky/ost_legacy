import React from 'react';
import {NavLink} from 'react-router-dom';
import './AdminCountries.css'
import {ReactComponent as Pencil} from "../../img/pencil.svg";
import {ReactComponent as Plus} from "../../img/plus.svg";

const AdminCountries = (props) => {

    const countries = props.countries?.map((el) => (
        <div key={el.id} className='admin-country'>
            <div className='admin-country-data'>
                <div>
                    <div>Country</div>
                    <div style={{fontSize:15, marginBottom:10}}>{el.type}</div>
                    <div>{el.name}</div>
                </div>
                <div>
                    <div>Price</div>
                    <div>$ {el.price}</div>
                </div>
            </div>
            {props.user.admin && props.user.permission.price_list_update &&
                <div className='admin-country-edit'>
                    <NavLink to={`/dashboard/adminpricelist/addcountry/${el.id}`}>
                        <button>
                            <Pencil/>
                        </button>
                    </NavLink>
                </div>}
        </div>
    ));

    return <div className='admin-countries'>
                {countries ? countries : <p>No countries added yet</p>}
                {props.user.admin && props.user.permission.price_list_update &&
                    <NavLink className='admin-country-add' to={`/dashboard/adminpricelist/addcountry/`}>
                        <Plus/>
                    </NavLink>}
    </div>
};

export default AdminCountries;