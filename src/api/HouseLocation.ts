import { Schema } from "../../amplify/data/resource";

type HouseLocationModel = Schema["HouseLocation"]["type"];

class HouseLocation {

  // Amplify api client
  #client;

  constructor(client: any) {
    this.#client = client;
  }

  create(houseName: string, providerId: string, providerName: string) {
    this.#client.create({ name: houseName, ownerId: providerId, userIds: [ providerName ] });
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
      next: (data) => subscribeCallback(data),
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

  updateProvider(houseLocation: HouseLocationModel, userId: string, userUpdatedId: string) {

    console.log(userId);
    console.log(`replace ${userId} in ${houseLocation.userIds} with ${ userUpdatedId }`);
    
    if (houseLocation.userIds == null) {
      houseLocation.userIds = [ userUpdatedId ];
    } else {
        
      const index = houseLocation.userIds.indexOf(userId);
      console.log(index)
      if (! index) {
      houseLocation.userIds[index] = userUpdatedId;
      } else {
      houseLocation.userIds.push(userUpdatedId);
      }
    }

    console.log(houseLocation.userIds);

    this.#client.update({ id: houseLocation.id, userIds: houseLocation.userIds })
  }
}

export default HouseLocation;