import AdminCountries from "./AdminCountries";
import AdminBmType from "./AdminBmType";
import '../admin/AdminPriceList.css'
import ReqContainer from './Requisites/ReqContainer'

const AdminPriceList = (props) => {


    return <div className='admin-price ym-hide-content'>
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
        <ReqContainer/>
    </div>
};

export default AdminPriceList;