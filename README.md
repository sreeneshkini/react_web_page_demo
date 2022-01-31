# Sample React App with Live Preview

## **Packages :**

1. &quot;@contentstack/live-preview-utils&quot;: &quot;^1.0.0&quot;
2. &quot;@contentstack/utils&quot;: &quot;^1.1.0&quot;
3. &quot;contentstack&quot;: &quot;^3.14.0&quot;

## **Prerequisites :**

1. Contentstack account
2. Stack Access
3. Management Token

## **Steps to setup the User Website :**

1. Generate a management token for configuration.
2. Update Contentstack delivery SDK in sdk/entry.js (use eu-api.contentstack.com for EU )

```
//sdk/entry.js
const Stack = contentstack.Stack({
    api_key: "api_key",
    delivery_token: "delivery_token",
    environment: "environment",
    region:  "us"|| "eu",
    live_preview: {
        enable: true,
        management_token: "managemnt_token",
        host: "	",
    },
});
Stack.setHost("api.contentstack.io");
//set REACT_APP_CUSTOM_HOST in env
```

3. Install and Initialize the Live Preview Utils SDK

```
npm install @contentstack/live-preview-utils
```

After, installing the Live Preview Utils SDK ,import the sdk into sdk/entry.js

```
//sdk/entry.js
import ContentstackLivePreview from "@contentstack/live-preview-utils";
ContentstackLivePreview.init(Stack);
```

Here, we are passing our Stack that we created in step 2.
ContentstackLivePreview has a onEntryChangemethod. So we, export OnEntryChange method like this,

```
//sdk/entry.js
export const onEntryChange = ContentstackLivePreview.onEntryChange;
```

4. In the pages.index.jsx

We have created a fetchData( ) function , now inside the componentDidMount() , we pass the fetchData( ) function against theonEntryChange()method.

```
import Stack, { onEntryChange } from "../sdk/entry";
 async fetchData() {
   try {
     const result = await Stack.getEntryByUrl(
       "page",
       this.props.location.pathname,
       ["page_components.from_blog.featured_blogs"]
     );
     const header = await Stack.getEntry(
       "header",
       "navigation_menu.page_reference"
     );
     const footer = await Stack.getEntry("footer");
     this.setState({
       entry: result[0],
       header: header[0][0],
       footer: footer[0][0],
       error: { errorStatus: false },
     });
   } catch (error) {
     this.setState({
       error: { errorStatus: true, errorCode: 404, errorData: error },
     });
   }
 }
 
 componentDidMount() {
   onEntryChange(this.fetchData);
 }
```

5. Update Stack Settings

- Go to Settings.
- Create a new environment if there are no existing environments in your stack.
- Add your hosted website URL as the base URL for the environment created.
- Navigate to the Live Preview section under stack&#39;s &quot;Settings&quot;.
- Select the Enable Live Preview checkbox.

6. Live Editing for Entries

For Live Editing we need to add Data-clsp, for that we are going to install the @contentstack/utils package.

```
npm install @contentstack/utils
```

After installing the package we need to import the Contentstack CSS module. For our edit tags, In src/index.jsimport CSS Module like this,

```
//src/index.js
import "@contentstack/live-preview-utils/dist/main.css";
```

Live Preview requires the stack API key and host URL to perform appropriate redirection to the relevant stack.

```
//sdk/entry.js
const Stack = contentstack.Stack({
    live_preview: {
        stackDetails: {
            apiKey: process.env.REACT_APP_APIKEY,
        },
        clientUrlParams: {
            protocol: "https",
            host: "app.contentstack.com",
            port: 443,
        },
    },
});
```

'contentstack/utils' Package give as addEditableTags() method, import package like this,

```
//pages/index.jsx      
import { addEditableTags } from "@contentstack/utils";
 
 async fetchData() {
   try {
     addEditableTags(result[0], "page", true);
     addEditableTags(header[0][0], "header", true);
     addEditableTags(footer[0][0], "footer", true);
 
  
   } catch (error) {
     this.setState({
       error: { errorStatus: true, errorCode: 404, errorData: error },
     });
   }
 }
 
 componentDidMount() {
   onEntryChange(this.fetchData);
 }

```

Configure live editing for each webpage, In the front-end HTML code of the website, pass the dollar sign ($) before the last field in the field depth hierarchy,

eg : {...banner.$?.banner\_title }

```
//components/hero-banner.js
import React from "react";
 
export default function HeroBanner(props) {
 const banner = props.hero_banner;
 
 return (
     {banner.banner_image ? (
       <img
         {...banner.banner_image.$?.url}
         alt={banner.banner_image.filename}
         src={banner.banner_image.url}
       />
     ) : (
       ""
     )}
   </div>
 );}

```
