# **Next.js Notes** 🚀

## **What is Next.js?** 🧭

next js is a react framework for building web applications

## **Less Tooling Time** ⏱️

less tooling time
every aspect of frontend development has seen innovations to make developers lives easier
compiling,bundling,minifying,formating,deploying and more
next js takes care of all these aspects so developers can focus on building their applications
it provides a robust set of features and optimizations out of the box
such as server side rendering,static site generation,api routes,image optimization and more
these features help developers create high performance,scalable and seo friendly web applications with ease
next js also has a large and active community
which means developers can find plenty of resources,plugins and support when building their applications
next js is fullstack framework not just frontend

## **Vercel Note** 📌

vise president of vercel point that
moving from react + express plus webpack to a framework resulted in removing 20000+ lines of code and 30+ dependencies while improving hmr (hot module replacement) performance by 1.3s to 131ms

## **Built-in Features** 🧩

next js buitl in features
- server side rendering (SSR)
- static site generation (SSG)
- automatic code splitting
- optimal performance\
- enable faster initial load times by only loading the necessary code for each page
- improve seo
- enhance user experience

## **Why Choose Next.js over React Alone** 💡

why choose next js over react alone
convenience and productivity provided by nextjs
u can leverage the existing react features
automates many aspects of web development
therather than dealing with infrastructure and configuration
steamlining the devleopment process 
reducing the amount of code  you need to write
improve seo optimization
ssg and ssr send fully rendered html to the browser
better performance
this enable search engines to crawl and index your content more effectively
faster load times for users

## **SEO Importance** 🔎

seo for essential for discoverability
more people can find your application through search engines
better user experience
increased trust and credibility

## **Releases** 🗓️

7+ releases of next js since its initial launch in 2016
each release brings new features,improvements and optimizations

## **Core Advantages & Tooling** 🛠️

seamless file based routing system
efficient code splitting
image and font optimization
hmr (hot module replacement)
api routes for building backend functionality
built in css and sass support
css modules
data fetching methods
error handling and reporting
metadata management
internationalization (i18n) support
typescript support

## **Who Uses Next.js** 🏢

the big tech companies using next js
- netflix
- twitch
- github
- hulu
- nike
- uber
- tiktok

## **Request / Response Flow** 🔁

client send req to server
server process req and send back fully rendered html
browser receives html and displays content to user
this content inclues initial content fetched data and react components marked up as html
it render immediately without waiting for js to load
the server still sends the js bundle to the browser as per the uses 

## **Hydration** 💧

hydrationprocess
once the js loads react takes over and makes the page interactive
this approach improves performance and seo
faster initial load times

## **Client vs Server Components** ⚖️

clientside vs serverside rendering where and when to use each

every component create default it will be server component in next js
react server components
allow developers to build components that run on the server
these components can fetch data securely
reduce the amount of js sent to the client
directly access server resources like databases and file systems

when there is interaction then need to change to client component
to do that add "use client" directive at the top of the file 

server componets only render on the server side
while client components prerender on the server but also run on the client side

serverside prerendering means the component is rendered on the server before being sent to the client

link :https://nextjs.org/docs/app/getting-started/server-and-client-components#when-to-use-server-and-client-components

## **Routing (File-based)** 🧭

next js uses filebased routing system

create folder named app in the root directory
each file inside app folder represents a route in the application
for example create a file named page.tsx inside app folder
this file will automatically be mapped to the root route (/) of the application
create a folder named about inside app folder
inside about folder create a file named page.tsx
this file will be mapped to the /about route of the application

## **Layouts** 🏗️

layout.tsx file
used to define a common layout for multiple pages
for example create a layout.tsx file inside app folder
this layout will be applied to all pages inside the app folder
create a layout.tsx file inside about folder
this layout will be applied only to pages inside the about folder
this allows for nested layouts and better organization of the application structure

## **Nested Routes** 📂

nested routes
create a folder named blog inside app folder
inside blog folder create a file named page.tsx
this file will be mapped to the /blog route of the application
create a folder named post inside blog folder
inside post folder create a file named page.tsx
this file will be mapped to the /blog/post route of the application
this demonstrates how nested folders create nested routes in the application

## **Dynamic Routes** 🔀

dynamic routes
create a folder named product inside app folder
inside product folder create a file named [id].tsx
this file will be mapped to dynamic routes like /product/1 or /product/abc
the [id] syntax indicates that this part of the route is dynamic and can accept any value
inside [id].tsx file use useRouter hook from next/navigation to access the dynamic parameter
```tsx
import { useRouter } from 'next/navigation';
const router = useRouter();
const { id } = router.query;
```
this allows for creating pages that can handle different data based on the dynamic parameter in the route
this file will automatically be mapped to the root route (/) of the application
create a folder named about inside app folder
inside about folder create a file named page.tsx
this file will be mapped to the /about route of the application

## **Slug-based Routing** 📝

slug based routing
create a folder named blog inside app folder
inside blog folder create a file named [slug].tsx
this file will be mapped to dynamic routes like /blog/my-first-post or /blog/nextjs-tutorial
the [slug] syntax indicates that this part of the route is dynamic and can accept any value
inside [slug].tsx file use useRouter hook from next/navigation to access the dynamic parameter
```tsx
import { useRouter } from 'next/navigation';
const router = useRouter();
const { slug } = router.query;
```
this allows for creating pages that can handle different data based on the dynamic parameter in the route
this is particularly useful for blog posts,articles or any content that is identified by a unique slug
this demonstrates how nested folders create nested routes in the application
you can extract from parameters without useRouter in server components
```tsx
export default function Page({params}:{params:{slug:string}}){
  return <h1>Blog Post: {params.slug}</h1>
}
```

## **Layouts (again)** 🧩

layouts
create a layout.tsx file inside app folder
this layout will be applied to all pages inside the app folder
create a layout.tsx file inside about folder
this layout will be applied only to pages inside the about folder
this allows for nested layouts and better organization of the application structure

## **Route Groups** 🗂️

route groups
used to organize routes without affecting the url structure
create a folder named (admin) inside app folder
inside (admin) folder create a file named page.tsx
this file will be mapped to the /admin route of the application
the parentheses syntax indicates that this folder is a route group and will not affect the url structure
this is useful for grouping related routes together for better organization
for example admin routes,user routes etc
if you create (about) folder inside app folder
and inside (about) folder create a folder named team
inside team folder create a file named page.tsx
this file will be mapped to the /team route of the application

## **Error Handling** ⚠️

error handling
create a file named error.tsx inside app folder
this file will be used to handle errors that occur in any page inside the app folder
create a file named error.tsx inside about folder
this file will be used to handle errors that occur in any page inside the about folder
this allows for nested error handling and better organization of the application structure

use the default code snippets below to complete the files
https://nextjs.org/docs/app/getting-started/error-handling for error handling

you can create a global-error.tsx file inside app folder
this file will be used to handle errors that occur globally in the application

the closest error.tsx or global-error.tsx file will be used to handle the error 
priority is given to the closest error.tsx file in the folder structure

## **Loading UIs** ⏳

loading uis
create a file named loading.tsx inside app folder
this file will be used to display a loading state for any page inside the app folder
create a file named loading.tsx inside about folder
this file will be used to display a loading state for any page inside the about folder
this allows for nested loading states and better organization of the application structure

## **Data Fetching** 📡

Data Fetching
there are different ways to fetch data in next js app directory

traditional way is using useEffect hook in client components
tehre is better alternative in next js app directory

u can fetch data directly in server components
this allows for fetching data securely on the server side
reduces the amount of js sent to the client
improves performance by fetching data before rendering the component
hmr (hot module replacement) is cached in server components
this means that when u make changes to the component
only the changed parts are reloaded
rather than reloading the entire component
this results in faster development iterations and improved productivity

benefits of server side fetching
- improves initial load times
- fcp (first contentful paint) is faster
- in client side fetching
- user seen an empty or loading state while data is being fetched
- better seo for ssr
- ssr fetching logic on the server closer to the database or api
- automatic request deduplication
- next js automatically deduplicates identical requests made during the same rendering cycle
- this means that if multiple components request the same data
- next js will only make a single request to the server
- reducing unnecessary network traffic and improving performance
- improved security
- better protect sensitive data
- reduced network waterfall
- by fetching data on the server side
- reduce the number of sequential network requests made by the client
- this leads to faster load times and improved user experience
- you can server rendered direct database queries in server components

different server side strategies how and when to use them
static site generation (SSG)
a technique where pages are pre rendered at build time
the content is created when deploying the application not when user requests the page
you can use this approach for pages that have static content
like marketing pages,blogs or documentation sites etch
in many cases need to go for
incremental static regeneration (ISR)
a technique that allows you to update static pages after they have been built
with isr you can specify a revalidation interval for each page
after the interval expires the next request to the page will trigger a background regeneration of the page
this allows you to keep your static content up to date without rebuilding the entire site
you can use isr for pages that have frequently changing content
like news articles,product listings or user generated content etch
you can do this by two ways
first one is 
time based revalidation
specify a revalidation interval in seconds for each page
after the interval expires the next request to the page will trigger a background regeneration of the page
second one is
```ts
export const revalidate = 60; // revalidate every 60 seconds route segment config
const data = await fetch('https://api.example.com/data', { next: { revalidate: 60 } }); // revalidate every 60 seconds per request config
```
this allows you to set revalidation interval on a per request basis
on demand revalidation
manually trigger a revalidation of specific pages using an api route or webhook
this allows you to update pages in response to specific events
like content updates or user actions etch

server side rendering (SSR)
a technique where pages are rendered on the server for each request
the content is created when user requests the page
you can use this approach for pages that have dynamic content
like user dashboards,personalized content or real time data etch
to implement ssr in next js app directory
export const dynamic = 'force-dynamic';
this will ensure that the page is rendered on the server for each request

partial pre rendering (PPR)
a technique combine static site generation and server side rendering
with ppr you can pre render certain parts of a page at build time
while other parts are rendered on the server for each request
this allows you to optimize performance while still providing dynamic content
you can use ppr for pages that have a mix of static and dynamic content
like e commerce product pages with static product details and dynamic pricing or availability etch
export const dynamic = 'auto';
this will allow next js to automatically determine which parts of the page can be pre rendered
and which parts need to be rendered on the server for each request
u can also use
export const dynamic = 'error';
this will throw an error if the page contains any dynamic content
ensuring that the entire page is pre rendered at build time
this is useful for enforcing strict static site generation for certain pages
u can also use
export const dynamic = 'force-static';
this will ensure that the entire page is pre rendered at build time
regardless of any dynamic content
this is useful for optimizing performance for pages that can be fully pre rendered
like marketing pages or documentation sites etch
 # **Next.js Notes** 🚀

 ## **What is Next.js?** 🧭

 next js is a react framework for building web applications

 ## **Less Tooling Time** ⏱️

 less tooling time
 every aspect of frontend development has seen innovations to make developers lives easier
 compiling,bundling,minifying,formating,deploying and more
 next js takes care of all these aspects so developers can focus on building their applications
 it provides a robust set of features and optimizations out of the box
 such as server side rendering,static site generation,api routes,image optimization and more
 these features help developers create high performance,scalable and seo friendly web applications with ease
 next js also has a large and active community
 which means developers can find plenty of resources,plugins and support when building their applications
 next js is fullstack framework not just frontend

 ## **Vercel Note** 📌

 vise president of vercel point that
 moving from react + express plus webpack to a framework resulted in removing 20000+ lines of code and 30+ dependencies while improving hmr (hot module replacement) performance by 1.3s to 131ms

 ## **Built-in Features** 🧩

 next js buitl in features
 server side rendering (SSR)
 static site generation (SSG)
 automatic code splitting
 optimal performance\
 enable faster initial load times by only loading the necessary code for each page
 improve seo
 enhance user experience

 ## **Why Choose Next.js over React Alone** 💡

 why choose next js over react alone
 convenience and productivity provided by nextjs
 u can leverage the existing react features
 automates many aspects of web development
 therather than dealing with infrastructure and configuration
 steamlining the devleopment process 
 reducing the amount of code  you need to write
 improve seo optimization
 ssg and ssr send fully rendered html to the browser
 better performance
 this enable search engines to crawl and index your content more effectively
 faster load times for users

 ## **SEO Importance** 🔎

 seo for essential for discoverability
 more people can find your application through search engines
 better user experience
 increased trust and credibility

 ## **Releases** 🗓️

 7+ releases of next js since its initial launch in 2016
 each release brings new features,improvements and optimizations

 ## **Core Advantages & Tooling** 🛠️

 seamless file based routing system
 efficient code splitting
 image and font optimization
 hmr (hot module replacement)
 api routes for building backend functionality
 built in css and sass support
 css modules
 data fetching methods
 error handling and reporting
 metadata management
 internationalization (i18n) support
 typescript support

 ## **Who Uses Next.js** 🏢

 the big tech companies using next js
 netflix
 twitch
 github
 hulu
 nike
 uber
 tiktok

 ## **Request / Response Flow** 🔁

 client send req to server
 server process req and send back fully rendered html
 browser receives html and displays content to user
 this content inclues initial content fetched data and react components marked up as html
 it render immediately without waiting for js to load
 the server still sends the js bundle to the browser as per the uses 

 ## **Hydration** 💧

 hydrationprocess
 once the js loads react takes over and makes the page interactive
 this approach improves performance and seo
 faster initial load times

 ## **Client vs Server Components** ⚖️

 clientside vs serverside rendering where and when to use each

 every component create default it will be server component in next js
 react server components
 allow developers to build components that run on the server
 these components can fetch data securely
 reduce the amount of js sent to the client
 directly access server resources like databases and file systems

 when there is interaction then need to change to client component
 to do that add "use client" directive at the top of the file 

 server componets only render on the server side
 while client components prerender on the server but also run on the client side

 serverside prerendering means the component is rendered on the server before being sent to the client

 link :https://nextjs.org/docs/app/getting-started/server-and-client-components#when-to-use-server-and-client-components

 ## **Routing (File-based)** 🧭

 next js uses filebased routing system

 create folder named app in the root directory
 each file inside app folder represents a route in the application
 for example create a file named page.tsx inside app folder
 this file will automatically be mapped to the root route (/) of the application
 create a folder named about inside app folder
 inside about folder create a file named page.tsx
 this file will be mapped to the /about route of the application

 ## **Layouts** 🏗️

 layout.tsx file
 used to define a common layout for multiple pages
 for example create a layout.tsx file inside app folder
 this layout will be applied to all pages inside the app folder
 create a layout.tsx file inside about folder
 this layout will be applied only to pages inside the about folder
 this allows for nested layouts and better organization of the application structure

 ## **Nested Routes** 📂

 nested routes
 create a folder named blog inside app folder
 inside blog folder create a file named page.tsx
 this file will be mapped to the /blog route of the application
 create a folder named post inside blog folder
 inside post folder create a file named page.tsx
 this file will be mapped to the /blog/post route of the application
 this demonstrates how nested folders create nested routes in the application

 ## **Dynamic Routes** 🔀

 dynamic routes
 create a folder named product inside app folder
 inside product folder create a file named [id].tsx
 this file will be mapped to dynamic routes like /product/1 or /product/abc
 the [id] syntax indicates that this part of the route is dynamic and can accept any value
 inside [id].tsx file use useRouter hook from next/navigation to access the dynamic parameter
 import { useRouter } from 'next/navigation';
 const router = useRouter();
 const { id } = router.query;
 this allows for creating pages that can handle different data based on the dynamic parameter in the route
 this file will automatically be mapped to the root route (/) of the application
 create a folder named about inside app folder
 inside about folder create a file named page.tsx
 this file will be mapped to the /about route of the application

 ## **Slug-based Routing** 📝

 slug based routing
 create a folder named blog inside app folder
 inside blog folder create a file named [slug].tsx
 this file will be mapped to dynamic routes like /blog/my-first-post or /blog/nextjs-tutorial
 the [slug] syntax indicates that this part of the route is dynamic and can accept any value
 inside [slug].tsx file use useRouter hook from next/navigation to access the dynamic parameter
 import { useRouter } from 'next/navigation';
 const router = useRouter();
 const { slug } = router.query;
 this allows for creating pages that can handle different data based on the dynamic parameter in the route
 this is particularly useful for blog posts,articles or any content that is identified by a unique slug
 this demonstrates how nested folders create nested routes in the application
 you can extract from parameters without useRouter in server components
 export default function Page({params}:{params:{slug:string}}){
   return <h1>Blog Post: {params.slug}</h1>
 }

 ## **Layouts (again)** 🧩

 layouts
 create a layout.tsx file inside app folder
 this layout will be applied to all pages inside the app folder
 create a layout.tsx file inside about folder
 this layout will be applied only to pages inside the about folder
 this allows for nested layouts and better organization of the application structure

 ## **Route Groups** 🗂️

 route groups
 used to organize routes without affecting the url structure
 create a folder named (admin) inside app folder
 inside (admin) folder create a file named page.tsx
 this file will be mapped to the /admin route of the application
 the parentheses syntax indicates that this folder is a route group and will not affect the url structure
 this is useful for grouping related routes together for better organization
 for example admin routes,user routes etc
 if you create (about) folder inside app folder
 and inside (about) folder create a folder named team
 inside team folder create a file named page.tsx
 this file will be mapped to the /team route of the application

 ## **Error Handling** ⚠️

 error handling
 create a file named error.tsx inside app folder
 this file will be used to handle errors that occur in any page inside the app folder
 create a file named error.tsx inside about folder
 this file will be used to handle errors that occur in any page inside the about folder
 this allows for nested error handling and better organization of the application structure

 use the default code snippets below to complete the files
 https://nextjs.org/docs/app/getting-started/error-handling for error handling

 you can create a global-error.tsx file inside app folder
 this file will be used to handle errors that occur globally in the application

 the closest error.tsx or global-error.tsx file will be used to handle the error 
 priority is given to the closest error.tsx file in the folder structure

 ## **Loading UIs** ⏳

 loading uis
 create a file named loading.tsx inside app folder
 this file will be used to display a loading state for any page inside the app folder
 create a file named loading.tsx inside about folder
 this file will be used to display a loading state for any page inside the about folder
 this allows for nested loading states and better organization of the application structure

 ## **Data Fetching** 📡

 Data Fetching
 there are different ways to fetch data in next js app directory

 traditional way is using useEffect hook in client components
 tehre is better alternative in next js app directory

 u can fetch data directly in server components
 this allows for fetching data securely on the server side
 reduces the amount of js sent to the client
 improves performance by fetching data before rendering the component
 hmr (hot module replacement) is cached in server components
 this means that when u make changes to the component
 only the changed parts are reloaded
 rather than reloading the entire component
 this results in faster development iterations and improved productivity

 benefits of server side fetching
 improves initial load times
 fcp (first contentful paint) is faster
 in client side fetching
 user seen an empty or loading state while data is being fetched
 better seo for ssr
 ssr fetching logic on the server closer to the database or api
 automatic request deduplication
 next js automatically deduplicates identical requests made during the same rendering cycle
 this means that if multiple components request the same data
 next js will only make a single request to the server
 reducing unnecessary network traffic and improving performance
 improved security
 better protect sensitive data
 reduced network waterfall
 by fetching data on the server side
 reduce the number of sequential network requests made by the client
 this leads to faster load times and improved user experience
 you can server rendered direct database queries in server components

 different server side strategies how and when to use them
 static site generation (SSG)
 a technique where pages are pre rendered at build time
 the content is created when deploying the application not when user requests the page
 you can use this approach for pages that have static content
 like marketing pages,blogs or documentation sites etch
 in many cases need to go for
 incremental static regeneration (ISR)
 a technique that allows you to update static pages after they have been built
 with isr you can specify a revalidation interval for each page
 after the interval expires the next request to the page will trigger a background regeneration of the page
 this allows you to keep your static content up to date without rebuilding the entire site
 you can use isr for pages that have frequently changing content
 like news articles,product listings or user generated content etch
 you can do this by two ways
 first one is 
 time based revalidation
 specify a revalidation interval in seconds for each page
 after the interval expires the next request to the page will trigger a background regeneration of the page
 second one is
 export const revalidate = 60; // revalidate every 60 seconds route segment config
 const data = await fetch('https://api.example.com/data', { next: { revalidate: 60 } }); // revalidate every 60 seconds per request config
 this allows you to set revalidation interval on a per request basis
 on demand revalidation
 manually trigger a revalidation of specific pages using an api route or webhook
 this allows you to update pages in response to specific events
 like content updates or user actions etch

 server side rendering (SSR)
 a technique where pages are rendered on the server for each request
 the content is created when user requests the page
 you can use this approach for pages that have dynamic content
 like user dashboards,personalized content or real time data etch
 to implement ssr in next js app directory
 export const dynamic = 'force-dynamic';
 this will ensure that the page is rendered on the server for each request

 partial pre rendering (PPR)
 a technique combine static site generation and server side rendering
 with ppr you can pre render certain parts of a page at build time
 while other parts are rendered on the server for each request
 this allows you to optimize performance while still providing dynamic content
 you can use ppr for pages that have a mix of static and dynamic content
 like e commerce product pages with static product details and dynamic pricing or availability etch
 export const dynamic = 'auto';
 this will allow next js to automatically determine which parts of the page can be pre rendered
 and which parts need to be rendered on the server for each request
 u can also use
 export const dynamic = 'error';
 this will throw an error if the page contains any dynamic content
 ensuring that the entire page is pre rendered at build time
 this is useful for enforcing strict static site generation for certain pages
 u can also use
 export const dynamic = 'force-static';
 this will ensure that the entire page is pre rendered at build time
 regardless of any dynamic content
 this is useful for optimizing performance for pages that can be fully pre rendered
 like marketing pages or documentation sites etch


## **API Routes** 🛣️

in next js app directory
create a folder named api inside app folder
inside api folder create files and folders to define your api endpoints
for example create a file named hello.ts inside api folder
this file will be mapped to the /api/hello endpoint of the application
inside hello.ts file export functions to handle different http methods
for example export an async function named GET to handle get requests
```ts
export async function GET(request: Request) {
  return new Response('Hello, Next.js API!');
}
```
<!-- 1 -->
this function will be called when a get request is made to the /api/hello endpoint
you can also export functions for other http methods like POST,PUT,DELETE etch
this allows you to build backend functionality directly within your next js application

api-->db.ts - books(folder)->routes.ts
create a file named db.ts inside api folder
this file will be used to define database connection and operations
create a folder named books inside api folder
inside books folder create a file named routes.ts
this file will be used to define api routes related to books
inside routes.ts file export functions to handle different http methods for book operations
for example export an async function named GET to handle get requests for books
/api/books --> get all books
/api/books/:id --> get book by id inside books foler [id].ts folder and create route.ts file to get book by id
/api/books --> POST create a new book
/api/books/:id --> PUT update book by id
/api/books/:id --> DELETE delete book by id
this structure allows you to organize your api routes and database operations in a modular way

## **SEO & Metadata Management**   📈
next js app directory provides built in support for managing metadata and improving seo
there is two way to handle metadat
1. config based
  all you have to do is creat js object in the layout or page file and export it as metadata
  ```ts
  export const metadata: Metadata = {
    title: "My Next.js App",
    description: "This is my awesome Next.js application.",
    keywords: ["Next.js", "React", "SEO", "Metadata"],
    authors: [{ name: "Ami" }],
    openGraph: {
      title: "My Next.js App",
      description: "This is my awesome Next.js application.",
      url: "https://www.my-nextjs-app.com",
      siteName: "My Next.js App",
      images: [
        {
          url: "https://www.my-nextjs-app.com/og-image.jpg",
          width: 800,
          height: 600,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
  ```
  higher level metadata defined in layout files will be inherited by nested pages and layouts
  you can also override specific metadata fields in nested pages and layouts as needed
  its static  metadata
  dynamic metadata
  for dynamic metadata you can create an async function named generateMetadata in your page or layout file

    ```ts
    export async function generateMetadata({ params }): Promise<Metadata> {
      const data = await fetchData(params.id);
      return {
        title: data.title,
        description: data.description,
        // other metadata fields
      };
    }
    ```
    this function will be called during the server side rendering process to fetch dynamic metadata based on the route parameters or other data sources

    2 file based metadata
    you can also define metadata using a dedicated metadata.ts file in your app directory
    you can pu t files like robot.txt,sitemap.xml etc in the app directory
    next js will automatically serve these files at the root of your application
     its about the files should be right named
     file based metadata have higher priority over config based metadata


     to add eslint and prettier support in next js app directory
     install the necessary packages
     ```bash
     npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
     ```
     standardjs.com/rules for eslint rules
     npm i eslint-config-standard-with-typescript --save-dev add end --legacy-peer-deps
     https://medium.com/@keshavkattel1998/setting-up-a-robust-next-js-e79b89e7d44e


     client and server paradigm

     how can we do that

     client means the device that u defer using. the device that send req to server and display the pages 
     refer the article vercel
     less code btter ux fetching data faster withthe nextjs 13 app router

     app director introudced for to resolve the issue
     not only pages component lever server side rendering

     we now have the option to choose where to render the specific component and instance

     tow type components
     server side components
     client side components

     the benefit of storing component on serverside we can save user browsers doing extra work for showing the js to display the component initial page fast

     server side rendering
     smaler js bundle size
     enhanced seo
     faster initial page load for better acessibility and user exp
     efficient utilization of server resources

     when to decide what to render wehre

     based on the component does
     if component needs user to interact with
     clicking buttons
     entering information in input fields
     triggering events
     using react hooks
     it should be client component

     if component doesnt require any user interaction
     fetch data from server
     display static content
     it should be server component

     next js doc provide table where to render which component
     
     all components default server components unless its specify

     server componetns are guarenteed to be only rendered on the server
     client component primarly rendered on the lcient side
     
     in next js when we use use client in a file all other module imported in that file including child server components are treated as aprt of the client module

     different strategies to display 

     rendering
     it a process of generating or creating the user interface from the code we werite react 18 and next js introduced different strategies to rtender an application believe it or not we can use multiple strategies within the same application to render it differently the god mode feature of nextjs although we dit talk about it a bit

     there are two environments where we can render the code
     client user browser
     server where we deploy

     client side
     renderign process = occurs on the users browser
     interactivity and loadtime = provides a dynamic and interactive user exp
     fetching and seo = smoother transition between the pages and real time data fetching
     load and performance = reduced server load and potential lower hosting costs as the clients browser is responsible for handling the rendering
     consistend and rendering = compatibility and performance depend on the users device configuratrion
     security = poterntial risk of resurity vulnerabilites such as corss site scription code inection data exposure

     server side
     rendering process  = happens on the server befor sending the page to th clients browser
     interactivityloadtime = provides a fully rendered html page to the client resulting in faster intitial page load time
     fetchingseo = fully rendered content enchancing search engine rankings ans social medika sharing previdews
     load perfor = poerforms well on any slower devuice as rendering is done on the server

    consistendrender = consistend rendering across any devices regardless of the configuration reducing the risk of compatibiltiy issues
    security = reduces the amoyutn of client side js code sent to users browser thus enhancing security by limiting potential vulnerabiliteis

    b2b domain use server side use
    once the compoilation process is complete which involves converting code from a highere level programming lang to a lower level represntatin our app goes through towo crucial phaswes build and run time

    build time 
    sereis of steps wh3ere we prepatre our application code for production involving the steps of code complilation bundling optimization

    buildtime or compile time is the thime of compiling code
    npm run dev its that commang that denrated the builld of our app containing all the necessary static files bundling optimization dependency resolution etc

    runtime it rferts to the ime period when the compiled application is actively exucuting and running involving the dynamic exec of application code and utilizxation system resouldce 

    run time is period when user run the application
    its about handling user intereation such a user input respondint to events to data processing suca s manipulating accessing data dn interating wioth external services or apis

    runtime environment a specific environment in which a program or application runs druing its execution
    it provides a set of libraries services or runtime componnets that support hte execution of the program

    the nodejs is a js runtime environment that allow us developers to run js code outside of the web browser
    similarly next js provides 2 different run time environments to exexute the app code

    the nodejs runtime 
    default runtime that has acess to all nodejs apis and ecosystyem

    the edge runtime 
    a light weight runtime base on web apis with supprt to a limited suster of nodejs api
    next js offers the flexibility of choosing the runtime you can do switch swiftly by changing one word

    rendering strategies
    three strategies for rendering on the server
    static site generation
    incremental site generation 
    ssr
     

     ssg = happen at build time on the server during the build process the content is genreated and converted into html css and js files it doesnt require server interaciton during runtime
     the generated static files can be hosted on content delivery network and then served to the client as is
     the result the rendered content is cached and reused on subsequen requestes leading to fast contendt delivery and less server load this minimal processing results in higher performance
     ex doc or blog and news websiteds article content are static once biult we can sip it as it is whwenever we want to update the contend we can rebuild it

     isg
     it allows us to update these static pages after we build them without needing to rebuild the entire site
     the ondemand generation of isr allows us to generate a specific page on demand or in response to a users request meaning a ceratin part of the websites or pages will be rendered at build time while other is genrated only when needed at run time
     reduces buld time and improve overall performance of the website
     with hybrid stratedgy we now have the flexiblity to manage content updates we can cache the static ocntent as welll as revalidate them if needed ssg for article detail isg for showing a list of articles


     when to use which
     will this page or content display the same info for each req
     yes - ssg

     no - does this page or content requre frequent information unpdates potentialy every  second
     - yes -ssr
     - no- isg
     

     using next-themes