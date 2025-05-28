import NetInfo from '@react-native-community/netinfo';
import LogManager from './LogManager';

export class NetworkManager {
    
    /**
     * check network connection before every api call
     * if network not available returns false with resolve
     * if network available returns true with resolve
     * if any issue to check network return false with resolve
     * @returns promise with boolean
     */
     isNetworkAvailable = async (): Promise<boolean> => {
     
        return new Promise((res) => {
            NetInfo.fetch()
                .then((state) => {
                    LogManager.debug('network state details ', state);
                    if (state.isConnected) res(true);
                    else res(false);
                })
                .catch((innerErr) => {
                    LogManager.error('network error details ', innerErr);
                    res(false);
                });
        });
    }
}

const networkManager = new NetworkManager();

export default networkManager;