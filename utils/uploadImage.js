import { supabase } from "../supabase";
import { decode } from "base64-arraybuffer";

export default uploadImageToStorage = async (
  bucketName,
  fileName,
  base64Data
) => {
  try {
    const arrayBuffer = decode(base64Data);
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: "image/png",
      });

    return { data, error };
  } catch (error) {
    return { error: error.message };
  }
};
