"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceFrown,
  faFaceMeh,
  faFaceSmile,
} from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

export default function Home() {
  const posts = [
    {
      id: 1,
      author: "Brian Williams",
      text: "I helped Aagam eat his food",
      votes: 13,
    },
    {
      id: 2,
      author: "Ethan Zhao",
      text: "I told a really funny joke",
      votes: -4,
    },
    {
      id: 3,
      author: "Ethan Zhao",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      votes: 89,
    },
  ];

  // Upload Modal Logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postText, setPostText] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setPostText("");
  };

  const handleUpload = () => {
    console.log("New post content:", postText);
    closeModal();
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
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
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
        {posts.map((p) => (
          <div key={p.id} className="flex flex-col border rounded-md p-2 gap-2">
            <div className="flex items-center gap-3">
              <p className="w-4">{p.votes}</p>
              <div>
                <p className="text-xs">{p.author}</p>
                <p>{p.text}</p>
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
