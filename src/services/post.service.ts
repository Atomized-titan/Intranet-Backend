// post.services.ts
import { getDatabase } from "../orm/dbConnection";
import { PostLike } from "../orm/entities/Like";
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

// service to like a post

export const likePostSvc = async (postId: number, userId: number) => {
  await getDatabase().manager.transaction(async (manager) => {
    const userRepository = manager.getRepository(User);
    const postRepository = manager.getRepository(Post);
    const postLikeRepository = manager.getRepository(PostLike);

    const post = await postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new Error("Post not found");
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user has already liked the post
    const existingLike = await postLikeRepository
      .createQueryBuilder("like")
      .where("like.user_id=:userId", { userId })
      .andWhere("like.post_id=:postId", { postId })
      .getOne();

    if (existingLike) {
      throw new Error("Post already liked by the user");
    }

    // Create a new post like entry
    const newLike = new PostLike();
    newLike.user = user;
    newLike.post = post;
    await postLikeRepository.save(newLike);

    // Increment the likesCount in the post entity
    post.likesCount = (post.likesCount || 0) + 1;
    await postRepository.save(post);

    return newLike;
  });
};

export const unlikePostSvc = async (postId: number, userId: number) => {
  await getDatabase().manager.transaction(async (manager) => {
    const userRepository = manager.getRepository(User);
    const postRepository = manager.getRepository(Post);
    const postLikeRepository = manager.getRepository(PostLike);

    const post = await postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new Error("Post not found");
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user has liked the post
    const existingLike = await postLikeRepository
      .createQueryBuilder("like")
      .where("like.user_id=:userId", { userId })
      .andWhere("like.post_id=:postId", { postId })
      .getOne();

    if (!existingLike) {
      throw new Error("User has not liked the post");
    }

    // Delete the post like entry
    await postLikeRepository.delete(existingLike.id);

    // Decrement the likesCount in the post entity
    post.likesCount = Math.max((post.likesCount || 0) - 1, 0);
    await postRepository.save(post);
  });
};
