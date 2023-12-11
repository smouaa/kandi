import { supabase } from "../supabase";

const acceptRequest = async (userID, requesterID) => {
  try {
    // get friend requests from database
    const { data: friendRequests, error } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("id", userID);

    if (error) {
      console.error("Error fetching friend request:", error.message);
      throw error;
    }

    if (!friendRequests || friendRequests.length === 0) {
      console.error("Friend request not found.");
      return;
    }

    const friendRequest = friendRequests[0];

    // update table to remove request
    const { error: deleteError } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", friendRequest.id);

    if (deleteError) {
      console.error("Error deleting friend request:", deleteError.message);
      throw deleteError;
    }

    // get user profile
    const { data: userProfile, profileError } = await supabase
      .from("profiles")
      .select("friends")
      .eq("id", userID)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError.message);
      throw profileError;
    }

    // get friends data
    const friendsArray = userProfile?.friends || [];

    // add requester to friend list
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        friends: [...friendsArray, requesterID],
      })
      .eq("id", userID);

    if (updateProfileError) {
      console.error("Error updating user profile:", updateProfileError.message);
      throw updateProfileError;
    }

    console.log("Friend request accepted successfully.");
  } catch (error) {
    console.error("Error accepting friend request:", error.message);
    throw error;
  }
};

export default acceptRequest;
