function createElemWithText(elementName = "p", textContent = "", className) {
  const newElement = document.createElement(elementName);
  newElement.textContent = textContent;
  if (className) {
    newElement.className = className;
  }
  return newElement;
}

function createSelectOptions(users) {
  if (!users) return undefined;
  const options = [];
  for (const user of users) {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    options.push(option);
  }
  return options;
}

function toggleCommentSection(postId) {
  if (postId === undefined) {
    return undefined;
  }

  const section = document.querySelector(`[data-post-id="${postId}"]`) || null;
  if (!section) {
    console.error(`Section with postId ${postId} not found`);
    return null;
  }

  section.classList.toggle('hide');
  return section;
}

function toggleCommentButton(postId) {
  if (postId === undefined) {
     return undefined;
  }

  const button = document.querySelector(`button[data-post-id="${postId}"]`);
  if (!button) {
    console.error(`Button with postId ${postId} not found`); 
    return null;
  }

  const buttonText = button.textContent.trim();

  button.textContent = buttonText === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
  return button;
}

function deleteChildElements(parentElement) {
  if (!(parentElement instanceof Element)) {
   return undefined;
  }

  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }

  return parentElement;
}

function addButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  if (buttons.length > 0) {
    for (const button of buttons) {
      const postId = button.dataset.postId;
      if (postId) {
        button.addEventListener("click", (event) => {
          toggleComments(event, postId);
        });
      }
    }
  }
  return buttons;
}

function removeButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  for (const button of buttons) {
    const postId = button.dataset.id;
    if (postId) {
      button.removeEventListener("click", (event) => {
        toggleComments(event, postId);
      });
    }
  }
  return buttons;
}

function createComments(commentsData) {
  if (!commentsData) {
    console.error('Comments data is required'); // Optional: Log an error message
    return undefined;
  }

  const fragment = document.createDocumentFragment();

  for (const comment of commentsData) {
    const article = document.createElement('article');
    const h3 = createElemWithText('h3', comment.name);
    const bodyParagraph = createElemWithText('p', comment.body);
    const emailParagraph = createElemWithText('p', `From: ${comment.email}`);

    article.appendChild(h3);
    article.appendChild(bodyParagraph);
    article.appendChild(emailParagraph);

    fragment.appendChild(article);
  }

  return fragment;
}

function populateSelectMenu(usersData) {
  if (!usersData) {
    return undefined;
  }

  const selectMenu = document.getElementById('selectMenu');
  if (!selectMenu) {
    return null;
  }

  const options = createSelectOptions(usersData);
  options.forEach((option) => {
    selectMenu.appendChild(option);
  });

  return selectMenu;
}

async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}


async function getUserPosts(userId) {
  if (userId === undefined) {
    console.error('User ID is required'); // Optional: Log an error message
    return undefined;
  }

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for user with ID ${userId}`, error); // Optional: Log an error message
    return null;
  }
}
// Function 12: getUser
async function getUser(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
  }
}


async function getPostComments(postId) {
  if (postId === undefined) {
    return undefined;
  }

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    const comments = await response.json();
    return comments;
  } catch (error) {
   return null;
  }
}

// Function 14: displayComments
async function displayComments(postId) {
  if (postId === undefined) {
     return undefined;
  }

  const section = document.createElement('section');
  section.dataset.postId = postId;
  section.classList.add('comments', 'hide');

  try {
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);
  } catch (error) {
    console.error(`Error displaying comments for post with ID ${postId}`, error); // Optional: Log an error message
    return null;
  }

  return section;
}
// Function 15: createPosts
async function createPosts(posts) {
  const fragment = document.createDocumentFragment();

  for (const post of posts) {
    const article = document.createElement("article");
    const h2 = createElemWithText("h2", post.title);
    const bodyParagraph = createElemWithText("p", post.body);
    const postIdParagraph = createElemWithText("p", `Post ID: ${post.id}`);

    const author = await getUser(post.userId);
    const authorParagraph = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
    const catchPhraseParagraph = createElemWithText("p", author.company.catchPhrase);

    const button = createElemWithText("button", "Show Comments");
    button.dataset.postId = post.id;

    article.appendChild(h2);
    article.appendChild(bodyParagraph);
    article.appendChild(postIdParagraph);
    article.appendChild(authorParagraph);
    article.appendChild(catchPhraseParagraph);
    article.appendChild(button);

    const section = await displayComments(post.id);
    article.appendChild(section);

    fragment.appendChild(article);
  }

  return fragment;
}

// Function 16: displayPosts
async function displayPosts(posts) {
  const main = document.querySelector("main");
  const element = posts ? await createPosts(posts) : createElemWithText("p", "No posts available.");
  deleteChildElements(main);
  main.appendChild(element);
  return element;
}

// Function 17: toggleComments
function toggleComments(event, postId) {
  event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);
  return [section, button];
}

// Function 18: refreshPosts
async function refreshPosts(posts) {
  if (!posts) {
    return undefined;
  }

  const removeButtons = removeButtonListeners();
  const main = document.querySelector('main');
  const fragment = deleteChildElements(main);

  try {
    await displayPosts(posts);
  } catch (error) {
   return null;
  }

  addButtonListeners();

  return [removeButtons, main, fragment];
}

// Function 19: selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(event) {
  document.getElementById("selectMenu").disabled = true;
  const userId = event.target.value || 1;
  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);
  document.getElementById("selectMenu").disabled = false;

  return [userId, posts, refreshPostsArray];
}

// Function 20: initPage
async function initPage() {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
}

// Function 21: initApp
function initApp() {
  const [users, select] = initPage();
  document.getElementById("selectMenu").addEventListener("change", selectMenuChangeEventHandler);
  return true;
}

document.addEventListener("DOMContentLoaded", initApp);
