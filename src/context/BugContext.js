import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useEffect } from "react";

const BugContext = createContext();

export const BugProvider = ({ children }) => {
  const bugPath = 'http://localhost:8080/api/bug'
  const [bugs, setBugs] = useState([]); 
  

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const res = await axios.get(bugPath);
        setBugs(res.data);
      } catch (err) {
        console.error("Failed to fetch bugs", err);
      }
    };
    fetchBugs();
  }, []);

  const addBug = async (bug) => {
    const res = await axios.post(bugPath,bug);
    const newBug = res.data;

    setBugs((prev) => [newBug, ...prev]);
    return newBug;
  };

  const updateBugStatus = async (bugId, status) => {
    const res = await axios.put(`${bugPath}/updateStatus`,{bugId, status})
    const newBug = res.data;
    setBugs((prev) => prev.map((b) => b.id === bugId ? { ...b, status: newBug.status, updatedAt: newBug.updatedAt } : b));
  };

  const assignBug = async (bugId, user) => {
    const res = await axios.put(`${bugPath}/updateAssignee`,{bugId, assignedUserId: user?.id})
    const newBug = res.data;
    setBugs((prev) => prev.map((b) => b.id === bugId ? { ...b, assignedUser: newBug.assignedUser, updatedAt: newBug.updatedAt } : b));
  };

  const addComment = (bugId, comment) => {
    setBugs((prev) => prev.map((b) =>
      b.id === bugId ? { ...b, comments: [...b.comments, comment], updatedAt: new Date() } : b
    ));
  };

  const getAllBugsByUserId = (userId) => {
    return bugs.filter(b => b.assignedUser.id === userId);
  }

  const getBugById = (id) => bugs.find((b) => b.id === id);

  return (
    <BugContext.Provider value={{ bugs, addBug, updateBugStatus, assignBug, addComment, getBugById , getAllBugsByUserId }}>
      {children}
    </BugContext.Provider>
  );
};

export const useBugs = () => useContext(BugContext);