import { Schema } from "../../amplify/data/resource";
import Consumer from "./Consumer";

type ConsumptionModel = Schema["Consumption"]["type"];

class ConsumptionClient {

  // Amplify api client
  #client;
  #consumerClient;

  constructor(client: any, consumerClient: Consumer) {
    this.#client = client;
    this.#consumerClient = consumerClient;
  }

  async get(id: string) {
    const { data: consumption } = await this.#client.get({
      id
    });

    return consumption;
  }

  async create(houseLocationId: string, providerUserId: string, consumerName: string, consumerTag: string) {

    const consumer = await this.#consumerClient.retrieveWithUserAndTag(consumerName, consumerTag);

    console.log(consumer.id);
    console.log(consumer.userId);

    return this.#client.create({
        availableCredits : 0,
        consumedRed : 0,
        consumedGreen : 0,
        consumedBlue : 0,
        providerUserId: providerUserId,
        consumerUserId: consumer.userId,
        providerId: houseLocationId,
        consumerId: consumer.id
    });
  }

  delete(id: string) {
    console.log(id)
    this.#client.delete({ id });
  }

  subscribeWithHouseLocationId(houseLocationId:string, subscribeCallback: Function) {
    this.#client.observeQuery({
      filter: {
        providerId: {
          eq: houseLocationId,
        },
      },
    }).subscribe({
      next: (data: any) => subscribeCallback(data),
    });
  }

  // Should be used by restriced user
  subscribeWithConsumerId(consumerId: string, subscribeCallback: Function) {
    this.#client.observeQuery({
      filter: {
        consumerId: {
          eq: consumerId,
        },
      },
    }).subscribe({
      next: (data: any) => subscribeCallback(data),
    });
  }

  async getConsumer(consumption: Schema['Consumption']['type']) {
    return this.#consumerClient.get(consumption.consumerId as string);
  }

  async updateCredits(id: string , amount: number) {
    this.#client.update({ id: id, availableCredits: amount });
  }

  async addConsumption(id: string , color: string, amount: number) {

    const { data: consumption } = await this.#client.get({ id: id });

    switch(color) {

        case 'red':
            this.#client.update({ id: id, consumedRed: (consumption.consumedRed + amount) });
            break;

        case 'green':
            this.#client.update({ id: id, consumedGreen: (consumption.consumedGreen + amount) });
            break;

        case 'blue':
            this.#client.update({ id: id, consumedBlue: (consumption.consumedBlue + amount) });
            break;
    }
  }

  async listConsumerConsumptions(consumerId: string) {
    const { data: houses } = await this.#client.list({
      filter: {
        consumerId: { eq: consumerId }
      }
    });

    return houses
  }

  async listProviderConsumptions(providerId: string) {
    const { data: houses } = await this.#client.list({
      filter: {
        providerId: { eq: providerId }
      }
    });

    return houses
  }

  updateConsumer(consumption: ConsumptionModel, userUpdatedId: string) {

    this.#client.update({ id: consumption.id, consumerUserId: userUpdatedId })
  }

  updateProvider(consumption: ConsumptionModel, userUpdatedId: string) {

    this.#client.update({ id: consumption.id, providerUserId: userUpdatedId })
  }
}

export default ConsumptionClient;