import { supabase } from "../supabase";
import { useState, useEffect } from "react";

const getUserInfo = async (userID) => {
  // get user info
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userID);

  if (error) {
    console.error("Error fetching profile data:", error.message);
  } else {
    console.log("User profile data:", data[0]);
    return data[0];
  }
};

export default getUserInfo;
