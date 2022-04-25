import {useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './login/Login';
import Dashboard from './dashboard/Dashboard'
import Landing from "./landing/NewLanding/Landing";
import Email from "./login/Email";
import ResetPassword from "./login/ResetPassword";
import {connect} from 'react-redux'
import NotFound from "./dashboard/NotFound";
import {setPopUpState} from './Redux/Reducers/login'


function App(props) {

useEffect(() => {
    function preventDrop(e) {
        e.preventDefault();
    }
    window.addEventListener("dragover",preventDrop,false);
    window.addEventListener("drop",preventDrop,false);
    return () => {
     window.removeEventListener("dragover",preventDrop,false);
    window.removeEventListener("drop",preventDrop,false); 
}
},[])

    return (
        <BrowserRouter>
            <div className='app'>
                <Switch>
                  <Route
                      exact
                      path='/'
                      render={()=> <Landing />}
                  />
                    <Route
                        path='/login'
                        render={()=> <Login setPopUpState={props.setPopUpState} page={props.loginPage}/>}
                    />
                    <Route
                        path='/dashboard'
                        render={()=> <Dashboard setPopUpState={props.setPopUpState} />}
                    />
                    <Route
                        path='/email'
                        render={()=> <Email />}
                    />
                    <Route
                        path='/reset'
                        render={()=> <ResetPassword />}
                    />
                    <Route
                        path='*'
                        exact={true}
                        render={()=> <NotFound />}
                    />
                </Switch>
            </div>
        </BrowserRouter>
    );
}


const mapStateToProps = (state) => ({
    isPopUp_on:state.Login.isPopUp_on,
    loginPage:state.Login.loginPage
  })

export default connect(mapStateToProps, {setPopUpState})(App);
