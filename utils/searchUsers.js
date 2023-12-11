import { supabase } from "../supabase";

const searchUsers = async (partialUsername, userID) => {
  try {
    // get users
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `%${partialUsername}%`)
      .neq("id", userID);

    if (error) {
      throw error;
    }

    // return list of users with matching usernames
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export default searchUsers;
