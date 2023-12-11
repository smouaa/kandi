import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import getUserInfo from "../utils/getUserInfo";

const getUserGroups = async (userID) => {
  // get user's groups given id
  const user = await getUserInfo(userID);
  const groups = user?.groups || [];
  return groups;
};

export default getUserGroups;
