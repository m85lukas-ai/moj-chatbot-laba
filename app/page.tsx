import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSession } from "@/lib/session";
import Chat from "./Chat";
import Login from "./Login";

export default async function Home() {
  const cookieStore = await cookies();
  const loggedIn = isValidSession(cookieStore.get(SESSION_COOKIE)?.value);
  return loggedIn ? <Chat /> : <Login />;
}
