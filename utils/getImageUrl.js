import { supabase } from "../supabase";

export default getImageUrl = async (bucket, filename) => {
  try {
    const { data } = await supabase.storage
      .from(bucket)
      .getPublicUrl(`${filename}`);

    return data;
  } catch (error) {
    console.error("Error fetching public URL:", error.message);
    throw error;
  }
};
