import Consumer from "./Consumer";
import HouseLocation from "./HouseLocation";
import Provider from "./Provider";

class ClientFactory {

    // Amplify api client
    #client;

    constructor(client: any) {
        this.#client = client;
    }

    createProviderClient() {
        return new Provider(this.#client.models.Provider);
    }

    createConsumerClient() {
        return new Consumer(this.#client.models.Consumer);
    }

    createHouseLocationClient() {
        return new HouseLocation(this.#client.models.HouseLocation);
    }
}

export default ClientFactory;