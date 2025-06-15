import { Schema } from "../../amplify/data/resource";
import ActorClient from "./Actor";
import ClientFactory from "./clientFactory";

type ConsumerModel = Schema["Consumer"]["type"];

class ConsumerClient implements ActorClient {

  // Amplify api client
  #client;
  #clientFactory;

  constructor(client: any, clientFactory: ClientFactory) {
    this.#client = client;
    this.#clientFactory = clientFactory;
  }

  getType() {
    return "Consumer";
  }

  async get(id: string) {
    const { data: consumer } = await this.#client.get({
      id
    });

    return consumer
  }

  create(consumerName: string) {
    this.#client.create({ name: consumerName });
  }

  delete(id: string) {
    this.#client.delete({ id });
  }

  async retrieveWithUserAndTag(user: string, tag: string) {
    const { data: consumer } = await this.#client.list({
      filter: {
        and: [
          {
            name: { eq: user }
          },
          {
            id: { beginsWith: tag }
          }
        ]
      }
    });

    return consumer.length > 0 ? consumer[0] : null;
  }

  subscribe(subscribeCallback: Function) {
    this.#client.observeQuery().subscribe({
      next: (data: any) => subscribeCallback(data),
    });
  }

  updateAssociatedUser(consumer: ConsumerModel, associatedUserName: string) {

    const consumptionClient = this.#clientFactory.createConsumptionClient();

    return new Promise<void>(async (res) => {

      const userUpdatedId = associatedUserName === "" ? consumer.id : associatedUserName;

      this.#client.update({ id: consumer.id, userId: associatedUserName });

      const consumptions = await consumptionClient.listConsumptions(consumer.id);
      consumptions.forEach((consumption: any) => {

        consumptionClient.updateProvider(consumption, userUpdatedId);
      });

      res();

    })
  }
}

export default ConsumerClient;