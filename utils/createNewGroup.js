import { supabase } from "../supabase";

const updateGroup = async (userID, groupArray) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ groups: groupArray })
      .eq("id", userID);

    if (error) {
      throw error;
    }

    console.log("Group updated successfully:", data);
  } catch (error) {
    console.error("Error updating group:", error.message);
  }
};

export default updateGroup;
