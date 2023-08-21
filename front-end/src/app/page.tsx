import LoginComponent from "@/components/Login"
import SignupComponent from "@/components/Signup"
import ThemeToggle from "@/components/ThemeToggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="grid place-content-center h-screen gap-4">
      <Tabs defaultValue="login" className="w-[350px] max-[350px]:w-screen">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginComponent />
        </TabsContent>
        <TabsContent value="signup">
          <SignupComponent />
        </TabsContent>
      </Tabs>
    </main>
  )
}
