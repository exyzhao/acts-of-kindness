"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceFrown,
  faFaceMeh,
  faFaceSmile,
} from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

interface KindnessPost {
  id: number;
  description: string;
  poster_username: number;
  created_at: string; // or Date if you convert it
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const AuthButtons = ({ session }: { session: Session | null }) => {
  return !session ? (
    <div className="flex gap-4 justify-end">
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Register
      </Link>
    </div>
  ) : (
    <div className="flex justify-between items-center">
      <p>Welcome, {session.user?.name}!</p>
      <button
        // onClick={() => signOut()}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
};

export default function Home() {
  const { data: session } = useSession();

  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<KindnessPost[]>([]);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [createPostMessage, setCreatePostMessage] = useState("");

  // selectedStates will map post IDs to a vote/reaction:
  // -1 = frown, 0 = meh, 1 = smile, or undefined if no selection.
  const [selectedStates, setSelectedStates] = useState<{
    [postId: number]: number;
  }>({});

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${apiUrl}/kindness_posts/`);
        if (!response.ok) {
          throw new Error(`Error fetching posts: status ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }

    fetchPosts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // if (!posts.length) {
  //   return <div>No posts found (or still loading)...</div>;
  // }

  // const posts = [
  //   {
  //     id: 1,
  //     user_id: "Brian Williams",
  //     description: "I helped Aagam eat his food",
  //     votes: 13,
  //   },
  //   {
  //     id: 2,
  //     user_id: "Ethan Zhao",
  //     description: "I told a really funny joke",
  //     votes: -4,
  //   },
  //   {
  //     id: 3,
  //     user_id: "Ethan Zhao",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //     votes: 89,
  //   },
  // ];

  // Upload Modal Logic
  const openModal = () => {
    setIsCreatePostModalOpen(true);
  };
  const closeModal = () => {
    setIsCreatePostModalOpen(false);
    setCreatePostMessage("");
  };

  const handleUpload = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (!session) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/kindness_posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          message: createPostMessage,
          poster_username: "Brian Williams",
        }),
      });

      if (!response.ok) {
        // e.g., 400 or 500 level error
        throw new Error(`Request failed with status ${response.status}`);
      }

      // Parse JSON from the response
      const data = await response.json();
      console.log("Post created successfully:", data);

      // Clear form fields (optional)
      closeModal();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleSelect = (postId: number, reaction: number) => {
    setSelectedStates((prev) => {
      const currentReaction = prev[postId];

      // If the user clicks the same reaction again, unselect it (remove key)
      if (currentReaction === reaction) {
        const newState = { ...prev };
        delete newState[postId];
        return newState;
      }

      // Otherwise, set to the new reaction
      return {
        ...prev,
        [postId]: reaction,
      };
    });
  };

  return (
    <main className="flex flex-col gap-6 py-6">
      <AuthButtons session={session} />

      <div>
        <h1 className="text-xl">Who is the kindest person?</h1>
        <p>Current Leader:</p>
      </div>

      {session && (
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Create New Post
        </button>
      )}

      {isCreatePostModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-md shadow-md relative min-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl mb-4">Upload New Post</h2>

            <textarea
              value={createPostMessage}
              onChange={(e) => setCreatePostMessage(e.target.value)}
              placeholder="How were you kind today?"
              className="w-full h-24 p-2 border border-gray-300 rounded-md mb-4"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-400 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <h2>Acts of Kindness</h2>
        {posts.length > 0 &&
          posts.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-md p-2 gap-2 bg-[#ffffff]"
            >
              <div className="flex items-center gap-3">
                {/* <p className="w-4">{p.votes}</p> */}
                <p className="w-4">30</p>
                <div>
                  <p className="text-xs">{p.poster_username}</p>
                  <p>{p.description}</p>
                </div>
              </div>
              <div className="flex justify-evenly">
                <div onClick={() => handleSelect(p.id, -1)}>
                  <FontAwesomeIcon
                    icon={faFaceFrown}
                    size="3x"
                    color={selectedStates[p.id] === -1 ? "red" : "gray"}
                  />
                </div>
                <div onClick={() => handleSelect(p.id, 0)}>
                  <FontAwesomeIcon
                    icon={faFaceMeh}
                    size="3x"
                    color={selectedStates[p.id] === 0 ? "#555" : "gray"}
                  />
                </div>
                <div onClick={() => handleSelect(p.id, 1)}>
                  <FontAwesomeIcon
                    icon={faFaceSmile}
                    size="3x"
                    color={selectedStates[p.id] === 1 ? "green" : "gray"}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
