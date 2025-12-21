# **Next.js Notes** 🚀

## **What Is Next.js?** 🧭

Next.js is a React framework for building web applications.

## **Less Tooling Time** ⏱️

Every aspect of frontend development has seen innovations to make developers’ lives easier: compiling, bundling, minifying, formatting, deploying, and more. Next.js takes care of these aspects so developers can focus on building their applications.

It provides a robust set of features and optimizations out of the box—such as server-side rendering (SSR), static site generation (SSG), API routes, image optimization, and more. These features help developers create high-performance, scalable, and SEO-friendly web applications with ease.

Next.js also has a large and active community, which means developers can find plenty of resources, plugins, and support when building applications. Next.js is a full-stack framework, not just frontend.

## **Vercel Note** 📌

The Vice President of Vercel pointed out that moving from React + Express + Webpack to a framework resulted in removing 20,000+ lines of code and 30+ dependencies while improving HMR (Hot Module Replacement) performance from 1.3s to 131ms.

## **Built-in Features** 🧩

- Server-side rendering (SSR)
- Static site generation (SSG)
- Automatic code splitting
- Optimal performance (faster initial load by loading only the necessary code per page)
- Improved SEO
- Enhanced user experience

## **Why Choose Next.js over React Alone** 💡

Convenience and productivity provided by Next.js let you leverage existing React features while automating many aspects of web development—rather than dealing with infrastructure and configuration—streamlining the development process and reducing the amount of code you need to write.

SSG and SSR send fully rendered HTML to the browser, which enables search engines to crawl and index your content more effectively and provides faster load times for users.

## **SEO Importance** 🔎

SEO is essential for discoverability. It helps more people find your application through search engines, improves user experience, and increases trust and credibility.

## **Releases** 🗓️

There have been 7+ releases of Next.js since its initial launch in 2016. Each release brings new features, improvements, and optimizations.

## **Core Advantages & Tooling** 🛠️

- Seamless file-based routing system
- Efficient code splitting
- Image and font optimization
- HMR (Hot Module Replacement)
- API routes for building backend functionality
- Built-in CSS and Sass support
- CSS Modules
- Data-fetching methods
- Error handling and reporting
- Metadata management
- Internationalization (i18n) support
- TypeScript support

## **Who Uses Next.js** 🏢

Big tech companies using Next.js include:
- Netflix
- Twitch
- GitHub
- Hulu
- Nike
- Uber
- TikTok

## **Request/Response Flow** 🔁

The client sends a request to the server. The server processes the request and sends back fully rendered HTML. The browser receives the HTML and displays content to the user immediately without waiting for JavaScript to load. This content includes initial content, fetched data, and React components marked up as HTML. The server still sends the JS bundle to the browser as needed.

## **Hydration** 💧

Once the JavaScript loads, React hydrates the page and makes it interactive. This approach improves performance and SEO, providing faster initial load times.

## **Client vs Server Components** ⚖️

In Next.js (App Router), components are server components by default. React Server Components allow developers to build components that run on the server, can fetch data securely, reduce the amount of JavaScript sent to the client, and directly access server resources like databases and file systems.

When there is user interaction, you need a client component. Add the `"use client"` directive at the top of the file to mark it as a client component.

Server components render only on the server side, while client components pre-render on the server and also run on the client side. Server-side pre-rendering means the component is rendered on the server before being sent to the client.

Link: https://nextjs.org/docs/app/getting-started/server-and-client-components#when-to-use-server-and-client-components

## **Routing (File-based)** 🧭

Next.js uses a file-based routing system.

- Create a folder named `app` in the root directory.
- Each file inside the `app` folder represents a route in the application.
- Example: create a file named `page.tsx` inside `app`. This file will automatically be mapped to the root route (`/`).
- Create a folder named `about` inside `app`. Inside `about`, create `page.tsx`. This file will be mapped to the `/about` route.

## **Layouts** 🏗️

Use `layout.tsx` to define common layouts for multiple pages.

- Create `layout.tsx` inside `app`. This layout applies to all pages inside `app`.
- Create `layout.tsx` inside `about`. This layout applies only to pages inside `about`.

This allows for nested layouts and better organization of the application structure.

## **Nested Routes** 📂

- Create a folder named `blog` inside `app` and add `page.tsx` → mapped to `/blog`.
- Create a folder named `post` inside `blog` and add `page.tsx` → mapped to `/blog/post`.

This demonstrates how nested folders create nested routes.

## **Dynamic Routes** 🔀

Create a folder named `product` inside `app`. Inside `product`, create a file named `[id].tsx`. This file will be mapped to dynamic routes like `/product/1` or `/product/abc`. The `[id]` syntax indicates that this part of the route is dynamic and can accept any value.

Example (legacy client-side access via `useRouter`):
```tsx
import { useRouter } from 'next/navigation';
const router = useRouter();
const id = (router as any)?.query?.id;
```

Example (server component params):
```tsx
export default function Page({ params }: { params: { id: string } }) {
  return <h1>Product: {params.id}</h1>;
}
```

## **Slug-based Routing** 📝

Create a folder named `blog` inside `app`. Inside `blog`, create a file named `[slug].tsx`. This file will be mapped to dynamic routes like `/blog/my-first-post` or `/blog/nextjs-tutorial`. The `[slug]` syntax indicates that this part of the route is dynamic and can accept any value.

Example (legacy client-side access via `useRouter`):
```tsx
import { useRouter } from 'next/navigation';
const router = useRouter();
const slug = (router as any)?.query?.slug;
```

You can extract parameters without `useRouter` in server components:
```tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>Blog Post: {params.slug}</h1>;
}
```

## **Route Groups** 🗂️

Route groups organize routes without affecting the URL structure.

- Create a folder named `(admin)` inside `app` and add `page.tsx` → mapped to `/admin`.
- Parentheses indicate a route group; it does not affect the URL.
- Useful for grouping related routes (e.g., admin routes, user routes).

Example: If you create `(about)` inside `app`, and inside `(about)` create `team/page.tsx`, it maps to `/team`.

## **Error Handling** ⚠️

Create `error.tsx` inside `app` to handle errors in any page inside `app`. Create `error.tsx` inside `about` to handle errors for pages inside `about`. This allows nested error handling and better organization.

Use the default code snippets below to complete the files:
https://nextjs.org/docs/app/getting-started/error-handling

You can create `global-error.tsx` inside `app` to handle errors globally. The closest `error.tsx` or `global-error.tsx` will handle the error; priority is given to the closest `error.tsx` in the folder structure.

## **Loading UIs** ⏳

Create `loading.tsx` inside `app` to display a loading state for any page inside `app`. Create `loading.tsx` inside `about` to display a loading state for pages inside `about`. This allows nested loading states and better organization.

## **Data Fetching** 📡

There are different ways to fetch data in the Next.js App Router.

Traditional way: using `useEffect` in client components. However, there is a better alternative: fetch data directly in server components.

Fetching on the server side allows for secure data access, reduces the amount of JavaScript sent to the client, and improves performance by fetching data before rendering the component. HMR (Hot Module Replacement) is cached in server components—when you make changes, only the changed parts are reloaded, resulting in faster development iterations.

Benefits of server-side fetching:
- Improves initial load times
- Faster FCP (First Contentful Paint)
- Avoids empty/loading states while data is being fetched client-side
- Better SEO for SSR
- Fetching logic is closer to the database or API
- Automatic request deduplication (Next.js deduplicates identical requests during the same rendering cycle)
- Reduced network traffic
- Improved security and better protection of sensitive data
- Reduced network waterfall (fewer sequential client requests)
- You can server-render direct database queries in server components

### **Server-side Strategies: How and When to Use Them**

**Static Site Generation (SSG):** Pre-renders at build time. Content is created during deployment, not per request. Use for static content (marketing pages, blogs, documentation).

**Incremental Static Regeneration (ISR):** Update static pages after they’ve been built. Specify a revalidation interval; after it expires, the next request triggers a background regeneration.

Two ways to use ISR:
- Time-based revalidation (route segment):
```ts
export const revalidate = 60; // revalidate every 60 seconds (route segment config)
```
- Per-request revalidation:
```ts
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 },
}); // revalidate every 60 seconds (per-request config)
```

**On-demand Revalidation:** Manually trigger revalidation of specific pages using an API route or webhook. Useful for content updates or user actions.

**Server-Side Rendering (SSR):** Render pages on the server for each request. Use for dynamic content (user dashboards, personalized content, real-time data).

Force SSR in App Router:
```ts
export const dynamic = 'force-dynamic';
```

**Partial Pre-rendering (PPR):** Combine SSG and SSR. Pre-render certain parts at build time, while other parts render on the server per request. Useful for pages with mixed static and dynamic content (e.g., e-commerce product pages).

Let Next.js auto-decide:
```ts
export const dynamic = 'auto';
```

Enforce errors for dynamic content:
```ts
export const dynamic = 'error';
```

Force full static pre-rendering:
```ts
export const dynamic = 'force-static';
```

## **API Routes** 🛣️

In the App Router, create a folder named `api` inside `app`. Inside `api`, create files and folders to define your API endpoints.

Example: `app/api/hello/route.ts` → mapped to `/api/hello`.

Handle HTTP methods by exporting functions:
```ts
export async function GET(request: Request) {
  return new Response('Hello, Next.js API!');
}
```

<!-- 1 --> This function is called when a GET request is made to the `/api/hello` endpoint. You can also export functions for other HTTP methods like `POST`, `PUT`, `DELETE`, etc. This allows you to build backend functionality directly within your Next.js application.

Example structure: `api -> db.ts`, `books (folder) -> routes.ts`

- Create `db.ts` inside `api` for database connections and operations.
- Create a folder `books` inside `api` and a file `routes.ts` inside it to define API routes related to books.
- Export functions to handle different HTTP methods for book operations:
  - `/api/books` → GET all books
  - `/api/books/:id` → GET book by ID (inside `books/[id]/route.ts`)
  - `/api/books` → POST create a new book
  - `/api/books/:id` → PUT update book by ID
  - `/api/books/:id` → DELETE delete book by ID

This structure organizes API routes and database operations in a modular way.

## **SEO & Metadata Management** 📈

The App Router provides built-in support for managing metadata and improving SEO.

1) **Config-based metadata**: Create a JS object in a layout or page and export it as `metadata`.
```ts
export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'This is my awesome Next.js application.',
  keywords: ['Next.js', 'React', 'SEO', 'Metadata'],
  authors: [{ name: 'Ami' }],
  openGraph: {
    title: 'My Next.js App',
    description: 'This is my awesome Next.js application.',
    url: 'https://www.my-nextjs-app.com',
    siteName: 'My Next.js App',
    images: [
      { url: 'https://www.my-nextjs-app.com/og-image.jpg', width: 800, height: 600 },
    ],
    locale: 'en_US',
    type: 'website',
  },
};
```

Higher-level metadata defined in layout files will be inherited by nested pages and layouts. You can override specific fields in nested pages and layouts as needed.

Static metadata and dynamic metadata:

For dynamic metadata, create `generateMetadata` in your page or layout file:
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
This runs during server-side rendering to fetch metadata based on route params or other data sources.

2) **File-based metadata**: Define metadata using a dedicated `metadata.ts` file in your `app` directory. You can put files like `robots.txt`, `sitemap.xml`, etc., in the `app` directory, and Next.js will serve them at the root. File-based metadata has higher priority over config-based metadata (ensure correct file names).

### **ESLint & Prettier Setup**

To add ESLint and Prettier support in the Next.js App Router, install the necessary packages:
```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
```
ESLint rules: https://standardjs.com/rules

If using `eslint-config-standard-with-typescript`, you may need `--legacy-peer-deps` due to peer requirements:
```bash
npm i eslint-config-standard-with-typescript --save-dev --legacy-peer-deps
```
Reference: https://medium.com/@keshavkattel1998/setting-up-a-robust-next-js-e79b89e7d44e

## **Client and Server Paradigm**

Client means the device the user uses—the device that sends requests to the server and displays pages.

See Vercel’s article: “Less code, better UX, fetching data faster with the Next.js 13 App Router”. The App Router was introduced to resolve issues and enable server-side rendering beyond the traditional Pages Router.

We can now choose where to render specific components and instances:

Two types of components:
- Server components
- Client components

Storing components on the server saves the browser from extra work to display JavaScript, leading to faster initial page loads.

Server-side rendering benefits:
- Smaller JS bundle size
- Enhanced SEO
- Faster initial page load → better accessibility and user experience
- Efficient utilization of server resources

### **Deciding Where to Render**

Base it on what the component does:
- If the component needs user interaction (clicking buttons, typing in inputs, triggering events, using React hooks), it should be a client component.
- If the component does not require user interaction (fetch data from server, display static content), it should be a server component.

By default, all components are server components unless specified. Server components are guaranteed to render only on the server. Client components primarily render on the client side.

In Next.js, when you use `"use client"` in a file, all modules imported in that file—including child server components—are treated as part of the client module.

### **Rendering Environments**

Rendering is the process of generating the user interface from code. React 18 and Next.js introduced different strategies to render an application. You can use multiple strategies within the same application.

Two environments where code can render:
- Client (user’s browser)
- Server (deployment environment)

Client-side rendering:
- Occurs in the user’s browser
- Provides dynamic, interactive UX
- Smoother transitions and real-time data fetching
- Reduced server load and potentially lower hosting costs, as the client handles rendering
- Compatibility and performance depend on the user’s device configuration
- Potential risks: security vulnerabilities like cross-site scripting, code injection, data exposure

Server-side rendering:
- Happens on the server before sending the page to the client’s browser
- Provides a fully rendered HTML page → faster initial page load
- Fully rendered content enhances search engine rankings and social media sharing previews
- Performs well on slower devices, as rendering is done on the server
- Consistent rendering across devices, reducing compatibility issues
- Reduces the amount of client-side JS sent to the browser, enhancing security

### **Build Time vs Run Time**

After compilation (converting higher-level code to a lower-level representation), the app goes through two crucial phases: build time and run time.

Build time: Prepare application code for production—compilation, bundling, optimization.

Build/compile time occurs when running:
```bash
npm run dev
```
This command generates the build artifacts of your app containing necessary static files, bundling, optimization, dependency resolution, etc.

Run time: The period when the compiled application is actively executing—handling user interaction (inputs, events), data processing (manipulating/accessing data), and interacting with external services/APIs.

### **Runtime Environments**

A runtime environment is where a program executes, providing libraries and services that support execution.

Node.js is a JavaScript runtime that lets developers run JS outside the browser. Next.js provides two runtime environments:

- Node.js runtime: default; has access to Node APIs and ecosystem
- Edge runtime: lightweight runtime based on web APIs with limited Node API support

Next.js offers flexibility to choose the runtime—switch by changing one word.

### **Rendering Strategies (Server)**

Three strategies for server rendering:
- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)
- Server-Side Rendering (SSR)

SSG happens at build time on the server: content is generated and converted into HTML, CSS, and JS files and does not require server interaction during runtime. Generated static files can be hosted on a CDN and served as-is. The rendered content is cached and reused on subsequent requests, leading to fast delivery and less server load.

Examples: docs, blogs, news websites with largely static articles.

ISR allows updating static pages after build without rebuilding the entire site. On-demand generation creates specific pages in response to requests—a portion is rendered at build time while another is generated when needed at runtime. This reduces build time and improves overall performance. With a hybrid strategy, you can cache static content and revalidate it if needed (e.g., SSG for article detail, ISR for lists).

### **When to Use Which**

- Will the page display the same info for each request? → Yes: SSG
- No → Does the page require frequent updates (potentially every second)?
  - Yes: SSR
  - No: ISR

## **Using `next-themes`**

Using `next-themes`.


Authentication
Authentication and authorization are two essential concepts in web security.

Authentication is the process of verifying the identity of a user. It ensures that the person or entity accessing the system is who they claim to be.

Authorization, on the other hand, determines what actions a user is allowed to perform within the system after they've been authenticated. It defines the permissions and access levels granted to users based on their identity and role.
Insight
🤔 Why do we need authentication?

It is crucial for protecting sensitive information and ensuring that only authorized users can access it. It's the first line of defense against unauthorized access and data breaches.

Without proper authentication, anyone could access your system and potentially steal or manipulate your data. This could lead to financial loss, reputational damage, and legal consequences.
Types of Authentication

There are various ways to implement authentication and authorization on the web:
Session-based

With session-based authentication, a session is created on the server for each user after they log in. The server then sends a unique session identifier (usually stored as a cookie) to the client, which is used for subsequent requests to authenticate the user
Insight

🍪 What's a cookie?
A cookie is a small piece of data that a web server sends to a user's web browser. The browser then stores this data and sends it back with every subsequent request to the same server. Cookies are commonly used for various purposes, including session management, tracking user preferences, and personalizing user experiences.

You can think of cookies as a way for websites to remember users and their preferences across different sessions.
Workflow

When a user logs in, the server generates a unique session ID and stores session data (like user ID, expiration time, etc.) on the server side.
The server sets a cookie in the response containing the session ID.
For subsequent requests, the client sends the session ID along with the request.

    The server verifies the session ID against the stored session data to authenticate the user.

Pros

Secure: Session data is stored on the server, reducing the risk of token theft.
Easy to implement: Many web frameworks provide built-in support for session management.

    Automatic expiration: Sessions can be set to expire after a certain period, enhancing security.

Cons

Scalability issues: Storing session data on the server can lead to scalability challenges, especially in distributed systems.
Server-side storage: Requires server resources to manage session data, increasing server load.

    Vulnerable to CSRF attacks: Session identifiers stored in cookies can be susceptible to CSRF attacks if not properly secured.

2. Token-based (JWT)

With token-based authentication, a token containing user information is generated upon successful login and sent to the client. This token is then included in subsequent requests to authenticate the user.
Workflow

Upon successful authentication, the server generates a JWT containing user information and signs it with a secret key.
The server sends the JWT to the client, usually in the response body or as a header.
The client includes the JWT in the header of subsequent requests.

    The server verifies the JWT's signature and decodes its payload to authenticate the user.

Pros

Stateless: Tokens contain all necessary information for authentication, eliminating the need for server-side storage.
Scalable: Tokens can be easily distributed across multiple servers, improving scalability.

    Enhanced security: Tokens can be encrypted and signed to prevent tampering and unauthorized access.

Cons

Token management: Requires additional effort to manage token lifecycle, including expiration and revocation.
Token size: Tokens can be larger than session identifiers, increasing network overhead.

    Vulnerable to token theft: If not properly secured (e.g., through HTTPS), tokens can be intercepted and used by malicious actors.

3. OAuth

OAuth is a protocol for delegated authorization, allowing third-party services to access a user's resources without exposing their credentials. Users can grant limited access to their data to external applications.
Workflow

Register your application with the OAuth provider and obtain client credentials (client ID and client secret).
Redirect users to the OAuth provider's authentication endpoint.
After authentication, the OAuth provider redirects the user back to your application with an authorization code.
Exchange the authorization code for an access token and optionally a refresh token.

    Use the access token to access the user's resources on behalf of the user.

Pros

Single sign-on (SSO): Users can access multiple services with a single set of credentials, improving user experience.
Granular permissions: Users can grant limited access to their resources, enhancing privacy and security.

    Widely supported: OAuth is a widely adopted standard used by many popular services and platforms.

Cons

Complexity: Implementing OAuth can be complex, requiring understanding of the protocol and its various flows.
Trust dependency: Users must trust third-party services with access to their data, raising privacy concerns.

    Token management: Requires handling of access tokens and refresh tokens, adding complexity to authentication flow.

4. Basic authentication

Basic authentication involves users providing their credentials (username and password) with each request, encoded and sent to the server. It's simple but less secure compared to other methods.
Workflow

Clients encode the username and password in a Base64-encoded string and includes it in the request header.

    The server decodes the string, extracts the credentials, and validates them against the stored credentials.

Pros

Simple to implement: Requires minimal setup and configuration, making it easy to get started.
Universal support: Basic authentication is supported by virtually all web browsers and servers.

    No session management: Does not require server-side storage or session management, reducing server load.

Cons

Lack of security: Credentials are sent with every request, increasing the risk of interception and unauthorized access.
No encryption: Credentials are sent in plaintext, making them vulnerable to interception.
Limited functionality: Does not support features like session management or granular permissions, limiting its usability in complex applications.

authentication vs authorization
https://auth0.com/docs/authorization/concepts/authz-and-authn

session based authentication
https://roadmap.sh/guides/session-based-authentication

basic of authentication
https://roadmap.sh/guides/basics-of-authentication

jwt authentication
https://roadmap.sh/guides/jwt-authentication

<!-- 3 -->

## **Authentication with NextAuth (next-auth)** 🔐

NextAuth.js (also known as Auth.js) is the recommended authentication solution for Next.js applications.

### **Installation**

Install the beta version of NextAuth:

```bash
npm install next-auth@beta
npx auth secret
```

### **GitHub OAuth Setup** 🐙

**Step 1: Register OAuth App**

1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Click "New OAuth App"
3. Add the callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret

**Step 2: Configure Environment Variables**

Add the credentials to your `.env.local` file:

```env
AUTH_GITHUB_ID="your_github_client_id"
AUTH_GITHUB_SECRET="your_github_client_secret"
```

**GitHub Authentication Flow:**

```
1. User clicks "Sign in with GitHub"
2. Initiate auth request to NextAuth
3. NextAuth redirects to GitHub
4. User authenticates on GitHub
5. GitHub redirects back to NextAuth with authorization code
6. NextAuth exchanges auth code for access token
7. NextAuth retrieves user info from GitHub using access token
8. NextAuth creates a session for the user (session stored in cookies)
9. User is redirected back to the application with an authenticated session
```

### **Google OAuth Setup** 🔴

**Step 1: Create OAuth Credentials**

1. Go to Google Cloud Console
2. Navigate to Credentials → Create Credentials → OAuth 2.0 Client IDs
3. Create a project if you haven't already
4. Add the callback URL: `http://localhost:3000/api/auth/callback/google`
5. Copy the Client ID and Client Secret

**Step 2: Configure Environment Variables**

Add the credentials to your `.env.local` file:

```env
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"
```

---

## **State Management** 🗂️

 We didn’t really define state management. So just to do some formalities —

State management is like keeping track of everything happening in your application.
Insight

Imagine you're playing a game and need to remember your score, level, and items collected. State management is like having a scoreboard and inventory list to track all this information so you can play smoothly. It's about organizing and updating data so your app knows what's happening and can react accordingly.

There are two types of state management

    Local
    Global

Local State Management
Local State Management

It typically involves managing the data within a single component or module of an application. This local state is specific to that component and is not directly accessible or modifiable by other parts of the application unless explicitly passed down as props or through other means.

For example, (everyone’s favorite)
Counter.jsx

import React, { useState } from "react";

const Counter = () => {
  // Local state variable 'count'
  const [count, setCount] = useState(0);

  // Update local state 'count'
  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};

export default Counter;

---

## **Global State Management** 🌐

Global state management involves managing data that needs to be accessed and modified by multiple components across the application. This global state is typically stored in a centralized location, such as a global store or context, where it can be accessed and modified by any component that needs it without the need for prop drilling or passing data through multiple layers of components.

### **Example: Context API**

**CounterProvider.jsx**

```jsx
import React, { createContext, useContext, useState } from "react";

// Create a global context
const CounterContext = createContext();

// Create a provider to manage global state
const CounterProvider = ({ children }) => {
  // Global state variable 'count'
  const [count, setCount] = useState(0);

  // Update global state 'count'
  const increment = () => {
    setCount(count + 1);
  };

  return (
    <CounterContext.Provider value={{ count, increment }}>
      {children}
    </CounterContext.Provider>
  );
};

// Custom hook to access global state and updater
const useCounter = () => {
  return useContext(CounterContext);
};

export { CounterProvider, useCounter };
```

### **Using the Provider**

Next, import the provider into the main starting file of the application, wrapping everything inside it. This makes the provider the main parent of the application.

**App.jsx**

```jsx
import Counter from "./Counter";
import { CounterProvider } from "./CounterProvider";

const App = () => {
  return (
    <CounterProvider>
      <div className='App'>
        <h1>Counter App</h1>
        <Counter />
      </div>
    </CounterProvider>
  );
};

export default App;
```

### **Accessing Global State**

Utilize or access the global state in any component whose parent is CounterProvider.

**Counter.jsx**

```jsx
import { useCounter } from "./CounterProvider";

// Component using global state
const Counter = () => {
  // Access global state and updater
  const { count, increment } = useCounter();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
```

But using Context API isn’t the only solution in React.js. We have many options. Out of which, few have really grabbed industries’ attention by the way they solve some unique problems related to global state management.
Top Global State Management Libraries:

    Redux: Redux helps organize your app's data in one place using actions and reducers.
    Zustand: Zustand is a simple way to handle your app's data using React hooks.
    Context API: Context API shares data across your app without needing extra libraries.
    Recoil: Recoil makes managing data in React easier with atoms and derived states.
    MobX: MobX makes it easy to watch and update your data without extra setup.

Insight

💡 Check out this must-read documentation on Context API by the React team.

It's important to understand that there isn't a single "best" library among the others. Each one offers a unique approach to state management and addresses different problems more effectively.

Rather than debating with developers on Twitter, consider your specific problem and choose the library that best suits your needs.

So, to summarize, the main difference between these types is in the scope of the data being managed.

All the libraries we discussed earlier are popular and widely used, but then Next.js entered the scene—especially with Next.js.

By now, we know what Next.js does, what it’s about, and how it differs from previous versions or React.js in general.

If you guessed it, you’re right. Using those libraries or methods we discussed earlier in Next.js would turn your page or component into a client-side component. This goes against the core of Next.js and its server-side capabilities.

Transitioning everything to the client side in Next.js would essentially equate to using plain React.js.

Since Redux, Context API, Zustand, and others are all hook-based patterns, we can't use them on the server side, at least not for now. So, that's the issue.
Insight

💡 Why can’t we use Hooks on the server side?

React hooks rely on the component lifecycle, which is specific to the client-side rendering environment.

Hooks like useState, useEffect, or any other aren't available on the server because they interact with the DOM, which doesn't exist on the server.

However, you can simulate some hook behavior on the server using libraries like react-dom/server, but it's not the same as client-side hooks.

So what’s the solution to this problem? Is there even one? Or should we just stick to using these libraries whenever we want, without considering anything else? What should we do?

Yes, yes, we have answers to each one of them. It's not new; in fact, it's an old-school approach that most big companies have used, but it hasn't received the attention it deserves. It's pretty underrated.

Have you noticed what happens when you visit any e-commerce website like Amazon and search for something?

Let’s try it now. Visit the Amazon website, and search for anything that you like. Maybe that MacBook you have been wanting to buy for a long time or that chocolate of yours? Search it

But while searching, keep an eye on “URL”.

Now search.

If you notice carefully enough, you’ll see whatever you typed in the search box will appear in the URL as is.
Amazon SS

If I share that URL with you here and if you open it. You should be able to see the same exact results.

This, my friend, is URL as a state management. You won’t see the same effect with other ways of state management.

Lots of websites, not just Amazon, use URLs as state management to keep track of stuff. Even Supabase does it.

For example, I wanted to check how many people bought our Ultimate Next.js course. So, I clicked on a filter, and the web address changed to show that filter.

https://supabase.com/dashboard/project/xxxxxxxxxxxxxxxxxxxx/editor/xxxxx?filter=course_name%3Aeq%3Aultimate-next-js-13-course-ebook&sort=created_at%3Adesc

You see, it's completely legal and actually considered a best practice. By managing state via the URL, you can easily share links, and when someone else opens that link, they'll see the same result as you did. This also helps improve SEO.
Insight

💡 How does URL as a state management improve SEO?

When you use unique URLs to represent different states or pages within your website, each URL serves as a distinct entry point for search engines to crawl and index your content.

This means that all the variations of your content, such as different filters, sorting options, or pagination, have their own URLs, making it easier for search engines to discover and rank your pages appropriately.

In simple terms, imagine your website is like a big library, and each URL is like a unique bookshelf. When you organize your books (content) on different bookshelves (URLs), it's easier for people (search engines) to find the specific book (content) they're looking for.

This organization helps improve your website's visibility and ranking in search engine results because search engines can better understand the structure and relevance of your content.

Using unique URLs for different states or pages also makes it easier for users to share specific content and for search engines to understand the context of that content, which ultimately can lead to better search engine rankings for your website.

So is it something new in Next.js?

Not at all. You can do the URL state management in React too.

URL state management is so underrated in the dev field that it took almost a new Next.js release to make us realize how powerful it is. Otherwise, we'd just keep using states all over the place.


Before we get started with understanding how we can do URL state management in Next.js, let’s see how we can get various URL info in Next.js

A URL (Uniform Resource Locator) with parameters typically consists of several components:

    Scheme: Specifies the protocol used to access the resource, such as http:// or https://.

    Domain: The domain name or IP address of the server hosting the resource.

    Port: (Optional) Specifies the port number to which the request should be sent. Default ports are often omitted (e.g., port 80 for HTTP, port 443 for HTTPS).

    Path: The specific resource or endpoint on the server, typically represented as a series of directories and filenames.

    Query Parameters: (Also known as searchParams in Next.js) Additional data sent to the server as part of the request, typically used for filtering or modifying the requested resource. Query parameters are appended to the URL after a question mark "?" and separated by ampersands "&"

    For example: ?param1=value1¶m2=value2

    Fragment: (Optional) Specifies a specific section within the requested resource, often used in web pages to navigate to a particular section. It is indicated by a hash "#" followed by the fragment identifier.

We can retrieve this URL information in Next.js in different ways:

    Page If you’re on the main page file, then you can access the information through page props

    function Page({ params, searchParams }) {
      return <h1>My Page</h1>;
    }

    export default Page;

For example, If the URL looks like this: /books/1234/?page=2&filter=latest

Then,

    params will hold the 1234 value
    searchParams will hold page & filter values This is how you can get the info

async function Page({ params, searchParams }) {
  const { id } = await params;
  const { page, filter } = await searchParmas;

  return <h1>My Page</h1>;
}
export default Page;

Insight

💡 You can learn more about params and searchParams here

From here, you can choose to pass these values to other components or use other options to access them specifically inside that component And that other way is,

Hooks Next.js provides two specific hooks, namely useParams and useSearchParams, to retrieve the respective information from the URL This is how we can access params (dynamic part of the URL)

"use client";

import { useParams } from "next/navigation";

function ExampleClientComponent() {
  const params = useParams();

  return <p>Example Client Component</p>;
}

export default ExampleClientComponent;

Insight

You can learn more about useParams hook here. We can access searchParams (aka query parameters) of URL in the same way, using the useSearchParams hook

"use client";

import { useSearchParams } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return <>Selected Type: {type}</>;
}

    Insight

    Learn more about the useSearchParams hook here.

Yes, you’re right. Using hooks would mean turning that component into a client component.

As a rule of thumb, if your component is near its parent Page, then instead of opting for these hooks, you can pass params and searchParams of Page props to its respective children. A bit of prop drilling won’t hurt.

But if the component is far away from Page, you should use the above-mentioned hooks instead.

Now that you know how to access information from the URL, let’s see how we can add any kind of information to the URL in Next.js


As I said, it’s not related to Next.js. You can do it in React.js too. But preferring URL as state management in Next.js will solve 90% of your problems and save you from making everything client-side

So how do we do that?

Think, what happened when we visited Amazon. We typed something, hit enter, and the same thing appeared in the URL. Do the same for filters. Select something, and it appears in the URL.

Got it?

Yeah, so all we have to do is, whenever a user types something or selects something, we add that selected or typed info in the URL.

There are many ways. Let’s see how we can do that one by one using Next.js

    Next.js Link

    It’s straightforward. For example,

    <Link
      href={{
        pathname: "/jobs",
        query: { type: "softwaredeveloper" },
      }}
    >
      All Jobs
    </Link>

And doing this will result in /jobs?type=softwaredeveloper

Whatever your query is, you specify it inside the href, and whenever someone clicks on it, it’ll form the right URL with that corresponding query
Link Ref
faviconhttps://nextjs.org/docs/app/api-reference/components/link#href-required
thumbnail

Next.js Router

You can use the Next.js useRouter hook and route to any page with a query like this

"use client";

import { useRouter } from "next/navigation";

const MyComponent = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push({
      pathname: "/search",
      query: { q: "your_search_query_here" },
    });
  };

  return <button onClick={handleButtonClick}>Search</button>;
};

export default MyComponent;

And doing this will result in /search?q=your_search_query_here
Insight

💡 Yes, you’re right. Using useRouter will turn your page/component into a client page/component. So be careful when you want to use it

Programmatically

We can use a built-in JavaScript object, URLSearchParams, to create a new URL and navigate to it using useRouter or window.location

Here is a short sweet example of that,

const handleButtonClick = () => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set("q", "your_search_query_here");

  window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
};

Learn more about URLSearchParams here:
URLSearchParams
faviconhttps://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
thumbnail

For a few of you, this might feel a bit too much. But this can come super handy when we’ve to change URL parameters frequently on user actions. For example, when doing a filter. Here is what it would look like

export const updateSearchParams = (type: string, value: string) => {
  // Get the current URL search params
  const searchParams = new URLSearchParams(window.location.search);

  // Set the specified search parameter to the given value
  searchParams.set(type, value);

  // Set the specified search parameter to the given value
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
};

export const deleteSearchParams = (type: string) => {
  // Set the specified search parameter to the given value
  const newSearchParams = new URLSearchParams(window.location.search);

  // Delete the specified search parameter
  newSearchParams.delete(type.toLocaleLowerCase());

  // Construct the updated URL pathname with the deleted search parameter
  const newPathname = `${
    window.location.pathname
  }?${newSearchParams.toString()}`;

  return newPathname;
};

NPM Package

Yeah yeah, we have a library for that as well. And the one that I like and personally recommend is query-string.
query-string
faviconhttps://www.npmjs.com/package/query-string
thumbnail

But why bother using it?

The above solutions will work perfectly fine if it’s a small application where you don’t have too many things to handle in the URL.

However, as the application becomes complex, it gets a bit difficult to manage all parameters in the URL.

For example, if your application might have search, filter, and pagination all in one place. And if the user wants to search for something with a filter and pagination enabled, you have to form a query in that way, i.e., /?q=macbook&color=silver&page=2

We have to make sure that typing something in the search box doesn’t reset the parameters already present in the URL. Same with filters or pagination. Users should be able to add more parameters with ease.

This is called preserving URL history/state so we don’t lose the previous information and provide the best UX

To effectively manage this, I recommend using query-string. This is how you can create URLs while preserving their previous version,

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true },
  );
}

You can call wherever you want, like this,

/
const handleUpdateParams = (value: string) => {
  const newUrl = formUrlQuery({
    params: searchParams.toString(),
    key: "location",
    value,
  });

  router.push(newUrl);
};

Sure, there might be more options for achieving the same thing. So as I said, choose the ones that work best for you & your problem case.

But that’s how we do URL as state management in Next.js or even React.js. I hope you 