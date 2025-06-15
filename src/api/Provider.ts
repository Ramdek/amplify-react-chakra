import { Schema } from "../../amplify/data/resource";
import HouseLocation from "./HouseLocation";

type ProviderModel = Schema["Provider"]["type"];

class Provider implements Actor {

  // Amplify api client
  #client;
  #houseLocationClient;

  constructor(client: any, houseLocationClient: HouseLocation) {
    this.#client = client;
    this.#houseLocationClient = houseLocationClient;
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

    return new Promise<void>(async (res, rej) => {

      const userId = provider.userId === "" ? provider.id : provider.userId;
      const userUpdatedId = associatedUserName === "" ? provider.id : associatedUserName;

      this.#client.update({ id: provider.id, userId: associatedUserName });

      const houses = await this.#houseLocationClient.listHouses(provider.id);
      houses.forEach((house: any) => {

        this.#houseLocationClient.updateProvider(house, userId, userUpdatedId);
      });

      res();

    })
  }
}

export default Provider;