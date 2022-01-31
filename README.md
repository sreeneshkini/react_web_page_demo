# Build an Algolia Powered Search for Starter Website Blog Using React.js and Contentstack

React.js is a JavaScript library for dynamic websites with rich user interfaces.

Algolia is an AI-powered search and discovery platform allowing you to create cutting-edge customer experiences for your ecommerce website and mobile apps.

This guide will help you create an Algolia powered search for blogs page on a starter marketing website built using the React.js framework. It uses Contentstack’s Node.js SDK to store and deliver the website content from Contentstack.

Let’s look at the steps to create this Algolia powered search on a starter website using React.js, Algolia and Contentstack.
# Prerequisites
- Basic understanding of Algolia and React.js
- [Contentstack](https://app.contentstack.com/#!/login) and [Algolia](https://www.algolia.com/users/sign_in) account
- Node.js version 12 or later
- Contentstack CLI: **npm install -g @contentstack/cli**

**Note**: For this tutorial, we have assumed that you are familiar with Contentstack, Algolia and React.js. If not, please refer to the [Contentstack docs](https://www.contentstack.com/docs), [Algolia docs](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/) and [React](https://reactjs.org/docs/getting-started.html) docs for more details.
# Set Up Your App
This involves three parts:

1. Build a Starter Website Using React.js and Contentstack
1. Setting up Algolia Search using Contentstack Webhooks and AWS Lambda
1. Integrating Algolia Search for blogs page on a starter marketing website built using the React.js framework

## 1. Build a Starter Website Using React.js and Contentstack

To setup this, please refer our Contentstack doc about [Build a Starter Website Using React.js and Contentstack](https://www.contentstack.com/docs/developers/sample-apps/build-a-starter-website-using-react-js-and-contentstack)

## 2. Setting up Algolia Search using Contentstack Webhooks and AWS Lambda

To setup this, please refer our Contentstack doc about [Add Algolia Search to Contentstack-powered Websites using AWS Lambda](https://www.contentstack.com/docs/developers/how-to-guides/add-algolia-search-to-contentstack-powered-websites-using-aws-lambda/)

## 3. Integrating Algolia Search for blogs page on a starter marketing website built using the React.js framework

Once we have built the Starter Website and indexed the corresponding blog entries from required stack into Algolia using Contentstack webhooks and AWS Lambda, we integrate Algolia Search using [React InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/). Follow below steps to integrate:

1. Installing Algolia and React InstantSearch node packages
1. Importing AlgoliaSearch and React InstantSearch node packages
1. Initializing the algoliaSearch 
1. Integrating the InstantSearch
1. Including the Algolia Satellite Theme CSS file
1. Writing Custom CSS
1. Execution and Testing
## 1. Install Algolia and React InstantSearch node packages
Using NPM, install following node packages -

1) **npm install --save algoliasearch**
1) **npm install --save react-instantsearch-dom**
##

## 2. Importing AlgoliaSearch and React InstantSearch node packages
Import algoliasearch and react-instantsearch-dom packages with required components inside **src/pages/blog.jsx** file -

```
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Pagination, Configure, connectStateResults } from 'react-instantsearch-dom;
```

You can read more about the above components [here](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)  
## 3. Initialising the algoliaSearch
Initialise the algoliasearch using ‘**Application Id**’ and ‘**Admin API Key**’ inside the **render** method. Fetch these credentials from environment variables -

```
const searchClient = algoliasearch(process.env.REACT_APP_ALOGLIA_INDEX, process.env.REACT_APP_ALOGLIA_ADMIN_API_KEY);
```

You can get the **Application Id** and **Admin API Key** from the Algolia Dashboard Settings as follows - 

## 4. Integrating the InstantSearch
To integrate the InstantSearch, refactor the code as follows -

a) Remove the following code from the **render** method and keep it aside. We will be reusing the same code in the ‘Hits’ component later  -

b) Add the following InstantSearch and other components in the above space -

```
<InstantSearch searchClient={searchClient} indexName="dev_react_algolia_starter_app">
    <Configure hitsPerPage={4} />
    <div className='blog-container'>
        <div className='blog-column-left'>
	        <div className="search-input">
                <SearchBox />
           </div>
            <Results>
                <Hits hitComponent={Hit} />
                <div className="pagination-result">
                    <Pagination showFirst={false} showLast={false} totalPages={2} />
                </div>
            </Results>
        </div>
        <div className='blog-column-right'>
            {entry.page_components[1].widget && (
                <h2>{entry.page_components[1].widget.title_h2} </h2>
            )}
           <ArchiveRelative blogs={archived} />
        </div>
    </div>
</InstantSearch>
```
We are using the InstantSearch Component along with Configure, SearchBox, Results, Hits and Pagination components as follows -

1) **InstantSearch** - This component takes ‘searchClient’ that we initialised earlier, along with the ‘indexName’ attribute which consumes the index name as **dev\_react\_algolia\_starter\_app**, which we created in Algolia Dashboard as follows -

1) **Configure** - This component configures the results per page using attribute ‘hitsPerPage’
1) **SearchBox** - This component creates a Search box which can be used for searching results
1) **Hits** - Results component takes Hits component which uses ‘hitComponent’ attribute to pass data and return results
1) **Pagination** - This component provides pagination functionality for the results fetched

You can read more about above components [here](https://www.algolia.com/doc/api-reference/widgets/instantsearch/react/) - 

c) Create ‘Hits’ component with the previous code that we had removed and kept aside for reuse, with following changes -

```
function Hit(props) {
    return (
        <div className='blog-list'>
            {props.hit.featured_image && (
                <Link to={props.hit.url}>
                    <img
                    alt='blog img'
                    className='blog-list-img'
                    src={props.hit.featured_image.url}
                />
                </Link>
            )}
            <div className='blog-content'>
                {props.hit.title && (
                    <Link to={props.hit.url}>
                        <h3>{props.hit.title}</h3>
                    </Link>
                )}
                <p>
                 {moment(props.hit.date).format('ddd, MMM D YYYY')},{' '}
                 <strong>{props.hit.author[0].title}</strong>
                </p>
                { props.hit.body && parse(props.hit.body.slice(0, 300)) }
                {props.hit.url ? (
                    <Link to={props.hit.url}>
                        <span>{'Read more -->'}</span>
                    </Link>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
}
```

**Hits component** structures the data that we want to display on the Blogs page. The result is consumed via **props.hit**

d) Create ‘Results’ component as follows -

```
const Results = connectStateResults(
    ({ searchState, searchResults, children }) =>
    searchResults && searchResults.nbHits !== 0 ? (
        children
    ) : (
        <div>No results have been found for &apos;{searchState.query}&apos;.</div>
    )
);
```

**Results component** uses Algolia’s conditional display functionality which makes use of **connectStateResults** method to return results else ‘No results Found’ if Hits is empty.

You can read more about above functionality [here](https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-display/react/) - 
## 5. Including the Algolia Satellite Theme CSS file
Create a file **‘algolia\_search\_satellite\_theme.min.css’** inside the **src/styles** folder and include the Algolia Satellite Theme CSS from [here](https://cdn.jsdelivr.net/npm/instantsearch.css@7.4.5/themes/satellite-min.css). 

Import ‘**algolia\_search\_satellite\_theme.min.css**’ file inside **src/App.js** file as follows -

```
import './styles/algolia_search_satellite_theme.min.css'
```

You can read more about loading styles [here](https://www.algolia.com/doc/guides/building-search-ui/installation/js/#load-the-styles)
## 6. Writing Custom CSS
Add following custom CSS inside **src/styles/style.css** -

```
/* algolia instant search client start */
 
.ais-Hits-list li {
 list-style-type: none;
}
 
.search-input {
 width: 100%;
 position: relative;
 bottom: 20px;
}
 
.pagination-result {
 margin: 0px auto;
 position: relative;
 top: 30px;
}
 
/* algolia instant search client end */

```

## 7. Execution and Testing
We can now execute and test Algolia search on browser as follows -

1) **npm start**
1) **Visit ‘<http://localhost:3000/blog>’ to test**

Following shows how the Algolia Search looks like when we get the matching results -

Following shows how the Algolia Search looks like when we get no results -
