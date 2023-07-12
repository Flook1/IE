## Explaining File Structure

I personally do things a little different, i like to separated based on the topic instead of by component/utils/types.
I prefer to create a folder for specific section example, orders, then split that further into components/utils/types and so on.

Does that make sense?
So main section where everything is and split into section.
the folder is /src/1

<!-- question You mentioned that there is a v1 folder, so is the v1 folder like the latest version or is it like the old version? Or is that just like a standard practice to have two versions for being safe? Does that mean there will be a version 2? -->

1, meaning version 1.

With this project, we will just keep using pages for now, so we get react query basically all setup fairly good automatically with t3.

Other folders, styles | utils | z_temp | z_test
These are just more generic folders, shouldnt be used much. more for top level and temporary testing stuff.

<!-- question Wait WDYM by top level components & lib? Which component folder are you talking about? When you mean src file, does that mean the @/components folder? -->

Top level components & lib, this is specifically for shadcn, we wont be using it specifically, we will be sticking to src file.
