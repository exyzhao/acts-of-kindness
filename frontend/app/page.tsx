"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceFrown,
  faFaceMeh,
  faFaceSmile,
} from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";

interface KindnessPost {
  id: number;
  description: string;
  poster_username: number;
  created_at: string; // or Date if you convert it
}

export default function Home() {
  const [posts, setPosts] = useState<KindnessPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("http://localhost:8000/kindness_posts/");
        if (!response.ok) {
          throw new Error(`Error fetching posts: status ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
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
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setDescription("");
  };

  const handleUpload = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/kindness_posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
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

  // selectedStates will map post IDs to a vote/reaction:
  // -1 = frown, 0 = meh, 1 = smile, or undefined if no selection.
  const [selectedStates, setSelectedStates] = useState<{
    [postId: number]: number;
  }>({});

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
      <div>
        <h1 className="text-xl">Who is the kindest person?</h1>
        <p>Current Leader:</p>
      </div>

      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Create New Post
      </button>
      {isModalOpen && (
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              className="flex flex-col border rounded-md p-2 gap-2"
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
