# Xero App Setup

To install the Xero App, you must first create a Xero App in the xero developer website in the link below:

`https://developer.xero.com/app/manage/`

To create the App, just click the "New App" button, and fill the following details:

- **App Name** - The Name for your App (could be any name).
- **Integration type** - The type of integration (in our case, Web App).
- **Company or application URL** - Your company URL.
- **Redirect URI** - The Deskpro callback URL, found in the settings tab of the Xero installation page in Deskpro.

[![](/docs/assets/setup/xero_new_app.png)](/docs/assets/setup/xero_new_app.png)

After this you'll be redirected to your App in Xero. Click on the configuration tab on the left side of the screen, and on Deskpro Settings page, enter the following details:

- **Xero Client Id** - The Xero Client Id found on the created application page.
- **Xero Client Secret** - The Xero Client Secret found on the created application page, after clicking generate secret.

Now, just click on "Sign In" and you'll be taken to a page to grant access to some of the details that will be used in the Deskpro Xero App, and you just need to click "Allow access".

[![](/docs/assets/setup/auth_page.png)](/docs/assets/setup/auth_page.png)

Once you see an "Authorization Complete" page, you can go back to the Deskpro Xero App page to select the Tenant you'd like to use, click confirm, and install the app.

[![](/docs/assets/setup/select_tenant.png)](/docs/assets/setup/select_tenant.png)
