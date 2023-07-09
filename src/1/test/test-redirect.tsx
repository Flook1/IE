import { objUrl } from "@/src/1/gen/types/urls";



// i dont know if this works
export const redirectTest = (redirect: boolean) => {
  if (!redirect) {
    return
  }

  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };

};
