import React, { useState } from "react";

interface UserProfile {
  avatar_url: string;
  name: string;
  login: string;
  location: string;
  bio: string;
  followers: number;
  following: number;
  html_url: string;
}

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setLoading(true);
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("User not found");
      const userData = await userRes.json();
      setUser(userData);

      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const repoData = await repoRes.json();
      setRepos(repoData);
    } catch (err: any) {
      setError(err.message);
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>GitHub Profile Viewer</h2>

      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "0.5rem", width: "250px" }}
      />
      <button
        onClick={handleSearch}
        style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {user && (
        <div style={{ marginTop: "2rem" }}>
          <img
            src={user.avatar_url}
            alt="Avatar"
            width={100}
            style={{ borderRadius: "50%" }}
          />
          <h3>{user.name || "No name provided"}</h3>
          <p>Username: {user.login}</p>
          <p>Location: {user.location || "N/A"}</p>
          <p>Bio: {user.bio || "N/A"}</p>
          <p>
            Followers: {user.followers} | Following: {user.following}
          </p>
          <a href={user.html_url} target="_blank" rel="noopener noreferrer">
            View GitHub Profile
          </a>
        </div>
      )}

      {repos.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Repositories</h3>
          <ul>
            {repos.map((repo) => (
              <li key={repo.id} style={{ marginBottom: "1rem" }}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
                <p>{repo.description}</p>
                <small>
                  ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count} | 🛠{" "}
                  {repo.language}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
