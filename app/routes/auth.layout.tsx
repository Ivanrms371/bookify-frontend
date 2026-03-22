// auth.layout.tsx
import { Outlet, redirect } from "react-router";
import { usersApi } from "@/modules/auth/api/users.api";

export async function clientLoader() {
  try {
    const user = await usersApi.getMe();

    if (user) {
      if (user.businesses.length) {
        throw redirect(`/dashboard/${user.businesses[0].id}`);
      }
      throw redirect("/onboarding");
    }
    return null;
  } catch (error) {
    return null;
  }
}

export default function AuthLayout() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Outlet />
    </div>
  );
}
