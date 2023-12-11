import { supabase } from "../supabase"; // Import your Supabase client instance

const getPendingFriendRequests = async (id) => {
  try {
    // get requests array
    const { data: userData, error: userError } = await supabase
      .from("friend_requests")
      .select("requests")
      .eq("id", id);

    if (userError) {
      throw userError;
    }

    // return requests
    const pendingFriendRequests = userData[0]?.requests || [];
    return pendingFriendRequests;
  } catch (error) {
    console.error("Error fetching pending friend requests:", error);
    throw error;
  }
};

export default getPendingFriendRequests;
