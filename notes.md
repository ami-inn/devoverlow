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


for authentication using authjs is know n as next-auth in nxtjs

npm install next-auth@beta
npx auth secret

for to setup github
got to settings -> developer settings -> OAuth Apps -> New OAuth App
add the callback url as http://localhost:3000/api/auth/callback/github
after that copy the client id and client secret to .env.local file as shown below
AUTH_GITHUB_ID = "your_github_client_id"
AUTH_GITHUB_SECRET = "your_github_client_secret"

auth flow of github

user -> clicks signin with github -> initiate auth request to next-auth -> next-auth redirects to github -> user authenticates on github -> github redirects back to next-auth with auth code -> next-auth exchanges auth code for access token -> next-auth retrieves user info from github using access token -> next-auth creates a session for the user (session store on cookies ) -> user is redirected back to the application with an authenticated session

google auth setp
got to google cloud console -> credentials -> create credentials -> OAuth 2.0 Client IDs
create project if not created
add the callback url as http://localhost:3000/api/auth/callback/google
after that copy the client id and client secret to .env.local file as shown below
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"
 
 modify the functionalities