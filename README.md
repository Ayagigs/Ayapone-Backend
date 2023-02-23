# Ayapone-Backend-Api
Ayapone is a cryptocurrency e-commerce platform. This repository houses the core backend api codebase for Ayapone.


## Prerequisites

Softwares needed and how to install them.
- node v16.x
- mongoDB

VScode extension Required
- Prettier v9.x
  _Prettier is required...Since we al will be collaborating on this project_.

  Search `Prettier` in your vscode extensions searchbar

  Proceed to Install

  Always Format your code with prettier before committing or on save of file.


## Project Board
All user stories have been broken into task and made available in the repository Github Projects. To access them, open the repository on GitHub and then click on the Project tab.
You can also click the link below to access it:
[Repository Project](https://github.com/Ayagigs/Ayapone-Backend/projects)

Find task that are assigned to you and read the instructions/requirements. 
To start working on a task, drag the task from "Todo" board into the "In Progress" board.

## Task
Tasks have been assigned to all team members in Github using issues. So before you start, follow the steps below, go to our repository page on github, click the issues tab.

You can also lick the link below to access it:
[Repository Issues](https://github.com/Ayagigs/Ayapone-Backend/issues)

Click on the issue that was assigned to you and read the instructions. By the right hand side, you will see the status of the issue under the “Projects” section. Set it from “Todo” to “In progress”.

Then proceed with the steps below:

### Step 1 (Cloning Repo):

To clone the project, open your terminal and run the command:

```sh
git clone https://github.com/Ayagigs/Ayapone-Backend.git
```

This will clone the repository to your local computer.

>Don’t fork it! Forking will copy it in a new Repo to your Github page, but you don’t want that — you want to collaborate on the same Github Repo with your teammates.


### Step 2 (Branching):

After completing Step 1, cd into the project dir:

```sh
cd Ayapone-Backend
```

Create a branch off the ```main``` branch for the task you were assigned (assuming its productReview)

```sh
git checkout -b productReview main
```

You should be able to verify this with the command:

```sh
git branch
```

You’re now in your new branch and can start coding away.

### Step 3 (Making Commits):

>Note: As a general rule, you should git add frequently and git commit when you finish something that allows your code to work (ends up being a couple times an hour). For example, when you finish a method and the code base works, git commit like so:

```sh
git commit -m "Added function to allow Users to say 'Hello World'"
```
### Step 4 (Submitting Pull Requests):

Push to your branches

```sh
git push -u origin productReview
```

Now go to the Github Repo page. You should see the branch you pushed up in a yellow bar at the top of the page with a button to “Compare & pull request”.

Note: Alternatively, you can select the branch in the drop-down “Branch:” menu and select the branch you just pushed up. You’ll then have a “Pull request” and “Compare” button on the right hand side.


Click ```Compare & pull request```. This will take you to the ```Open a pull request``` page. From here, you should write a brief description of what you actually changed.

All PRs should be made to the staging branch hence, set the branch to be compared with as ```staging branch```.

When you’re done, click ```Create pull request```.

As soon as you’re done, got to the repository page, then, click the issues tab or click the link:

[Repository Issues](https://github.com/Ayagigs/vetly-backend/issues)

Click on the issue that you just solved and add your comments. By the right hand side, you will see the status of the issue under the “Projects” section. Set it from ```In progress``` to ```Done - Awaiting Review```.

**Notes:**

  - ALWAYS ```git pull``` before you start working on a new task. This will keep your local main branch up-to-date with origin/main.
  - Repeat above steps from 2 to 4 for any new task.
  - For update on a specific task, repeat from step 3 to 4.
  - Request a pull request to `STAGING` branch always.
  - DO NOT MERGE YOUR PULL REQUEST.
  - DO NOT WORK ON `MAIN` OR `STAGING` BRANCHE.
  - ALWAYS install dependencies each time you pull create a new branch off main.


### ENV FILE
There is a copy of the global env file in the repository with name ```.env.example```.

Make a copy of this file, then rename the new copy to ```.env```.

In your new ```.env``` file, do your configurations there as required.

The ```.env``` file have been listed in ```.gitignore``` file so as to prevent pushing to git.

> NEVER COMMIT THE ```.env``` FILE


## Running the App
From the project root directory ```Ayapone-Backend``` on your local terminal,
(replace yarn with npm, if you are using npm)
#### Install Dependencies:
```sh
yarn install
```

#### Run the app:
```sh
yarn dev
```

**HAPPY CODING**