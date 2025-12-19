import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";


const Home = async () => {
  const session = await auth();
  console.log("Session:", session);
  return (
    <div>
      <h2 className='h2-bold font-space-grotesk'>
        Welcome to Next.js!
      </h2>
      <form  className="px-10 pt-[100px]" action={async ()=>{
        'use server';
        await signOut({redirectTo:ROUTES.SIGN_IN});
      }}>
        <Button type="submit">
          Sign Out
        </Button>
  
        
    
      </form>
    </div>
  )
}

export default Home
