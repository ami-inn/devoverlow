import { auth } from "@/auth";


const Home = async () => {
  const session = await auth();
  console.log("Session:", session);
  return (
    <div>
      <h2 className='h2-bold font-space-grotesk'>
        Welcome to Next.js!
      </h2>
     
    </div>
  )
}

export default Home
