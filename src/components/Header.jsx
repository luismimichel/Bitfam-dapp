// DEPENDENCIAS INSTALADAS POR NPM
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useDispatch, useSelector } from 'react-redux';

// DEPENDENCIAS DE REACT

import { useState } from 'react';

// SLICES DE REACT REDUX

import { sesion } from '../features/sesion/sesionSlice';

// HELPERS PROPIOS DE LA APP

import RenderHelper from '../helpers/RenderHelper.js';
import ConnectionHelper from "../helpers/ConnectionHelper";


function Header() {
    
    // INICIALIZACIÓN DE HELPERS
    
    const renderHelper = new RenderHelper();
    const connectionHelper = new ConnectionHelper();
    
    // INICIALIZACIÓN DE DISPATCH DE REDUX
    
    const dispatch = useDispatch();
    
    // INICIALIZACIÓN DE SELECTOR PARA VER LOS DATOS DE LA SESIÓN
    const sesionData = useSelector(state => state?.sesion);

    // INICIALIZACIÓN DE HOOKS

    const [provider, setProvider] = useState(null);
    const [isLoging, setIsLoging] = useState(false);
    const [isLogged, setIsLogged] = useState(null);
    const navigate = useNavigate();

    // CREACIÓN DE VARIABLES GLOBALES DEL COMPONENTE

    let web3Modal, stateWeb3;

    // FUNCIÓN QUE INICIA EL LOGIN Y PROVEEDOR DE CONEXIÓN A LAS WALLETS

    const loginInit = async () => {

        try {

            // PROVEEDORES DE WALLETS ACEPTADOS POR LA DAPP

            const providerOptions = {
        
                binancechainwallet: {
                    package: true
                },
        
                walletconnect: {
                    package: WalletConnectProvider, 
                    options: {
                        // Mikko's test key - don't copy as your mileage may vary
                        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
                      }
                }
                
            };
            
            // INICIALIZACIÓN DEL MODAL Y COLOCACIÓN DE SUS OPCIONES

            web3Modal = new Web3Modal({
                
                cacheProvider: false,
                disableInjectedProvider: false,
                providerOptions,
                
            });

            setIsLoging(true);
            
            let providerTemp = await web3Modal.connect();
            
            setProvider(providerTemp);
            
            const web3 = new Web3(providerTemp);
            
            stateWeb3 = {
                modal: providerTemp,
                sesion: web3
            };

            // CAMBIO DE ESTADO Y REDUCTORES

            setIsLoging(false);
            setIsLogged(true);
            dispatch(sesion(stateWeb3));            

            return providerTemp;

        } catch (e) {

            console.log(e);
            return false;

        }

    }

    // FUNCIÓN QUE MANEJA Y EJECUTA EL LOGIN CON LAS OPCIONES DE LOS PROVEEDORES DE WALLET

    const login = async () => {
        
        try {

            let providerTemp = await loginInit();

            if (providerTemp === false) {
                
                return false;

            }

            // EVENTOS QUE DESENCADENAN UN REFRESCO DE PATANLLA AL EJECUTARSE

            providerTemp.on("accountsChanged", (accounts) => {
                                
                window.location.reload();

            });
                          
            providerTemp.on("chainChanged", (chainId) => {
                                
                window.location.reload();

            });
                        
            providerTemp.on("connect", (info) => {
                                
                window.location.reload();

            });
                        
            providerTemp.on("disconnect", (error) => {
                                
                window.location.reload();

            });

            // FINALIZACIÓN DE CICLO QUE DETECTA LA CONEXIÓN DE LA WALLET

            renderHelper.check(false, isLogged, null, null);  

            // VALIDACIÓN DE REDIRECCIÓN AL PANEL ADMINISTRATIVO

            /*
            const sesionInfo = await connectionHelper.checkIsConnected(stateWeb3);

            console.log(sesionInfo);

            if (sesionInfo[2] === '0xd47daea8824a7cc3109eded15ceb46d69f67edb5') {
                
                navigate('admin')

            }
            */

        } catch (e) {
            
            console.log(e);
    
        }  
    }
    
    // FUNCIÓN QUE EJECUTA EL CIERRE DE LOS PROVEEDORES

    const logout = async () => {
    
        try {

            // CAMBIO DE ESTADO QUE INHABILITA EL BOTÓN DE LOGIN / LOGOUT

            setIsLoging(true);

            // ELIMINACIÓN DE LA CACHE Y RESETEO DE LOS PROVEEDORES A SU ESTADO ORIGINAL

            await web3Modal?.resetState();
            await web3Modal?.clearCachedProvider();

            // CAMBIO DE ESTADO Y VACIADO DE LOS PROVEEDORES, HABILITACIÓN DEL BOTÓN CONNECT Y  
            // ESTADO DE LOGEADO A FALSO
                    
            setProvider(null);
            setIsLogged(false);
            setIsLoging(false);

            // ELIMINANDO EN MEMORIA LA SESIÓN DE LAS WALLETS CONECTADAS

            dispatch(sesion(null));            

            // REFRESCO DE PANTALLA PARA ACTUALIZAR EL DOM

            window.location.reload();

        } catch (e) {
            
            console.log(e);
    
        }  
    }

    return (
        <>
            <header>
                <nav>
                    <ul>
                        <li>
                            <img 
                                className="logo"
                                src='./assets/logo/materialize-logo.png'
                                alt="Infinity Block" 
                                title="Infinity Block" />
                        </li>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/invest">Invest</Link>
                        </li>
                        <li>
                            <Link to="/Withdraw">Withdraw</Link>
                        </li>
                        <li>
                            <Link to="/refers">Refers</Link>
                        </li>
                        <li>
                            <Link to="/user">Profile</Link>
                        </li>
                        <li>
                            { isLogged ?  <button 
                                    className = "connect-button"
                                    disabled = { isLoging }
                                    onClick = { async () => await logout() }>Disconnect</button>
                                :
                                <button 
                                    className = "connect-button"
                                    disabled = { isLoging }
                                    onClick = { async () => await login() }>Connect Wallet</button>
                            }
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default Header;