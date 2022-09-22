import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ConnectionHelper from "../helpers/ConnectionHelper";

function Admin() {

    const connectionHelper = new ConnectionHelper();
    const sesionData = useSelector(state => state?.sesion);

    const [invested, setInvested] = useState(0);
    const [earned, setEarned] = useState(0);

    (async () => {
            
        console.log(sesionData);

        const sesionInfo = await connectionHelper.checkIsConnected(sesionData);
    
        console.log(sesionData);
    
        if (sesionInfo[2] !== '0xd47daea8824a7cc3109eded15ceb46d69f67edb5') {
            
            alert('You are not admin');
            window.location.href = '/';
    
        }

    })();

    useEffect(() => {

        let isChecked = localStorage.getItem('invested');
        
        setInterval(() => { 
            
            if (isChecked && isNaN(isChecked) === false) {
    
                isChecked = parseFloat(isChecked);    

                let newEarn = Math.floor(Math.random() * ((isChecked * 0.25 + isChecked) - isChecked) + isChecked);                        

                if (newEarn >= isChecked) {
    
                    localStorage.setItem('invested', newEarn.toFixed(2).toString());
                    setInvested(parseFloat(isChecked));
                    setEarned(parseFloat((isChecked) * 0.25));

                }

            } else {
                
                const total = Math.floor(Math.random() * 99);
                
                localStorage.setItem('invested', total.toString());
                setInvested(parseFloat(total));
                setEarned(parseFloat((total) * 0.25));
    
            }
                
        }, 10000);
            
    }, []);


    return (
        <>
            <div className="admin-container">
                <div style = {{
                    height: '560px', 
                    backgroundColor: '#FFFFFF', 
                    overflow: 'hidden', 
                    boxSizing: 'border-box', 
                    border: '1px solid #56667F', 
                    borderRadius: '4px', 
                    textAlign: 'right', 
                    lineHeight: '14px', 
                    fontSize: '12px', 
                    fontFeatureSettings: 'normal', 
                    textSizeAdjust: '100%', 
                    boxShadow: 'inset 0 -20px 0 0 #56667F',
                    padding: '1px',
                    padding: '0px', 
                    margin: '0px', 
                    width: '100%'
                    }}>
                    <div style={{
                        height: '540px', 
                        padding: '0px', 
                        margin: '0px', 
                        width: '100%',
                        }}>
                        <iframe src="https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=859&pref_coin_id=1505" 
                            width="100%" 
                            height="536px" 
                            scrolling="auto" 
                            marginwidth="0" 
                            marginheight="0" 
                            frameborder="0" 
                            border="0" 
                            style={{
                                border: 0,
                                margin: 0,
                                padding: 0,
                                lineheight: '14px',
                            }}></iframe>
                    </div>
                    <div style={{
                        color: '#FFFFFF', 
                        lineHeight: '14px', 
                        fontWeight: '400', 
                        fontSize: '11px', 
                        boxSizing: 'border-box', 
                        padding: '2px 6px', 
                        width: '100%', 
                        fontFamily: 'Verdana, Tahoma, Arial, sans-serif',
                    }}>
                        <a href="https://coinlib.io" target="_blank" style={{
                            fontWeight: '500', 
                            color: '#FFFFFF', 
                            textDecoration: 'none', 
                            fontSize: '11px'
                    }}>Cryptocurrency Prices</a>&nbsp;by Coinlib</div>
                </div>
                <div className="total-earnings"
                    style={{
                        background: 'white',
                        textAlign: 'center',
                        padding: '0.5rem',
                        margin: '0.5rem auto',
                    }}      
                    >
                    <h3>TOTAL INVESTED TODAY:</h3>   
                    <h1>{ invested } $</h1>
                    <h3>TOTAL EARNING TODAY:</h3>
                    <h1>{ earned } $</h1>
                </div>
            </div>
        </>
    );
}

export default Admin;