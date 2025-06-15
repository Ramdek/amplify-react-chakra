import { Schema } from "../../amplify/data/resource";

type ConsumerModel = Schema["Consumer"]["type"];

class Consumer implements Actor {

  // Amplify api client
  #client;

  constructor(client: any) {
    this.#client = client;
  }

  getType() {
    return "Consumer";
  }

  create(consumerName: string) {
    this.#client.create({ name: consumerName });
  }

  delete(id: string) {
    this.#client.delete({ id });
  }

  subscribe(subscribeCallback: Function) {
    this.#client.observeQuery().subscribe({
      next: (data) => subscribeCallback(data),
    });
  }

  updateAssociatedUser(consumer: ConsumerModel, associatedUserName: string) {

    return new Promise<void>(async (res, rej) => {

      const userId = consumer.userId === "" ? consumer.id : consumer.userId;
      const userUpdatedId = associatedUserName === "" ? consumer.id : associatedUserName;

      this.#client.update({ id: consumer.id, userId: associatedUserName }),

      res();

    })
  }
}

export default Consumer;