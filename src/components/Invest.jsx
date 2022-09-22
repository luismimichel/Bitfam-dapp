// DEPENDENCIAS INSTALADAS POR NPM
import { useSelector } from 'react-redux';

// DEPENDENCIAS DE REACT
import { useState, useEffect } from 'react';

// CLASES DE WEB3 (ABIS, CONTRATOS)
import Payments from '../web3/payments';

// HELPERS PROPIOS DE LA APP
import ConnectionHelper from "../helpers/ConnectionHelper";

function Invest () {

    // INICIALIZACIÓN DE HELPERS
    const connectionHelper = new ConnectionHelper();

    // INICIALIZACIÓN DE LAS CLASES Y ACCESO A LOS MÉTODOS DE WEB3
    const tokenAddress = new Payments().tokenAddress();
    const tokenABI = new Payments().tokenABI();

    // INICIALIZACIÓN DE SELECTOR PARA VER LOS DATOS DE LA SESIÓN
    const sesionData = useSelector(state => state?.sesion);
    
    // INICIALIZACIÓN DE HOOKS
    const [membershipDuration, setMembershipDuration] = useState(`${ 0 } Days left`);
    const [blockAmount, setBlockAmount] = useState(1);
    const [blockValue, setBlockValue] = useState(50);
    const [isLogged, setIsLogged] = useState(false);
    const [balanceInfinity, setBalanceInfinity] = useState(0);
    const [percent, setPercent] = useState(0);
    const [activeBonds, setActiveBonds] = useState(0);
    
    // CREACIÓN DE VARIABLES GLOBALES DEL COMPONENTE
    let contractSign, 
        walletAddress, 
        blocks, 
        balance = 0;

    // FUNCIÓN QUE CALCULA Y ACTUALIZA EL ESTADO DEL PRECIO DE INVERSIÓN

    const calculateInvestment = (e) => {

        setBlockAmount(e.target.value);
        setBlockValue(e.target.value * 50);

    }

    // FUNCIÓN QUE COMPRA LOS BLOQUES DE INVERSIÓN
    const invest = () => {

        contractSign?.methods?.buyBlocks(blockValue.toString(10)).send({

            from: walletAddress,        

        }).then((function () {
    
            window.alert("Congratulations Successful Investment");
    
        })).catch((e) => {
            
            alert('Error during investment');
            console.log(e);

        });

    }
   
    // FUNCIÓN ENCARGADA DE CARGAR LA INFORMACIÓN DE INICIO DE LAS INVERSIONES

    const loadInvestData = async () => {

        try {

            // CHEQUEO CON EL HELPER DE CONEXIÓN SI ESTA ESTÁ EXISTENTE

            const isConnected = await connectionHelper.checkIsConnected(sesionData);
            
            // VALIDACIÓN DE LA CONEXIÓN

            if (isConnected[0] === false) {
                
                return false;
                
            }
            
            // INICIALIZACIÓN DE LA DIRECCIÓN DEL CONTRATO Y DE WALLET

            contractSign = isConnected[1];
            walletAddress = isConnected[2];

            // VALIDACIÓN DE EXISTENCIA DE DIRECCIÓN DE CONTRATO

            if (contractSign) {

                // OBTENCIÓN Y CÁLCULO DE LOS BONOS ACTIVOS DEL USUARIO

                let deposits = await contractSign.methods.depositos(walletAddress, !1).call({
                    from: walletAddress,                
                });                
                
                setActiveBonds(parseFloat(deposits[3]) / 1000000000000000000);

                /*
                
                FUNCIÓN QUE OBTIENE EL TIEMPO DE ACTIVIDAD DE UN BLOQUE

                let time = await contractSign.methods.tiempo().call({
                    from: walletAddress,                
                });
                
                */                                

                // OBTENCIÓN Y ACTUALIZACIÓN DE ESTADO DEL PORCENTAJE DE BLOQUES COMPRADOS

                let percentTemp = await contractSign.methods.porcent().call({
                    from: walletAddress,                
                });                

                setPercent(percentTemp);

                // 

                // ACTUALIZACIÓN DE ESTADO Y CÁLCULO DE VALOR Y DÍAS RESTANTES DE MEMBRESÍA

                blocks = await contractSign.methods.investors(walletAddress).call({
                    from: walletAddress,                
                });

                const decimals = 1000000000000000000;

                setBalanceInfinity(parseFloat(blocks['balanceInfinit']) / decimals);
                setMembershipDuration(`${ ((blocks.membership - Date.now() / 1e3) / 86400).toFixed(0) } Days left`);
                
                // FIRMA DEL CONTRATO INTELIGENTE Y OBTENCIÓN DE BALANCE EN WALLET DEL USUARIO

                let tokenSign = new sesionData.sesion.eth.Contract(tokenABI, tokenAddress);

                balance = await tokenSign.methods.balanceOf(walletAddress).call({
                    from: walletAddress,                
                });

            }

            // ACTUALIZACIÓN DEL ESTADO DEL LOGEO 
            setIsLogged(true);

        } catch (e) {
            
            console.log(e);
        }

    };

    // HOOK DE EFECTO QUE INICIALIZA LA CARGA DE LA INFORMACIÓN DE INVERSIÓN

    useEffect(() => {
        loadInvestData();
    }, [isLogged]);

    return (
        <div className="container-page-invest">    
            <div className="header-withdraw">
                <h3>MAKE YOUR INVESTMENT</h3>
            </div>    
            <div className="invest-table">
                <div className="first-invest-row">
                    <button className="allow-buttons">Infinity Bonus Available: { balanceInfinity } $</button>
                </div>
                <div className="second-invest-row">
                    <p>Balance USDT: $ { balance }</p>
                </div>
                <div className="invest-calculator">
                    <div className="fields-invest">
                        <div className="invest-card">
                            <img src="assets/rango-4.png" alt="blocks"title="blocks" />
                            <p>Blocks</p>
                        </div>
                    </div>
                    <div className="separators-invest">X</div>
                    <div className="fields-invest">
                        <input 
                            type="number" 
                            step="50" 
                            onChange={ (e) => calculateInvestment(e) } 
                            className="invest-inputs" />
                        { blockAmount } BLKS
                    </div>
                    <div className="separators-invest">=</div>
                    <div className="fields-invest">
                        <input 
                            value = { blockValue }
                            type = "number" 
                            disabled = { true } 
                            className = "invest-inputs" />
                        { blockValue } USDT
                    </div>
                    <div className="separators-invest">
                        <button 
                            onClick={ async () => {
                                    const tempIsConnected = await connectionHelper.checkIsConnected(sesionData);
                                    tempIsConnected[0] ? invest() : alert('Yout must to login') 
                                }
                            }
                            className="allow-buttons">Allow</button>
                    </div>
                </div>
                <div className="investor-data">
                    <div className="membership-field">
                        <p><b>Membership duration</b>: { membershipDuration }</p>
                    </div>
                    <div className="bonds-invests">
                        <h3>IN BONDS: { activeBonds }$</h3>
                        <meter
                            min="0" 
                            max="100"
                            high="66" 
                            value={ percent }>
                        </meter>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Invest;
