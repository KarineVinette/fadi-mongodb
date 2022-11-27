const response = await fetch('/api/posts');
const posts = await response.json();

const postsElm = document.querySelector('#posts');

console.log(posts);

for (let i = 0; i < posts.length; i++) {
    const postArt = document.createElement('article');
    postArt.id = `post-${posts[i].id}`;

    const postTitle = document.createElement('h3');
    postTitle.textContent = posts[i].title;
    postArt.append(postTitle);

    const postContent = document.createElement('p');
    postContent.textContent = posts[i].content;
    postArt.append(postContent);

    postsElm.append(postArt);
}