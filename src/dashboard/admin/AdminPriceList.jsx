import React from 'react';
import AdminCountries from "./AdminCountries";
import AdminBmType from "./AdminBmType";
import '../admin/AdminPriceList.css'
import Requisites from './Requisites/Requisites.jsx'

const AdminPriceList = (props) => {

    return <div className='admin-price'>
        <div className='admin-price-header'>Price-list</div>
        <div className='admin-price-category'>Accounts</div>
        <AdminCountries
            countries={props.countries}
            user={props.user}
        />
        <div className='admin-price-category'>BM</div>
        <AdminBmType
            bmTypes={props.bmTypes}
            user={props.user}
        />
    <Requisites/>
    </div>
};

export default AdminPriceList;