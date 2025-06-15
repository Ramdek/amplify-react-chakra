# Provider/Consumer app

This repository contains a small AWS Amplify React+Vite app.  
The repo is based on [aws-samples/amplify-vite-react-template](https://github.com/aws-samples/amplify-vite-react-template).

The main goal of this application is to get familiar with the technologies above with a simple use case involving many-to-many relationships.

## Overview

This application offers three different roles : Admin, Provider and Consumer.

### Admin

The admin can assign Cognito user *(with usernames)* to internal application users with roles Provider or Consumer.  
This action is made through the Admin page. The admin can also perform Provider and Consumer actions.

The Admin can see every location, consumption whereas other user are restricted to their context.

### Provider

A provider can create multiple location and assign internal Consumer user to its locations *(multiple times)*.  
He can also provide Consumer with Credits.

### Consumer

A Consumer can spare credits into either Red, Green or Blue consumptions.  
Consumptions are then reported on the same page.

## Todo

Here are a couple of upgrades that could be made :
- **Refactor Backend Data model authorizations :** The model stores allowed users and owners in specific fields.  
`owner()` authorization should be used instead of `ownerDefinedIn('providerId')` field. I did not find a way to change an item ownership. which is restrains user from seeing created location when it is created by admin.  
Thus `providerId` could allow for multiple provider account over the same Locations.  
Other authorisations are also too open.
- **Input field check :** Control input fields formats *(for instance, user tag in should be 4 chars max in providers tab)*.

## License

This repository was created using [aws-samples/amplify-vite-react-template](https://github.com/aws-samples/amplify-vite-react-template).  
Thererfore, the content from initial commit is licensed under the MIT-0 License. See the [template repo LICENSE](LICENSE-AM) file.

The content created on top of the template is under [GPL v3 LICENSE](LICENSE).