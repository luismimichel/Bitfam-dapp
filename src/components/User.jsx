import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Payments from '../web3/payments';
import ConnectionHelper from "../helpers/ConnectionHelper";

function User () {
    
    const connectionHelper = new ConnectionHelper();

    const contractAddress = new Payments().contractAddress();

    const sesionData = useSelector(state => state?.sesion);
    
    const [nickImg, setNickImg] = useState('./assets/user/2.png');
    const [bioValue, setBioValue] = useState();
    const [nickValue, setNickValue] = useState();

    let contractMethod,
        contractSign,
        walletAddress;


    const executeContractMethod = async (methodName, params, wallet, config) => {
        
        try {

            params = JSON.stringify(params);
            contractMethod = methodName;

            if (config.approve) {

                await config.contractSign?.methods[methodName](wallet, params).approve(config.approve);

            } else {
                
                if (config.send) {

                    await config?.contractSign?.methods[methodName](contractAddress, params)
                        .send({ 
                            from: wallet, 
                            //gas: '21000' 
                        });
    
                }

                await config.contractSign?.methods[methodName](wallet, params)(JSON.parse(params));

            }

        } catch (e) {
            
            console.log(e);

        }
    }

    const init = async () => {

        const checkInit = await connectionHelper.checkIsConnected(sesionData); 

        if (!checkInit[0]) {
                
            return false;
            
        }

        contractSign = checkInit[1];
        walletAddress = checkInit[2];

        let blocks = await contractSign?.methods?.investors(walletAddress).call({
            from: walletAddress,
            //gas: '21000'
        });

        blocks.data = JSON.parse(blocks.data);

        setNickImg(blocks.data.image);
        setBioValue(blocks.data.bio);
        setNickValue(blocks.data.name);

    }

    useEffect(() => {

        init();

    }, []);

    return (
        <div className='container-page-user'>
            <form className="form-user">
                <img src={ nickImg } alt="user" title="user" className="user-img" />
                <input 
                    onChange={ (e) => setBioValue(e.target.value) }
                    type="text" 
                    className="user-fields" 
                    placeholder="Set your bio" />
                <input 
                    onChange={ (e) => setNickValue(e.target.value) }
                    type="text" 
                    className="user-fields" 
                    placeholder="Nick name" />
                <input 
                    onChange={ (e) => setNickImg(e.target.value) }
                    type="text" 
                    className="user-fields" 
                    placeholder="URL Nick" />
                <input 
                    type="button"
                    className="cards-buttons" 
                    
                    onClick={ async () => { 
                        
                        const isLogged = await connectionHelper.checkIsConnected(sesionData);

                        if (isLogged[0]) {

                            const dataOfMember = { 
                                name: nickValue, 
                                bio: bioValue, 
                                image: nickImg
                            }
    
                            executeContractMethod('registro', dataOfMember, walletAddress, {
                                approve: null, 
                                send: true, 
                                contractSign 
                            });

                        }  else {
                            
                            return alert('You must to login');

                        }

                    } } value="Buy Membership" />
            </form>
        </div>
    );

}

export default User;