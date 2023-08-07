import useSWR from "swr";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export default function useUser() {
  async function fetchUser() {
    const { jwt } = await getSession();
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_REST}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function updateUser(newValues, isChangeEmail) {
    const { jwt } = await getSession();
    try {
      const { data } = isChangeEmail
        ? await axios.post(
            `${process.env.NEXT_PUBLIC_REST}/users/send-email-confirmation`,
            {
              ...newValues,
            },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          )
        : await axios.put(
            `${process.env.NEXT_PUBLIC_REST}/users/me`,
            {
              ...newValues,
            },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
      mutate();
      return { data: data };
    } catch (error) {
      return { error: error };
    }
  }

  const { data, error, mutate, isLoading } = useSWR("user", fetchUser);
  const userLoading = !data && isLoading;
  const userLoggedOut = !data && !isLoading;

  return {
    userData: data,
    userError: error,
    userLoading,
    userLoggedOut,
    updateUser,
    signOut,
  };
}
