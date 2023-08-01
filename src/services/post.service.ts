// post.services.ts
import { getDatabase } from "../orm/dbConnection";
import { Post } from "../orm/entities/Post";
import { User } from "../orm/entities/User";

// Service to create a new post
export const createPostSvc = async (content: string, authorId: number) => {
  const userRepository = getDatabase().getRepository(User);
  const author = await userRepository.findOne({ where: { id: authorId } });
  if (!author) {
    throw new Error("User not found");
  }

  const post = new Post();
  post.content = content;
  post.author = author;

  const newPost = await getDatabase().getRepository(Post).save(post);
  return newPost;
};

// Service to get all posts
export const getAllPostsSvc = async () => {
  const posts = await getDatabase()
    .getRepository(Post)
    .find({
      relations: ["author"],
    });
  return posts;
};

// Service to get a single post by ID
export const getPostByIdSvc = async (id: number) => {
  const post = await getDatabase()
    .getRepository(Post)
    .findOne({ where: { id } });
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

// Service to update a post
export const updatePostSvc = async (
  id: number,
  content: string,
  userId: number
) => {
  const postRepository = getDatabase().getRepository(Post);
  const postToUpdate = await postRepository.findOne({
    where: { id },
    relations: ["author"],
  });
  if (!postToUpdate) {
    throw new Error("Post not found");
  }
  console.log(postToUpdate);
  // Check if the current user is the author of the post
  if (postToUpdate.author.id !== userId) {
    throw new Error("Unauthorized to update the post");
  }

  postToUpdate.content = content;
  const updatedPost = await postRepository.save(postToUpdate);
  return updatedPost;
};

// Service to delete a post
export const deletePostSvc = async (id: number, userId: number) => {
  const postRepository = getDatabase().getRepository(Post);
  const postToDelete = await postRepository.findOne({
    where: { id },
    relations: ["author"],
  });
  if (!postToDelete) {
    throw new Error("Post not found");
  }

  // Check if the current user is the author of the post or an admin
  if (postToDelete.author.id !== userId) {
    throw new Error("Unauthorized to delete the post");
  }

  await postRepository.delete(id);
};
