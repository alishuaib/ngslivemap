import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
    providers:[
        GoogleProvider({
            clientId:process.env.GCLIENT_ID,
            clientSecret: process.env.GCLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log( user, account, profile, email, credentials )
            const response=await fetch(process.env.NEXTAUTH_URL+'/api/login',{
                method: 'POST',
                headers:{
                    'Authorization':process.env.NEXT_PUBLIC_API_KEY,
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(user)
            })   
            const res=await response.json()
            if (["admin","collab"].includes(res.access)) {
                return true
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/'
            }
        }
      }
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}