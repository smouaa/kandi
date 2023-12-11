import getUserInfo from "./getUserInfo";

export default async function fetchUsersInfo(userIds) {
  try {
    const infoPromises = userIds.map(async (userId) => {
      const user = await getUserInfo(userId);
      return user;
    });

    const usersInfo = await Promise.all(infoPromises);

    // sort users alphabetically
    const sortedUsers = usersInfo.sort((a, b) => a.name.localeCompare(b.name));

    // sort into sections (by letter)
    const sections = sortedUsers.reduce((acc, user) => {
      if (user && user.name) {
        const firstLetter = user.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push({
          name: user.name,
          username: user.username,
          avatar_url: user.avatar_url,
        });
      }
      return acc;
    }, {});

    // convert into object where letters are keys and values are users
    const sectionsArray = Object.entries(sections).map(([letter, data]) => ({
      title: letter,
      data,
    }));

    return sectionsArray;
  } catch (error) {
    console.error("Error fetching users info:", error.message);
    throw error;
  }
}
