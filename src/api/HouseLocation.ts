import { Schema } from "../../amplify/data/resource";

type HouseLocationModel = Schema["HouseLocation"]["type"];

class HouseLocation {

  // Amplify api client
  #client;

  constructor(client: any) {
    this.#client = client;
  }

  create(houseName: string, providerId: string, providerName: string) {
    this.#client.create({ name: houseName, ownerId: providerId, providerId: providerName });
  }
  
  async get(id: string) {
    const { data: house } = await this.#client.get({
      id
    });

    return house;
  }

  delete(id: string) {
    this.#client.delete({ id });
  }

  subscribeWithProviderId(providerId:string, subscribeCallback: Function) {
    this.#client.observeQuery({
      filter: {
        ownerId: {
          eq: providerId,
        },
      },
    }).subscribe({
      next: (data: any) => subscribeCallback(data),
    });
  }

  async listHouses(ProviderId: string) {
    const { data: houses } = await this.#client.list({
      filter: {
        ownerId: { eq: ProviderId }
      }
    });

    return houses
  }

  updateProvider(houseLocation: HouseLocationModel, userUpdatedId: string) {

    this.#client.update({ id: houseLocation.id, providerId: userUpdatedId })
  }
}

export default HouseLocation;