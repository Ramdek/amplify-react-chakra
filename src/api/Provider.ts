import { Schema } from "../../amplify/data/resource";
import HouseLocation from "./HouseLocation";

type ProviderModel = Schema["Provider"]["type"];

class Provider implements Actor {

  // Amplify api client
  #client;

  constructor(client: any) {
    this.#client = client;
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
      next: (data) => subscribeCallback(data),
    });
  }

  updateAssociatedUser(provider: ProviderModel, associatedUserName: string) {

    return new Promise<void>(async (res, rej) => {

      const userId = provider.userId === "" ? provider.id : provider.userId;
      const userUpdatedId = associatedUserName === "" ? provider.id : associatedUserName;

      this.#client.update({ id: provider.id, userId: associatedUserName });

      const houses = await HouseLocation.listHouses(provider.id);
      houses.forEach(house => {

        HouseLocation.updateProvider(house, userId, userUpdatedId);
      });

      res();

    })
  }
}

export default Provider;