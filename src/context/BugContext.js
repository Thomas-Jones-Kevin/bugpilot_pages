import { createContext, useContext, useState } from "react";

const BugContext = createContext();

const INITIAL_BUGS = [
  { _id:"1", title:"Login page crashes on Safari",  description:"When a user tries to log in using Safari browser on macOS, the page crashes immediately.", severity:"critical",    aiSeverity:"critical",    status:"open",         priority:"high",   createdBy:{ name:"QA Tester" }, assignedTo:{ _id:"2", name:"Dev User" }, comments:[], createdAt: new Date(), updatedAt: new Date() },
  { _id:"2", title:"Button color wrong on hover",   description:"The primary action button turns grey instead of dark blue when hovered.",                  severity:"trivial",     aiSeverity:"trivial",     status:"resolved",     priority:"low",    createdBy:{ name:"QA Tester" }, assignedTo:{ _id:"2", name:"Dev User" }, comments:[{ user:{ name:"Dev User" }, text:"Fixed in latest commit.", createdAt: new Date() }], createdAt: new Date(), updatedAt: new Date() },
  { _id:"3", title:"Table overflows on mobile",     description:"On screen widths below 480px, the bug list table overflows the container.",                severity:"major",       aiSeverity:"major",       status:"in-progress",  priority:"medium", createdBy:{ name:"QA Tester" }, assignedTo:null,                          comments:[], createdAt: new Date(), updatedAt: new Date() },
  { _id:"4", title:"Add dark mode support",         description:"Users have requested a dark mode toggle in the settings page.",                            severity:"enhancement", aiSeverity:"enhancement", status:"open",         priority:"low",    createdBy:{ name:"Admin" },     assignedTo:null,                          comments:[], createdAt: new Date(), updatedAt: new Date() },
  { _id:"5", title:"App freezes on file upload",    description:"When uploading a file larger than 5MB the entire application becomes unresponsive.",       severity:"blocker",     aiSeverity:"blocker",     status:"under-review", priority:"high",   createdBy:{ name:"QA Tester" }, assignedTo:{ _id:"2", name:"Dev User" }, comments:[], createdAt: new Date(), updatedAt: new Date() },
  { _id:"6", title:"Typo in settings page label",   description:"The word 'Acount' should be 'Account' in the settings page header.",                      severity:"trivial",     aiSeverity:"trivial",     status:"open",         priority:"low",    createdBy:{ name:"QA Tester" }, assignedTo:{ _id:"2", name:"Dev User" }, comments:[], createdAt: new Date(), updatedAt: new Date() },
  { _id:"7", title:"Password reset email not sent", description:"Users report that the password reset email is never received after requesting it.",        severity:"critical",    aiSeverity:"critical",    status:"in-progress",  priority:"high",   createdBy:{ name:"Admin" },     assignedTo:{ _id:"2", name:"Dev User" }, comments:[], createdAt: new Date(), updatedAt: new Date() },
  { _id:"8", title:"404 error on profile page",     description:"Navigating to /profile throws a 404 error for certain user IDs.",                         severity:"major",       aiSeverity:"major",       status:"open",         priority:"medium", createdBy:{ name:"QA Tester" }, assignedTo:null,                          comments:[], createdAt: new Date(), updatedAt: new Date() },
];

export const BugProvider = ({ children }) => {
  const [bugs, setBugs] = useState(INITIAL_BUGS);

  const addBug = (bug) => {
    const newBug = {
      ...bug,
      _id:       Date.now().toString(),
      comments:  [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBugs((prev) => [newBug, ...prev]);
    return newBug;
  };

  const updateBugStatus = (bugId, status) => {
    setBugs((prev) => prev.map((b) => b._id === bugId ? { ...b, status, updatedAt: new Date() } : b));
  };

  const assignBug = (bugId, user) => {
    setBugs((prev) => prev.map((b) => b._id === bugId ? { ...b, assignedTo: user, updatedAt: new Date() } : b));
  };

  const addComment = (bugId, comment) => {
    setBugs((prev) => prev.map((b) =>
      b._id === bugId ? { ...b, comments: [...b.comments, comment], updatedAt: new Date() } : b
    ));
  };

  const getBugById = (id) => bugs.find((b) => b._id === id);

  return (
    <BugContext.Provider value={{ bugs, addBug, updateBugStatus, assignBug, addComment, getBugById }}>
      {children}
    </BugContext.Provider>
  );
};

export const useBugs = () => useContext(BugContext);