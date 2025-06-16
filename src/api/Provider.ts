import { Schema } from "../../amplify/data/resource";
import ActorClient from "./Actor";
import ClientFactory from "./clientFactory";

type ProviderModel = Schema["Provider"]["type"];

class ProviderClient implements ActorClient {

  // Amplify api client
  #client;
  #clientFactory;

  constructor(client: any, clientFactory: ClientFactory) {
    this.#client = client;
    this.#clientFactory = clientFactory;
  }

  getType() {
    return "Provider";
  }

  create(providerName: string) {
    this.#client.create({ name: providerName });
  }

  delete(id: string) {
    this.#client.delete({ id });
  }

  subscribe(subscribeCallback: Function) {
    this.#client.observeQuery().subscribe({
      next: (data: any) => subscribeCallback(data),
    });
  }

  updateAssociatedUser(provider: ProviderModel, associatedUserName: string) {

    const houseLocationClient = this.#clientFactory.createHouseLocationClient();
    const consumptionClient = this.#clientFactory.createConsumptionClient();

    return new Promise<void>(async (res) => {

      const userUpdatedId = associatedUserName === "" ? provider.id : associatedUserName;

      this.#client.update({ id: provider.id, userId: associatedUserName });

      const houses = await houseLocationClient.listHouses(provider.id);
      houses.forEach(async (house: any) => {

        const consumptions = await consumptionClient.listProviderConsumptions(house.id);
        houseLocationClient.updateProvider(house, userUpdatedId);
        consumptions.forEach((consumption: any) => {
  
          consumptionClient.updateProvider(consumption, userUpdatedId);
        });
      });

      res();

    })
  }
}

export default ProviderClient;