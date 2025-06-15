interface ActorClient {
    getType: Function;
    create: Function;
    subscribe: Function;
    delete: Function;
    updateAssociatedUser: Function;
}

export default ActorClient;