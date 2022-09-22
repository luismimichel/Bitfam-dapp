import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ConnectionHelper from "../helpers/ConnectionHelper";

function Withdraw () {

    let contractSign, walletAddress;

    const connectionHelper = new ConnectionHelper();
    const sesionData = useSelector(state => state?.sesion);
    
    const [ROI, setROI] = useState(0);
    const [referrals, setReferrals] = useState(0);

    const minWithdraw = async () => {

        let minWith = await contractSign?.methods.MIN_RETIRO().call({
            from: walletAddress,
            //gasPrice: '21000'
        });

        minWith = parseFloat(minWith) / 1000000000000000000;

        if (referrals >= minWith) {

            contractSign.methods.withdrawTeam().send({
                from: walletAddress,
                //gasPrice: '21000'
            });

        } else {
            alert(`The minimum to withdraw is: ${ minWith }`);
        }

    }

    const withdraw = async () => {

        let minWith = await contractSign?.methods.MIN_RETIRO().call({
            from: walletAddress,
            //gasPrice: '21000'
        });
    
        minWith = parseFloat(minWith) / 1000000000000000000;

        if (ROI >= minWith) {

            contractSign.methods.withdraw().send({
                from: walletAddress,
                //gasPrice: '21000'
            });
            
        } else {
            alert(`The minimum to withdraw is: ${ minWith }`);
        }

    }

    useEffect(() => {
        
        const getRefersTable = async () => {

            try {
                
                const tempIsLogged = await connectionHelper.checkIsConnected(sesionData);       
                
                if (tempIsLogged[0]) {
                    
                    contractSign = tempIsLogged[1];
                    walletAddress = tempIsLogged[2];

                    const ROI = await contractSign.methods.depositos(walletAddress, !1).call({
                        from: walletAddress,
                        //gas: '21000'
                    });

                    const tempTableRefers = await contractSign.methods.investors(walletAddress).call({
                        from: walletAddress,
                        //gas: '21000'
                    });
                    
                    setReferrals(parseFloat(tempTableRefers[2]) / 1000000000000000000);
                    
                    let decimals = 1000000000000000000;

                    setROI(parseFloat(ROI[0]) / decimals);
        
                }

            } catch (e) {
                
                console.log(e);

            }

        };

        getRefersTable();

    }, [connectionHelper.checkIsConnected(sesionData)]);

    return (
        <div className="container-page-withdraw">
            <div className="withdraws">
                <div className="header-withdraw">
                    <h3>WITHDRAW YOUR EARNINGS</h3>
                </div>
                <div className="card">
                    <p>
                        <strong>
                            { ROI } $
                        </strong>
                    </p>
                    <h3>ROI</h3>
                    <button 
                        onClick={ async () => { 
                            await connectionHelper.checkIsConnected(sesionData) ? 
                                withdraw() 
                                : 
                                alert('Yout must to login') 
                        }
                    }
                        className="cards-buttons">Withdraw</button>
                </div>
                <div className="card">
                    <p>
                        <strong>
                            { referrals } $
                        </strong>
                    </p>
                    <h3>Referrals</h3>
                    <button 
                        onClick={ async () => { 
                            await connectionHelper.checkIsConnected(sesionData) ? 
                                minWithdraw() 
                                : 
                                alert('Yout must to login') 
                        }
                    }
                        className="cards-buttons">Withdraw</button>
                </div>
                <div className="card">
                    <p>
                        <strong>
                            0.00$
                        </strong>
                    </p>
                    <h3>Residual</h3>
                    <button className="cards-buttons">Withdraw</button>
                </div>
            </div>
        </div>
    );
}

export default Withdraw;