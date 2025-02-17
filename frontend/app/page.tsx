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
  ];

  return (
    <main className="flex flex-col gap-6 py-6">
      <div>
        <h1 className="text-xl">Who is the kindest person?</h1>
      </div>
      <div className="flex flex-col gap-3">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <p>{p.votes}</p>
            <div>
              <p className="text-xs">{p.author}</p>
              <p>{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
