// DEPENDENCIAS INSTALADAS POR NPM
import { useSelector } from 'react-redux';

// DEPENDENCIAS DE REACT
import { useEffect, useState } from 'react';

// HELPERS PROPIOS DE LA APP
import ConnectionHelper from "../helpers/ConnectionHelper";


function Refers () {

    /*
     
    INICIALIZACIÓN DE DIRECCIÓN DEL TOKEN Y DEL CONTRATO (PRÓXIMAMENTE)

    const tokenAddress = new Payments().tokenAddress();
    const tokenABI = new Payments().tokenABI();
    
    */

    // INICIALIZACIÓN DE HELPERS
    const connectionHelper = new ConnectionHelper();

    // INICIALIZACIÓN DE SELECTOR PARA VER LOS DATOS DE LA SESIÓN
    const sesionData = useSelector(state => state?.sesion);

    // INICIALIZACIÓN DE HOOKS
    const [isLogged, setIsLogged] = useState(false);
    const [tableRefers, setTableRefers] = useState(null);

    // CREACIÓN DE VARIABLES GLOBALES DEL COMPONENTE
    let contractSign, walletAddress, decimals;
    

    // EFECTO QUE INICIALIZA LA FUNCIÓN DE OBTENCIÓN DE DATOS DE REFERIDOS

    useEffect(() => {
        
        const getRefersTable = async () => {

            try {
                
                // CHEQUEO CON EL HELPER DE CONEXIÓN SI ESTA ESTÁ EXISTENTE

                const tempIsLogged = await connectionHelper.checkIsConnected(sesionData);
                
                // INICIALIZACIÓN DE LA DIRECCIÓN DEL CONTRATO Y DE WALLET

                contractSign = tempIsLogged[1];
                walletAddress = tempIsLogged[2];

                // ACTUALIZACIÓN DE ESTADO DE LOGEO

                setIsLogged(tempIsLogged[0]);
                
                // VALIDACIÓN DE EXISTENCIA DE SESIÓN

                if (tempIsLogged[0]) {
                    
                    // FUNCIÓN QUE ALMACENA TEMPORALMENTE LOS DATOS DE REFERIDOS

                    const tempTableRefers = await contractSign.methods.investors(walletAddress).call({
                        from: walletAddress,
                        //gas: '21000'
                    });
                    
                    // CÁLCULO Y ESTRUCTURA DE TABLA DE REFERIDOS

                    decimals = 1000000000000000000;

                    const tableStructureLevel1 = [
                        tempTableRefers['9'],
                        tempTableRefers['9'],
                        tempTableRefers['directos'],
                        (parseFloat(tempTableRefers['11']) / decimals),
                        (parseFloat(tempTableRefers['3']) / decimals),
                        (10 - (parseFloat(tempTableRefers['3'])) / decimals),
                        10
                    ];

                    // ACTUALIZACIÓN DE ESTADO DE TABLA PARA REFERIDOS

                    setTableRefers(tableStructureLevel1);
    
                    /*
                    
                    REVISAR ABI Y CONTRATO PARA MANTENER EL CÓDIGO AUTOMÁTICO EN RELACIÓN A LOS DECIMALES
                    
                    let tokenSign = new sesionData.sesion.eth.Contract(tokenABI, tokenAddress);
    
                    const decimals = await tokenSign.methods.decimals().call({
                        from: walletAddress,
                        gas: '22000'
                    });                
    
                    console.log(decimals);
                    
                    */
        
                }

            } catch (e) {
                
                console.log(e);

            }

        };

        getRefersTable();

    }, [isLogged]);

    return (
        <div className="container-page-refers">
            <div className="refers-table">
                <div className="header-withdraw">
                    <h3>CHECK YOUR EARNINGS AND REFERS TABLE</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <td>
                                <p>LEVEL</p>                                
                            </td>
                            <td>
                                <p>TEAM</p>                                
                            </td>
                            <td>
                                <p>BONDS</p>                                
                            </td>
                            <td>
                                <p>CAPITAL</p>                                
                            </td>
                            <td>
                                <p>REFERRALS</p>                                
                            </td>
                            <td>
                                <p>RESIDUAL</p>                                
                            </td>
                            <td>
                                <p>TOTAL</p>                                
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <p>
                                    <strong className="color-dolar">$</strong> { tableRefers?.length > 0 ? tableRefers[0] : 0 }
                                </p>
                            </td>
                            <td>
                                <p>
                                    <strong className="color-dolar">$</strong> { tableRefers?.length > 0 ? tableRefers[1] : 0 }
                                </p>
                            </td>
                            <td>
                                <p>
                                    <strong className="color-dolar">$</strong> { tableRefers?.length > 0 ? tableRefers[2] : 0 }
                                </p>
                            </td>
                            <td>
                                <p>
                                    <strong className="color-dolar">$</strong> { tableRefers?.length > 0 ? tableRefers[3] : 0 }
                                </p>
                            </td>
                            <td>
                                <p>
                                    <strong className="color-dolar">$</strong> { tableRefers?.length > 0 ? tableRefers[4] : 0 }
                                </p>
                            </td>
                            <td>
                                <p>
                                    <strong className="color-dolar">$</strong> { tableRefers?.length > 0 ? tableRefers[5] : 0 }
                                </p>
                            </td>
                            <td>
                                <p>
                                    <strong className="color-dolar">$</strong> { tableRefers?.length > 0 ? tableRefers[6] : 0 }
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Refers;