import { supabase } from "../supabase";

const markCompleted = async ({ userID, beadName }) => {
  try {
    // get data from profiles table
    const { data: userProfile, error } = await supabase
      .from("profiles")
      .select("id, incomplete_tasks, completed_tasks")
      .eq("id", userID)
      .single();

    if (error) {
      console.error("Error fetching user data:", error.message);
      return;
    }

    const { incomplete_tasks, completed_tasks } = userProfile;
    const newIncompleteTasks = incomplete_tasks || [];
    const newCompletedTasks = completed_tasks || [];

    // find index
    const beadIndex = newIncompleteTasks.indexOf(beadName);

    if (beadIndex !== -1) {
      // move the bead from incomplete_tasks to completed_tasks
      newCompletedTasks.push(beadName);
      newIncompleteTasks.splice(beadIndex, 1);

      // update info in profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          incomplete_tasks: newIncompleteTasks,
          completed_tasks: newCompletedTasks,
        })
        .eq("id", userID);

      if (updateError) {
        console.error("Error updating user data:", updateError.message);
      } else {
        console.log(`Bead "${beadName}" moved to completed_tasks`);
      }
    } else {
      console.log(`Bead "${beadName}" not found in incomplete_tasks`);
    }
  } catch (error) {
    console.error("Error moving bead to completed_tasks:", error.message);
  }
};

export default markCompleted;
