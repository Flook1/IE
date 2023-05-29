import { prisma } from "@/src/server/db";


/* -------------------------------------------------------------------------- */


// get user for all general auth stuff
export const getUserAuthFull = async (user_id: string) => {
    const user = await prisma.user_main.findFirst({
      where: {
        user_id: user_id,
      },
      select: {
        user_id: true,
        business_id: true,
        email_id: true,
        pass: true,
        pass_reset_token: true,
        pass_reset_token_expiry: true,
        business_business_owner_user_idTouser_main: {
          select: {
            business_name: true
          }
        }
      },
    });

    console.log(`user from getUser ${JSON.stringify(user, null, " ")}}`);

    return user;
  };