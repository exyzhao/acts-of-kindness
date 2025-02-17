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
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      votes: 89,
    },
  ];

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
      </div>
      <div className="flex flex-col gap-5">
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
