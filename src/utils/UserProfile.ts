import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

const UserProfile = (function() {

  let id: string = "";
  let full_name: string = "";
  let id_loaded: boolean = false;

  const getId = function() {
    return id;
  };

  const retrieveId = async function(isProvider: boolean) {

    let fetch;
    
    if (isProvider) {
      fetch = await client.models.Provider.list({
        filter: {
          userId: { eq : full_name }
        }
      });
    } else {
      fetch = await client.models.Consumer.list({
        filter: {
          userId: { eq : full_name }
        }
      });
    }

    if (fetch?.data[0] != undefined) {
      id = fetch?.data[0].id;
    }
    id_loaded = true;
  };

  const waitIdLoaded = () => {

    const poll = (res: Function) => {
      if (id_loaded) res();
      else setTimeout((_: any) => poll(res), 200);
    }

    return new Promise(poll);
  }

  const getName = function() {
    return full_name;
  };

  const setCredentials = function(accessToken: { payload: { sub: string; username: string; }; }, groups: Array<String>) {

    full_name = accessToken.payload.username as string;
    retrieveId(groups!= null && groups.includes('PROVIDERS'));
  };

  return {
    getId: getId,
    getName: getName,
    setCredentials: setCredentials,
    waitIdLoaded: waitIdLoaded
  }

})();

export default UserProfile;