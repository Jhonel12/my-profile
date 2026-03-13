import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import {
  Clock3,
  MessageCircle,
  Trash2,
  Inbox,
  LogOut,
  Mail,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { ALLOWED_ADMIN_EMAIL } from "../config/admin";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: {
    seconds?: number;
  };
};

type FeedbackComment = {
  id: string;
  message: string;
  authorLabel?: string;
  userId?: string;
  createdAt?: {
    seconds?: number;
  };
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"contacts" | "comments">(
    "contacts"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const contactsQuery = query(
      collection(db, "contacts"),
      orderBy("createdAt", "desc")
    );
    const commentsQuery = query(
      collection(db, "pageReactions", "home", "comments"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeContacts = onSnapshot(
      contactsQuery,
      (snapshot) => {
        setContacts(
          snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...(docSnapshot.data() as Omit<ContactMessage, "id">),
          }))
        );
        setIsLoading(false);
      },
      (snapshotError) => {
        console.error("Error loading contacts:", snapshotError);
        setError("Unable to load contacts. Check Firestore rules.");
        setIsLoading(false);
      }
    );

    const unsubscribeComments = onSnapshot(
      commentsQuery,
      (snapshot) => {
        setComments(
          snapshot.docs.map((docSnapshot) => ({
            id: docSnapshot.id,
            ...(docSnapshot.data() as Omit<FeedbackComment, "id">),
          }))
        );
        setIsLoading(false);
      },
      (snapshotError) => {
        console.error("Error loading comments:", snapshotError);
        setError("Unable to load comments. Check Firestore rules.");
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribeContacts();
      unsubscribeComments();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  const handleDelete = async (contactId: string) => {
    const shouldDelete = window.confirm(
      "Delete this contact message permanently?"
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingId(contactId);
    setError("");

    try {
      await deleteDoc(doc(db, "contacts", contactId));
    } catch (deleteError) {
      console.error("Error deleting contact:", deleteError);
      setError("Unable to delete contact. Check Firestore rules.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const shouldDelete = window.confirm(
      "Delete this feedback comment permanently?"
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingId(commentId);
    setError("");

    try {
      await deleteDoc(doc(db, "pageReactions", "home", "comments", commentId));
    } catch (deleteError) {
      console.error("Error deleting comment:", deleteError);
      setError("Unable to delete comment. Check Firestore rules.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    const isContactsTab = activeTab === "contacts";
    const items = isContactsTab ? contacts : comments;

    if (items.length === 0) {
      return;
    }

    const shouldDelete = window.confirm(
      isContactsTab
        ? "Delete all contact messages permanently?"
        : "Delete all feedback comments permanently?"
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeletingAll(true);
    setError("");

    try {
      const batch = writeBatch(db);

      if (isContactsTab) {
        contacts.forEach((contact) => {
          batch.delete(doc(db, "contacts", contact.id));
        });
      } else {
        comments.forEach((comment) => {
          batch.delete(doc(db, "pageReactions", "home", "comments", comment.id));
        });
      }

      await batch.commit();
    } catch (deleteError) {
      console.error("Error deleting all items:", deleteError);
      setError("Unable to delete all items. Check Firestore rules.");
    } finally {
      setIsDeletingAll(false);
    }
  };

  const latestContact = contacts[0];
  const latestComment = comments[0];

  const formatTimestamp = (seconds?: number) => {
    if (!seconds) {
      return "No timestamp";
    }

    return new Date(seconds * 1000).toLocaleString();
  };

  return (
    <div className="pt-16">
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6 rounded-[1.5rem] border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-dark-800"
          >
            <div className="border-b border-gray-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_45%,#ffffff_100%)] px-5 py-5 dark:border-gray-700 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.9)_0%,rgba(15,23,42,1)_100%)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-2 inline-flex items-center rounded-full border border-primary-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-primary-700 dark:border-primary-900/40 dark:bg-white/5 dark:text-primary-300">
                    <ShieldCheck size={14} className="mr-2" />
                    Private Admin View
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Contact Inbox
                  </h1>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Message center for portfolio inquiries.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm dark:border-gray-700 dark:bg-dark-900">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                      Admin
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {ALLOWED_ADMIN_EMAIL}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-primary-500 hover:text-primary-600 dark:border-gray-700 dark:bg-dark-900 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 border-t-0 p-4 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-dark-900">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                  <Inbox size={18} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Contact Messages
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {contacts.length}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-dark-900">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <MessageCircle size={18} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Feedback Comments
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {comments.length}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-dark-900">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
                  <Clock3 size={18} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Latest Received
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatTimestamp(
                    latestContact?.createdAt?.seconds ||
                      latestComment?.createdAt?.seconds
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("contacts")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "contacts"
                    ? "bg-primary-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:border-primary-500 hover:text-primary-600 dark:border-gray-700 dark:bg-dark-800 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
                }`}
              >
                Contacts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("comments")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "comments"
                    ? "bg-primary-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:border-primary-500 hover:text-primary-600 dark:border-gray-700 dark:bg-dark-800 dark:text-gray-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
                }`}
              >
                Comments
              </button>
            </div>
            <button
              type="button"
              onClick={() => void handleDeleteAll()}
              disabled={
                isDeletingAll ||
                (activeTab === "contacts" ? contacts.length === 0 : comments.length === 0)
              }
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/40 dark:bg-dark-800 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              <Trash2 size={16} className="mr-2" />
              {isDeletingAll ? "Deleting All..." : "Delete All"}
            </button>
          </div>

          {isLoading ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-dark-800">
              <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-xl bg-primary-100 dark:bg-primary-900/20" />
              <p className="text-gray-600 dark:text-gray-300">Loading contacts...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600 shadow-sm dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
              {error}
            </div>
          ) : activeTab === "contacts" && contacts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-dark-800">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-gray-300">
                <Inbox size={28} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                No contacts yet
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                New form submissions will appear here automatically.
              </p>
            </div>
          ) : activeTab === "comments" && comments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-dark-800">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-gray-300">
                <MessageCircle size={28} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                No comments yet
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Quick Feedback comments will appear here automatically.
              </p>
            </div>
          ) : activeTab === "contacts" ? (
            <div className="grid gap-4">
              {contacts.map((contact, index) => (
                <motion.article
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="overflow-hidden rounded-[1.25rem] border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-dark-800 dark:hover:border-primary-700"
                >
                  <div className="grid gap-0 lg:grid-cols-[1.5fr_0.9fr]">
                    <div className="p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                            Inquiry
                          </div>
                          <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                            {contact.subject || "No subject"}
                          </h2>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            from {contact.name || "No name"}
                          </p>
                        </div>
                        <div className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:bg-dark-700 dark:text-gray-300">
                          {formatTimestamp(contact.createdAt?.seconds)}
                        </div>
                      </div>

                      <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {contact.message || "No message"}
                      </p>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => void handleDelete(contact.id)}
                          disabled={deletingId === contact.id}
                          className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={14} className="mr-2" />
                          {deletingId === contact.id ? "Deleting" : "Delete"}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 bg-gray-50/80 p-4 dark:border-gray-700 dark:bg-white/[0.03] lg:border-l lg:border-t-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                            <UserIcon size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                              Sender
                            </p>
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                              {contact.name || "No name"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300">
                            <Mail size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                              Email
                            </p>
                            <a
                              href={`mailto:${contact.email}`}
                              className="block truncate text-sm font-medium text-gray-700 hover:text-primary-600 hover:underline dark:text-gray-200 dark:hover:text-primary-400"
                            >
                              {contact.email || "No email"}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300">
                            <MessageSquare size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                              Status
                            </p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              New message
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {comments.map((comment, index) => (
                <motion.article
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="overflow-hidden rounded-[1.25rem] border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md dark:border-gray-700 dark:bg-dark-800 dark:hover:border-primary-700"
                >
                  <div className="grid gap-0 lg:grid-cols-[1.5fr_0.9fr]">
                    <div className="p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                            Feedback
                          </div>
                          <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                            Portfolio comment
                          </h2>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            from {comment.authorLabel || comment.userId || "Visitor"}
                          </p>
                        </div>
                        <div className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:bg-dark-700 dark:text-gray-300">
                          {formatTimestamp(comment.createdAt?.seconds)}
                        </div>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {comment.message || "No comment"}
                      </p>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => void handleDeleteComment(comment.id)}
                          disabled={deletingId === comment.id}
                          className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={14} className="mr-2" />
                          {deletingId === comment.id ? "Deleting" : "Delete"}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 bg-gray-50/80 p-4 dark:border-gray-700 dark:bg-white/[0.03] lg:border-l lg:border-t-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                            <UserIcon size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                              Visitor
                            </p>
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                              {comment.authorLabel || comment.userId || "Anonymous"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300">
                            <Clock3 size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                              Created
                            </p>
                            <p className="block truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                              {formatTimestamp(comment.createdAt?.seconds)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300">
                            <MessageSquare size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                              Type
                            </p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Quick Feedback
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminContacts;
