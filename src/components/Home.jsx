// DEPENDENCIAS INSTALADAS POR NPM
import { useSelector } from 'react-redux';

// DEPENDENCIAS DE REACT
import { useState, useEffect } from "react";

// HELPERS PROPIOS DE LA APP
import ConnectionHelper from "../helpers/ConnectionHelper";

function Home () {

    // INICIALIZACIÓN DE HELPERS
    const connectionHelper = new ConnectionHelper();
    
    // INICIALIZACIÓN DE SELECTOR PARA VER LOS DATOS DE LA SESIÓN
    const sesionData = useSelector(state => state?.sesion);

    // INICIALIZACIÓN DE HOOKS
    const [referLink, setReferLink] = useState('');
    const [isActive, setIsActive] = useState(null);

    // CREACIÓN DE VARIABLES GLOBALES DEL COMPONENTE
    let contractSign,
        walletAddress;

    useEffect(() => {
        
        // FUNCIÓN QUE RETORNA LA INFORMACIÓN DEL CONTRATO Y SUS REFERIDOS

        const getRefersTable = async () => {

            try {
                
                // CHEQUEO DE ESTADO DE SESIÓN DEL USUARIO Y SU WALLET

                const tempIsActive = await connectionHelper.checkIsConnected(sesionData);
                
                // SI EL USUARIO ESTA EN SESIÓN, CREA EL LINK DE REFERIDO Y CONSTATA LA COMPRA 
                // DE MEMBRESÍA DEL USUARIO

                if (tempIsActive[0]) {

                    contractSign = tempIsActive[1];
                    walletAddress = tempIsActive[2];
                    setReferLink(window.location.href + walletAddress);

                    const checkIfIsMember = await contractSign?.methods?.investors(walletAddress).call({
                        from: walletAddress,
                    });

                    setIsActive(checkIfIsMember.registered);
                    
                }

            } catch (e) {
                
                console.log(e);

            }

        };

        getRefersTable();

    }, [connectionHelper.checkIsConnected(sesionData)]);

    return (
        <div className="container-page-home">
            <h1 className="welcome-tag">WELCOME TO YOUR BEST INVEST CHOICE!</h1>
            <div className="banners">
                <img 
                    className="banner-img"
                    src="../assets/banner-img3.png" 
                    alt="Infinity Banner" 
                    title="Infinity Banner" />
                <div className="dashboard">
                    <div className="refer-link-zone">
                        <div className="header-refer-zone">
                            <p>Copy refer link to your clipboard: { referLink }</p>
                        </div>
                        <div className="content-refer-zone">
                            <button onClick={ () => navigator.clipboard.writeText(referLink) }>
                                <ion-icon name="clipboard-outline"></ion-icon>
                            </button>
                        </div>
                    </div>
                    <div className="membership-status">
                        <h3>Your membership is: { isActive ? 
                            <ion-icon style={{ color: 'green' }} name="checkmark-circle-outline"></ion-icon>
                            :
                            <ion-icon name="close-circle-outline"></ion-icon>
                        }</h3>
                    </div>
                    <a href="https://web.infinityblocks.tech/" className="go-to-landing">
                        <b>Go to Our Landing</b>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Home;