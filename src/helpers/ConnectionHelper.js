import Payments from "../web3/payments";

class ConnectionHelper {
    
    constructor () {
        
        this.contractAddress = new Payments().contractAddress();
        this.contractABI = new Payments().contractABI();
        
    }
    
    async checkIsConnected (sesionData) {
        
        try {

            if (sesionData?.modal?.isConnected()) {
    
                let accounts; 
                
                if (sesionData.modal.selectedAddress) {

                    accounts = sesionData.modal.selectedAddress;

                } else {
                    
                    accounts = await sesionData.modal.requestAccounts();
                    accounts = accounts[0].addresses;

                }

                let contractSign = new sesionData.sesion.eth.Contract(this.contractABI, this.contractAddress);
                let walletAddress = Array.isArray(accounts) ? accounts[accounts.length - 1].address : accounts;
                
                return [true, contractSign, walletAddress];
    
            }
    
            return false;

        } catch (e) {
            
            console.log(e);
            return false;

        }

    }

}

export default ConnectionHelper;