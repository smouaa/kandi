import { supabase } from "../supabase";

const sendFriendRequest = async (senderID, recipientID) => {
  try {
    // get recipient's friend request data
    const { data: recipientData, error: recipientError } = await supabase
      .from("friend_requests")
      .select("requests")
      .eq("id", recipientID);

    if (recipientError) {
      throw recipientError;
    }

    // get their array of requests
    const existingFriendRequests = recipientData[0]?.requests || [];

    // check if already sent
    if (existingFriendRequests.includes(senderID)) {
      console.log("Friend request already sent to this user.");
      return { senderData: null, recipientData };
    }

    if (recipientData.length === 0) {
      // update if not already in requests
      await supabase.from("friend_requests").upsert(
        [
          {
            id: recipientID,
            requests: [senderID],
          },
        ],
        { onConflict: ["id"] }
      );
      return { senderData: null, recipientData: { requests: [senderID] } };
    }

    // update recipient's friend requests
    const updatedFriendRequests = [...existingFriendRequests, senderID];

    const { data: updatedRecipientData, error: updateError } = await supabase
      .from("friend_requests")
      .update({
        requests: updatedFriendRequests,
      })
      .eq("id", recipientID);

    if (updateError) {
      throw updateError;
    }

    return { senderData: null, recipientData: updatedRecipientData };
  } catch (error) {
    console.error("Error updating friend requests:", error);
    throw error;
  }
};

export default sendFriendRequest;
