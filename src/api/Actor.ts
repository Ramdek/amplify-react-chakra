interface ActorClient {
    getType():  string;
    create: Function;
    subscribe: Function;
    delete: Function;
    updateAssociatedUser: Function;
}

export default ActorClient;