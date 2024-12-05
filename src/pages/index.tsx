import React, { ReactNode, useEffect, useState } from "react";
import { Box, VStack, Text, Spinner, Button } from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { List, AutoSizer } from "react-virtualized";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import { Post } from "@/types/types";
import { authTokenState } from "@/state/atoms";

import withAuth from "@/components/withAuth";
import PostCard from "@/components/PostCard";
import { useApi, useDebounce } from "@/hooks";
import { ENDPOINTS, METHODS } from "@/constants/api";
import NewPostModal from "@/components/NewPostModal";

interface PostsInSearchField extends Post {
  highlightedTitle?: ReactNode;
  highlightedContent?: ReactNode;
}

// Extends Post with isNew flag. Upon new Post creation, flag triggers a green-bg animation in PostCard.tsx
interface PostsWithNewFlag extends Post {
  isNew?: boolean;
}

const Home = () => {
  const { apiCall } = useApi();
  const authToken = useRecoilValue(authTokenState);
  const router = useRouter();

  const [posts, setPosts] = useState<PostsWithNewFlag[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostsWithNewFlag[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [authorSearchQuery, setAuthorSearchQuery] = useState("");
  const [titleSearchQuery, setTitleSearchQuery] = useState("");
  const [filteredPostsInSearch, setFilteredPostsInSearch] = useState<
    PostsInSearchField[]
  >([]);
  const [noResultsText, setNoResultsText] = useState(
    "Type at least 3 characters",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await apiCall<Post[]>(ENDPOINTS.posts, METHODS.GET);
      // Ideally all posts from api should be in posts state, but since we are doing nothing with unpublished posts...
      const publishedPosts = fetchedPosts.filter((post) => post.published);
      setPosts(publishedPosts);
      setFilteredPosts(publishedPosts);

      const uniqueAuthors = Array.from(
        new Set(fetchedPosts.map((post) => post.authorId)),
      );
      setAuthors(uniqueAuthors);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const searchByAuthor = async (authorId: string) => {
    setLoading(true);
    try {
      const userPosts = await apiCall<Post[]>(
        ENDPOINTS.postsByUser(authorId),
        METHODS.GET,
      );
      setFilteredPosts(userPosts);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByAuthor = (item) => {
    const authorId = item.item.value;
    searchByAuthor(authorId);
    setAuthorSearchQuery(authorId);
  };

  const resetFilters = async () => {
    setAuthorSearchQuery("");
    setTitleSearchQuery("");
    // await fetchAllPosts();
    setFilteredPosts(posts);
  };

  const handleCreatePost = async (title: string, content: string) => {
    const newPost = await apiCall<Post>(ENDPOINTS.posts, METHODS.POST, {
      title,
      content,
    });
    // const newPost = { title, content, createdAt: "", updatedAt: "", id: "12", authorId: "asd", published: true }
    const postWithFlag = { ...newPost, isNew: true };
    setPosts((prevPosts) => [postWithFlag, ...prevPosts]);
    setFilteredPosts((prevPosts) => [postWithFlag, ...prevPosts]);
  };

  const handleSearchByContentOrTitle = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  // When searching posts by title or content, the matching part will be highlighted
  const highlightMatch = (text: string, query: string) => {
    const matchIndex = text.toLowerCase().indexOf(query.toLowerCase());

    if (matchIndex === -1) {
      return text;
    }

    // Define the snippet range around the match and slice it
    const snippetStart = Math.max(0, matchIndex - 50);
    const snippetEnd = Math.min(text.length, matchIndex + 50 + query.length);
    const snippet = text.slice(snippetStart, snippetEnd);

    // Highlight the matching part in the snippet
    const parts = snippet.split(new RegExp(`(${query})`, "gi"));
    const highlightedSnippet = parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <b key={index} className="text-blue-500">
          {part}
        </b>
      ) : (
        part
      ),
    );

    const addEllipsisStart = snippetStart > 0;
    const addEllipsisEnd = snippetEnd < text.length;

    return (
      <>
        {addEllipsisStart && "..."}
        {highlightedSnippet}
        {addEllipsisEnd && "..."}
      </>
    );
  };

  const rowRenderer = ({ index, key, style }: any) => {
    const post = filteredPosts[index];
    return (
      <div key={key} style={style}>
        <Link href={`/posts/${post.id}`} passHref>
          <PostCard
            title={post.title}
            content={post.content}
            isNew={post.isNew}
          />
        </Link>
      </div>
    );
  };

  // Fetch all posts on component mount
  useEffect(() => {
    if (authToken) {
      fetchAllPosts();
    }
  }, []);

  const debouncedTitleQuery = useDebounce(titleSearchQuery, 600);

  useEffect(() => {
    if (debouncedTitleQuery.length < 3) {
      setFilteredPostsInSearch([]);
      setNoResultsText("Type at least 3 characters");
      return;
    }

    const filtered = posts
      .filter(
        (post) =>
          post.title
            .toLowerCase()
            .includes(debouncedTitleQuery.toLowerCase()) ||
          post.content
            .toLowerCase()
            .includes(debouncedTitleQuery.toLowerCase()),
      )
      .map((post) => ({
        ...post,
        highlightedTitle: highlightMatch(post.title, debouncedTitleQuery),
        highlightedContent: highlightMatch(post.content, debouncedTitleQuery),
      }));

    setFilteredPostsInSearch(filtered);
    if (filtered.length === 0) setNoResultsText("No Results");
  }, [debouncedTitleQuery]);

  return (
    <Box
      className="flex flex-col min-h-screen bg-gray-50 text-black fixed w-full"
      style={{ minWidth: "100vw" }}
    >
      <Head>
        <title>Posts Management Application</title>
        <meta
          name="description"
          content="Browse and manage posts with advanced search and filtering options."
        />
        <meta
          name="keywords"
          content="Posts, Blog, Next.js, Chakra UI, React, Management"
        />
        <meta name="author" content="ThinkEasy s.r.o. by Nathan Danzmann" />
      </Head>
      <Box as="main" className="flex-grow p-4">
        {error && <Text color="red.500">{error}</Text>}

        <Box className="mb-4 p-4 bg-white rounded shadow-md">
          <Box className="mb-4">
            <Text mb={2}>Search by Title/Content:</Text>
            <AutoComplete
              openOnFocus
              // We are using a custom find algorithm
              disableFilter={true}
              onSelectOption={(item) => {
                handleSearchByContentOrTitle(item.item.value);
              }}
            >
              <AutoCompleteInput
                placeholder="Search posts by title or content..."
                className="min-w-5"
                value={titleSearchQuery}
                onChange={(el) => setTitleSearchQuery(el.target.value)}
              />
              <AutoCompleteList>
                {filteredPostsInSearch.length > 0 ? (
                  filteredPostsInSearch.map((post) => (
                    <AutoCompleteItem key={post.id} value={post.id}>
                      <div>
                        <Text fontWeight="bold">{post.highlightedTitle}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {post.highlightedContent}
                        </Text>
                      </div>
                    </AutoCompleteItem>
                  ))
                ) : (
                  <AutoCompleteItem
                    value={0}
                    disabled
                    className="w-full d-flex justify-center text-center bg-white"
                  >
                    <Text align="center bg-white text-bold">
                      {noResultsText}
                    </Text>
                  </AutoCompleteItem>
                )}
              </AutoCompleteList>
            </AutoComplete>
          </Box>

          <Box>
            <Text mb={2}>Search by Author ID:</Text>
            <AutoComplete openOnFocus onSelectOption={handleSearchByAuthor}>
              <AutoCompleteInput
                placeholder="Search posts by author ID..."
                className="min-w-5"
                value={authorSearchQuery}
                onChange={(el) => setAuthorSearchQuery(el.target.value)}
              />
              <AutoCompleteList>
                {authors.map((authorId) => (
                  <AutoCompleteItem key={authorId} value={authorId}>
                    {authorId}
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </AutoComplete>
            <Text
              mt={2}
              color="blue.500"
              onClick={resetFilters}
              className="cursor-pointer hover:underline"
            >
              Reset Filters
            </Text>
            <Button
              mt={4}
              colorScheme="green"
              onClick={() => setIsModalOpen(true)}
            >
              New Post
            </Button>
          </Box>
        </Box>

        <Box
          className="h-[52vh] overflow-y-hidden rounded shadow-md bg-gray-100 p-4"
          borderWidth="1px"
        >
          {loading ? (
            <Box className="flex justify-center items-center">
              <Spinner size="lg" />
            </Box>
          ) : filteredPosts.length > 0 ? (
            <VStack spacing={4} align="stretch" minHeight={600}>
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    width={width}
                    height={height}
                    rowHeight={100}
                    rowCount={filteredPosts.length}
                    rowRenderer={rowRenderer}
                  />
                )}
              </AutoSizer>
            </VStack>
          ) : (
            <Text className="text-black">No posts available.</Text>
          )}
        </Box>
      </Box>

      <NewPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePost}
      />
    </Box>
  );
};

export default withAuth(Home);
