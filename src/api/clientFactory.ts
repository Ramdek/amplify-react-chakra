import Consumer from "./Consumer";
import ConsumptionClient from "./Consumption";
import HouseLocation from "./HouseLocation";
import Provider from "./Provider";

class ClientFactory {

    // Amplify api client
    #client;

    constructor(client: any) {
        this.#client = client;
    }

    createProviderClient(): Provider {
        return new Provider(this.#client.models.Provider, new ClientFactory(this.#client));
    }

    createConsumerClient(): Consumer {
        return new Consumer(this.#client.models.Consumer, new ClientFactory(this.#client));
    }

    createHouseLocationClient(): HouseLocation {
        return new HouseLocation(this.#client.models.HouseLocation);
    }

    createConsumptionClient(): ConsumptionClient {
        return new ConsumptionClient(this.#client.models.Consumption, this.createConsumerClient());
    }
}

export default ClientFactory;